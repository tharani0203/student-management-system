import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStudents } from '../services/studentService';

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getStudents();
        setStudents(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const stats = useMemo(() => {
    const total = students.length;
    const active = students.filter((s) => s.status === 'Active').length;
    const inactive = students.filter((s) => s.status === 'Inactive').length;
    const departments = new Set(students.map((s) => s.department)).size;
    return { total, active, inactive, departments };
  }, [students]);

  const recentStudents = useMemo(
    () => [...students].slice(0, 5),
    [students],
  );

  return (
    <div className="page-stack">
      <section className="stats-grid">
        <div className="stat-card">
          <span>Total Students</span>
          <strong>{loading ? '...' : stats.total}</strong>
        </div>
        <div className="stat-card success">
          <span>Active Students</span>
          <strong>{loading ? '...' : stats.active}</strong>
        </div>
        <div className="stat-card warning">
          <span>Inactive Students</span>
          <strong>{loading ? '...' : stats.inactive}</strong>
        </div>
        <div className="stat-card info">
          <span>Departments</span>
          <strong>{loading ? '...' : stats.departments}</strong>
        </div>
      </section>

      <section className="panel split-layout">
        <div>
          <div className="section-head">
            <h3>Recent Students</h3>
            <Link to="/students/new" className="secondary-btn">Quick Add</Link>
          </div>
          {recentStudents.length ? (
            <div className="recent-list">
              {recentStudents.map((student) => (
                <div key={student.student_id} className="recent-item">
                  <div>
                    <strong>{student.full_name}</strong>
                    <small>{student.department} • {student.year}</small>
                  </div>
                  <Link to={`/students/${student.student_id}`}>View</Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-box">No students added yet.</div>
          )}
        </div>

        <div>
          <div className="section-head">
            <h3>Quick Navigation</h3>
          </div>
          <div className="quick-actions">
            <Link to="/students" className="action-btn">View All Students</Link>
            <Link to="/students/new" className="action-btn secondary">Add New Student</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
