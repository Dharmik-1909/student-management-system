import React, { useState } from 'react';

const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || '?';

export default function StudentThumb({ student, large = false }) {
  const [failed, setFailed] = useState(false);
  const size = large ? ' student-thumb-lg' : '';

  if (student.image && !failed) {
    return (
      <img
        className={`student-thumb${size}`}
        src={student.image}
        alt={`${student.name}`}
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <span className={`student-thumb student-thumb-fallback${size}`} aria-hidden="true">
      {initials(student.name)}
    </span>
  );
}
