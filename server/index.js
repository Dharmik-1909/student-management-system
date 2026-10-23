/**
 * Student Management System API
 *
 * JSON Server handles the student CRUD API and writes to the existing db.json.
 * Because JSON Server has no authentication of its own, this thin wrapper adds:
 *   - POST /auth/login  -> verifies the admin account (server/admin.json, hashed)
 *   - GET  /auth/me     -> validates a session token
 *   - Bearer-token protection on every /students endpoint
 *   - Server-side validation of student writes (incl. unique roll number)
 * Admin credentials are never stored in db.json, so they cannot leak via /students.
 */
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const jsonServer = require('json-server');

const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
const DB_FILE = path.join(__dirname, '..', 'db.json');
const ADMIN_FILE = path.join(__dirname, 'admin.json');
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours
const SECRET = process.env.AUTH_SECRET || crypto.randomBytes(32).toString('hex');

/* ---------------- token helpers (HMAC-signed, expiring) ---------------- */
const hmac = (data) => crypto.createHmac('sha256', SECRET).update(data).digest();

function signToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${hmac(body).toString('base64url')}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const given = Buffer.from(sig, 'base64url');
  const expected = hmac(body);
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    return payload.exp > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

/* ---------------- admin credential check ---------------- */
function loadAdmin() {
  try {
    return JSON.parse(fs.readFileSync(ADMIN_FILE, 'utf8'));
  } catch {
    return null;
  }
}

function credentialsValid(username, password) {
  const admin = loadAdmin();
  if (!admin || typeof username !== 'string' || typeof password !== 'string') return false;
  const candidate = crypto.scryptSync(password, admin.salt, 64);
  const stored = Buffer.from(admin.hash, 'hex');
  const passwordOk = candidate.length === stored.length && crypto.timingSafeEqual(candidate, stored);
  return passwordOk && username === admin.username;
}

/* ---------------- simple login throttling ---------------- */
const attempts = new Map(); // ip -> { count, lockedUntil }
const MAX_ATTEMPTS = 5;
const LOCK_MS = 60 * 1000;

/* ---------------- student validation ---------------- */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s()]{7,15}$/;
const text = (v) => (v === undefined || v === null ? '' : String(v).trim());

function validateStudent(data, students, currentId) {
  const errors = {};
  if (!text(data.name)) errors.name = 'Name is required.';
  if (!text(data.rollNumber)) errors.rollNumber = 'Roll number is required.';
  if (!text(data.class)) errors.class = 'Class is required.';
  if (!text(data.grade)) errors.grade = 'Grade is required.';
  if (!EMAIL_RE.test(text(data.email))) errors.email = 'Enter a valid email address.';
  if (!PHONE_RE.test(text(data.phone))) errors.phone = 'Enter a valid phone number.';

  const age = Number(data.age);
  if (text(data.age) === '' || !Number.isInteger(age) || age < 3 || age > 100) {
    errors.age = 'Age must be a whole number between 3 and 100.';
  }
  const marks = Number(data.marks);
  if (text(data.marks) === '' || !Number.isFinite(marks) || marks < 0 || marks > 100) {
    errors.marks = 'Marks must be a number between 0 and 100.';
  }
  const image = text(data.image);
  if (image && !/^https?:\/\//i.test(image)) errors.image = 'Image must be an http(s) URL.';

  if (!errors.rollNumber) {
    const roll = text(data.rollNumber).toLowerCase();
    const clash = students.some(
      (s) => String(s.id) !== String(currentId) && text(s.rollNumber).toLowerCase() === roll
    );
    if (clash) errors.rollNumber = 'This roll number is already used by another student.';
  }
  return errors;
}

function cleanStudent(data) {
  return {
    name: text(data.name),
    rollNumber: text(data.rollNumber),
    class: text(data.class),
    phone: text(data.phone),
    email: text(data.email),
    age: Number(data.age),
    grade: text(data.grade),
    marks: Number(data.marks),
    image: text(data.image),
  };
}

/* ---------------- server ---------------- */
const server = jsonServer.create();
const router = jsonServer.router(DB_FILE);

// CORS (restricted to the React dev origin)
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', CLIENT_ORIGIN);
  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('X-Content-Type-Options', 'nosniff');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
server.use(jsonServer.bodyParser);

server.post('/auth/login', (req, res) => {
  const ip = req.ip;
  const record = attempts.get(ip) || { count: 0, lockedUntil: 0 };
  if (record.lockedUntil > Date.now()) {
    return res.status(429).json({ message: 'Too many failed attempts. Try again in a minute.' });
  }
  const { username, password } = req.body || {};
  if (!credentialsValid(username, password)) {
    record.count += 1;
    if (record.count >= MAX_ATTEMPTS) {
      record.count = 0;
      record.lockedUntil = Date.now() + LOCK_MS;
    }
    attempts.set(ip, record);
    return res.status(401).json({ message: 'Invalid username or password.' });
  }
  attempts.delete(ip);
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const token = signToken({ sub: username, exp: expiresAt });
  res.json({ token, user: { username }, expiresAt });
});

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const payload = verifyToken(header.startsWith('Bearer ') ? header.slice(7) : '');
  if (!payload) return res.status(401).json({ message: 'Your session has expired. Please sign in again.' });
  req.admin = payload;
  next();
}

server.get('/auth/me', requireAuth, (req, res) => {
  res.json({ user: { username: req.admin.sub }, expiresAt: req.admin.exp });
});

// Only the students collection is exposed; everything else is 404.
server.use((req, res, next) => {
  if (!/^\/students(\/|$)/.test(req.path)) return res.status(404).json({ message: 'Not found.' });
  next();
});
server.use(requireAuth);

server.use((req, res, next) => {
  if (!['POST', 'PUT', 'PATCH'].includes(req.method)) return next();
  const match = req.path.match(/^\/students\/([^/]+)$/);
  const currentId = match ? decodeURIComponent(match[1]) : null;
  const students = router.db.get('students').value();
  const existing = currentId ? students.find((s) => String(s.id) === currentId) : null;

  if (req.method === 'POST' && currentId) return res.status(404).json({ message: 'Not found.' });
  if (req.method !== 'POST' && !currentId) return res.status(404).json({ message: 'Not found.' });
  if (currentId && !existing) return res.status(404).json({ message: 'Student not found.' });

  const candidate = req.method === 'PATCH' ? { ...existing, ...req.body } : req.body || {};
  const errors = validateStudent(candidate, students, currentId);
  if (Object.keys(errors).length) {
    return res.status(400).json({ message: Object.values(errors)[0], errors });
  }
  // Keep the original id and any extra fields already stored on the record.
  req.body = existing
    ? { ...existing, ...cleanStudent(candidate), id: existing.id }
    : cleanStudent(candidate);
  next();
});

server.use(router);

// eslint-disable-next-line no-unused-vars
server.use((err, req, res, next) => {
  res.status(400).json({ message: 'Invalid request.' });
});

server.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT} (students: ${router.db.get('students').size().value()})`);
  if (!loadAdmin()) console.warn('No admin account found. Run: npm run set-admin -- <username> <password>');
});
