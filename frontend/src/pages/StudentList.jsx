import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteStudent, getStudents } from '../services/studentService';

const departments = ['All', 'CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT'];
const years = ['All', '1', '2', '3', '4'];
const statuses = ['All', 'Active', 'Inactive'];
const sections = ['All', 'A', 'B', 'C'];

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [year, setYear] = useState('All');
  const [section, setSection] = useState('All');
  const [status, setStatus] = useState('All');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents({
        search,
        department: department !== 'All' ? department : '',
        year: year !== 'All' ? year : '',
        section: section !== 'All' ? section : '',
        status: status !== 'All' ? status : '',
      });
      setStudents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, department, year, section, status]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await deleteStudent(id);
      setStudents((prev) => prev.filter((student) => student.student_id !== id));
    } catch (error) {
      console.error(error);
      alert('Failed to delete student.');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setDepartment('All');
    setYear('All');
    setSection('All');
    setStatus('All');
  };

  const visibleStudents = useMemo(() => students, [students]);

  return (
    <div className="page-stack">
      <div className="panel">
        <div className="section-head">
          <h3>Student Directory</h3>
          <Link to="/students/new" className="primary-btn">Add Student</Link>
        </div>

        <div className="filters-grid">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student ID, name, email, roll number"
          />
          <select value={department} onChange={(e) => setDepartment(e.target.value)}>
            {departments.map((item) => (
              <option key={item} value={item}>{item === 'All' ? 'Department' : item}</option>
            ))}
          </select>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            {years.map((item) => (
              <option key={item} value={item}>{item === 'All' ? 'Year' : item}</option>
            ))}
          </select>
          <select value={section} onChange={(e) => setSection(e.target.value)}>
            {sections.map((item) => (
              <option key={item} value={item}>{item === 'All' ? 'Section' : item}</option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {statuses.map((item) => (
              <option key={item} value={item}>{item === 'All' ? 'Status' : item}</option>
            ))}
          </select>
          <button className="secondary-btn" onClick={clearFilters}>Clear Filters</button>
        </div>
      </div>

      <div className="table-wrapper panel">
        {loading ? (
          <div className="loading-box">Loading students...</div>
        ) : visibleStudents.length === 0 ? (
          <div className="empty-box">No students found for the current filters.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Year</th>
                <th>Section</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleStudents.map((student) => (
                <tr key={student.student_id}>
                  <td>{student.student_id}</td>
                  <td>{student.full_name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone_number}</td>
                  <td>{student.department}</td>
                  <td>{student.year}</td>
                  <td>{student.section}</td>
                  <td>
                    <span className={`status-badge ${student.status.toLowerCase()}`}>
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-group">
                      <Link to={`/students/${student.student_id}`}>View</Link>
                      <Link to={`/students/${student.student_id}/edit`}>Edit</Link>
                      <button onClick={() => handleDelete(student.student_id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default StudentList;
