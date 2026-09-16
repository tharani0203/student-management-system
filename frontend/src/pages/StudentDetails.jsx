import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteStudent, getStudentById } from '../services/studentService';

function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const data = await getStudentById(id);
        setStudent(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await deleteStudent(id);
      navigate('/students');
    } catch (error) {
      console.error(error);
      alert('Failed to delete student.');
    }
  };

  if (loading) return <div className="loading-box">Loading student profile...</div>;
  if (!student) return <div className="empty-box">Student not found.</div>;

  return (
    <div className="page-stack">
      <div className="panel details-panel">
        <div className="section-head">
          <h3>Student Profile</h3>
          <div className="action-group">
            <button className="secondary-btn" onClick={() => navigate('/students')}>Back</button>
            <Link to={`/students/${id}/edit`} className="primary-btn">Edit</Link>
            <button className="danger-btn" onClick={handleDelete}>Delete</button>
          </div>
        </div>

        <div className="details-grid">
          <div className="info-card">
            <h4>Student Information</h4>
            <p><strong>Student ID:</strong> {student.student_id}</p>
            <p><strong>Name:</strong> {student.full_name}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Phone:</strong> {student.phone_number}</p>
            <p><strong>Gender:</strong> {student.gender}</p>
            <p><strong>Status:</strong> {student.status}</p>
          </div>

          <div className="info-card">
            <h4>Academic Information</h4>
            <p><strong>Department:</strong> {student.department}</p>
            <p><strong>Year:</strong> {student.year}</p>
            <p><strong>Section:</strong> {student.section}</p>
            <p><strong>Roll Number:</strong> {student.roll_number}</p>
            <p><strong>Percentage / CGPA:</strong> {student.percentage_cgpa}</p>
            <p><strong>Admission Date:</strong> {student.admission_date}</p>
          </div>

          <div className="info-card">
            <h4>Contact Information</h4>
            <p><strong>Address:</strong> {student.address || 'N/A'}</p>
            <p><strong>City:</strong> {student.city || 'N/A'}</p>
            <p><strong>Date of Birth:</strong> {student.date_of_birth || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDetails;
