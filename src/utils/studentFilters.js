export const SORT_OPTIONS = [
  { value: '', label: 'Default order' },
  { value: 'name-asc', label: 'Name (A–Z)' },
  { value: 'name-desc', label: 'Name (Z–A)' },
  { value: 'roll-asc', label: 'Roll number (low to high)' },
  { value: 'roll-desc', label: 'Roll number (high to low)' },
  { value: 'marks-asc', label: 'Marks (low to high)' },
  { value: 'marks-desc', label: 'Marks (high to low)' },
];

export function getClasses(students) {
  return [...new Set(students.map((s) => s.class).filter(Boolean))].sort((a, b) =>
    String(a).localeCompare(String(b), undefined, { numeric: true })
  );
}

const compareRoll = (a, b) => {
  const x = String(a.rollNumber ?? '');
  const y = String(b.rollNumber ?? '');
  const nx = Number(x);
  const ny = Number(y);
  if (x !== '' && y !== '' && Number.isFinite(nx) && Number.isFinite(ny)) return nx - ny;
  return x.localeCompare(y, undefined, { numeric: true });
};

const compareMarks = (a, b) => Number(a.marks) - Number(b.marks);
const compareName = (a, b) =>
  String(a.name ?? '').localeCompare(String(b.name ?? ''), undefined, { sensitivity: 'base' });

/** Derives the displayed list; never mutates the stored records. */
export function filterAndSortStudents(students, { search = '', className = '', sortBy = '' }) {
  const term = search.trim().toLowerCase();
  let result = students.filter((s) => {
    if (className && s.class !== className) return false;
    if (term && !String(s.name ?? '').toLowerCase().includes(term)) return false;
    return true;
  });

  const comparators = {
    'name-asc': compareName,
    'name-desc': (a, b) => compareName(b, a),
    'roll-asc': compareRoll,
    'roll-desc': (a, b) => compareRoll(b, a),
    'marks-asc': compareMarks,
    'marks-desc': (a, b) => compareMarks(b, a),
  };
  if (comparators[sortBy]) result = [...result].sort(comparators[sortBy]);
  return result;
}
