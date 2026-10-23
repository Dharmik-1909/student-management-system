import React from 'react';
import { Link } from 'react-router-dom';
import StudentThumb from './StudentThumb';

export default function StudentRow({ student, onDelete, disabled }) {
  const id = encodeURIComponent(student.id);
  return (
    <tr>
      <td><StudentThumb student={student} /></td>
      <td>{student.rollNumber}</td>
      <td>
        <Link to={`/students/${id}`} className="fw-semibold text-decoration-none">
          {student.name}
        </Link>
      </td>
      <td>{student.class}</td>
      <td>{student.email}</td>
      <td>{student.phone}</td>
      <td>{student.age}</td>
      <td>{student.grade}</td>
      <td>{student.marks}</td>
      <td className="text-end text-nowrap">
        <Link to={`/students/${id}`} className="btn btn-sm btn-outline-secondary me-1">View</Link>
        <Link to={`/students/${id}/edit`} className="btn btn-sm btn-outline-primary me-1">Edit</Link>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={() => onDelete(student)}
          disabled={disabled}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
