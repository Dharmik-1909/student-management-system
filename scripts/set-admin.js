// Usage: npm run set-admin -- <username> <password>
// Writes a salted scrypt hash to server/admin.json (never to db.json).
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const [username, password] = process.argv.slice(2);
if (!username || !password || password.length < 8) {
  console.error('Usage: npm run set-admin -- <username> <password>   (password: 8+ characters)');
  process.exit(1);
}
const salt = crypto.randomBytes(16).toString('hex');
const hash = crypto.scryptSync(password, salt, 64).toString('hex');
fs.writeFileSync(
  path.join(__dirname, '..', 'server', 'admin.json'),
  JSON.stringify({ username, salt, hash }, null, 2) + '\n'
);
console.log(`Admin account "${username}" saved to server/admin.json`);
