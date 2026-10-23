const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s()]{7,15}$/;

export const emptyStudent = {
  name: '',
  rollNumber: '',
  class: '',
  phone: '',
  email: '',
  age: '',
  grade: '',
  marks: '',
  image: '',
};

export function toFormValues(student) {
  const values = { ...emptyStudent };
  Object.keys(emptyStudent).forEach((key) => {
    if (student[key] !== undefined && student[key] !== null) values[key] = String(student[key]);
  });
  return values;
}

export function toPayload(values) {
  const trimmed = {};
  Object.keys(values).forEach((key) => {
    trimmed[key] = String(values[key]).trim();
  });
  return { ...trimmed, age: Number(trimmed.age), marks: Number(trimmed.marks) };
}

/** Returns an object of { field: message }. Empty object means valid. */
export function validateStudent(values, students = [], currentId = null) {
  const v = {};
  Object.keys(emptyStudent).forEach((key) => {
    v[key] = String(values[key] === undefined || values[key] === null ? '' : values[key]).trim();
  });
  const errors = {};

  if (!v.name) errors.name = 'Name is required.';
  if (!v.rollNumber) errors.rollNumber = 'Roll number is required.';
  if (!v.class) errors.class = 'Class is required.';
  if (!v.grade) errors.grade = 'Grade is required.';
  if (!v.email) errors.email = 'Email is required.';
  else if (!EMAIL_RE.test(v.email)) errors.email = 'Enter a valid email address.';
  if (!v.phone) errors.phone = 'Phone is required.';
  else if (!PHONE_RE.test(v.phone)) errors.phone = 'Enter a valid phone number.';

  if (!v.age) errors.age = 'Age is required.';
  else if (!Number.isInteger(Number(v.age)) || Number(v.age) < 3 || Number(v.age) > 100) {
    errors.age = 'Age must be a whole number between 3 and 100.';
  }
  if (!v.marks) errors.marks = 'Marks are required.';
  else if (!Number.isFinite(Number(v.marks)) || Number(v.marks) < 0 || Number(v.marks) > 100) {
    errors.marks = 'Marks must be a number between 0 and 100.';
  }
  if (v.image && !/^https?:\/\//i.test(v.image)) errors.image = 'Image must be an http(s) URL.';

  if (!errors.rollNumber) {
    const roll = v.rollNumber.toLowerCase();
    const clash = students.some(
      (s) =>
        String(s.id) !== String(currentId) &&
        String(s.rollNumber).trim().toLowerCase() === roll
    );
    if (clash) errors.rollNumber = 'This roll number is already used by another student.';
  }
  return errors;
}
