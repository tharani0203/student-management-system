import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createStudent, getStudentById, updateStudent } from '../services/studentService';

const initialForm = {
  full_name: '',
  email: '',
  phone_number: '',
  gender: 'Male',
  date_of_birth: '',
  department: 'CSE',
  year: '1',
  section: 'A',
  roll_number: '',
  address: '',
  city: '',
  admission_date: '',
  percentage_cgpa: '',
  status: 'Active',
};

const emptyErrors = {};

function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState(emptyErrors);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStudent = async () => {
      if (!isEditing) return;
      try {
        setLoading(true);
        const student = await getStudentById(id);
        setFormData({
          ...student,
          date_of_birth: student.date_of_birth || '',
          admission_date: student.admission_date || '',
          percentage_cgpa: student.percentage_cgpa ?? '',
        });
      } catch (error) {
        console.error(error);
        alert('Unable to load student data.');
      } finally {
        setLoading(false);
      }
    };
    loadStudent();
  }, [id, isEditing]);

  const validate = () => {
    const nextErrors = {};
    if (!formData.full_name.trim()) nextErrors.full_name = 'Full name is required.';
    if (!formData.email.trim()) nextErrors.email = 'Email is required.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) nextErrors.email = 'Enter a valid email address.';
    if (!formData.phone_number.trim()) nextErrors.phone_number = 'Phone number is required.';
    if (formData.phone_number.replace(/\D/g, '').length < 10) nextErrors.phone_number = 'Phone number must contain at least 10 digits.';
    if (!formData.roll_number.trim()) nextErrors.roll_number = 'Roll number is required.';
    if (!['1', '2', '3', '4'].includes(String(formData.year))) nextErrors.year = 'Year must be between 1 and 4.';
    if (formData.percentage_cgpa === '' || Number(formData.percentage_cgpa) < 0 || Number(formData.percentage_cgpa) > 100) {
      nextErrors.percentage_cgpa = 'Percentage/CGPA must be between 0 and 100.';
    }
    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        await updateStudent(id, formData);
        alert('Student updated successfully.');
      } else {
        await createStudent(formData);
        alert('Student created successfully.');
      }
      navigate('/students');
    } catch (error) {
      const serverErrors = error.response?.data?.error || error.response?.data;
      if (serverErrors && typeof serverErrors === 'object') {
        setErrors(serverErrors);
      } else {
        alert(serverErrors || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialForm);
    setErrors(emptyErrors);
  };

  return (
    <div className="page-stack">
      <div className="panel form-panel">
        <div className="section-head">
          <h3>{isEditing ? 'Edit Student' : 'Add New Student'}</h3>
          <button type="button" className="secondary-btn" onClick={() => navigate('/students')}>Cancel</button>
        </div>

        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-grid">
            <label>
              <span>Full Name</span>
              <input name="full_name" value={formData.full_name} onChange={handleChange} />
              {errors.full_name && <small>{errors.full_name}</small>}
            </label>
            <label>
              <span>Email</span>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
              {errors.email && <small>{errors.email}</small>}
            </label>
            <label>
              <span>Phone Number</span>
              <input name="phone_number" value={formData.phone_number} onChange={handleChange} />
              {errors.phone_number && <small>{errors.phone_number}</small>}
            </label>
            <label>
              <span>Gender</span>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label>
              <span>Date of Birth</span>
              <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} />
            </label>
            <label>
              <span>Department</span>
              <select name="department" value={formData.department} onChange={handleChange}>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
                <option value="IT">IT</option>
              </select>
            </label>
            <label>
              <span>Year</span>
              <select name="year" value={formData.year} onChange={handleChange}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
              {errors.year && <small>{errors.year}</small>}
            </label>
            <label>
              <span>Section</span>
              <select name="section" value={formData.section} onChange={handleChange}>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </label>
            <label>
              <span>Roll Number</span>
              <input name="roll_number" value={formData.roll_number} onChange={handleChange} />
              {errors.roll_number && <small>{errors.roll_number}</small>}
            </label>
            <label className="full-width">
              <span>Address</span>
              <textarea name="address" value={formData.address} onChange={handleChange} rows="3" />
            </label>
            <label>
              <span>City</span>
              <input name="city" value={formData.city} onChange={handleChange} />
            </label>
            <label>
              <span>Admission Date</span>
              <input type="date" name="admission_date" value={formData.admission_date} onChange={handleChange} />
            </label>
            <label>
              <span>Percentage / CGPA</span>
              <input type="number" step="0.01" min="0" max="100" name="percentage_cgpa" value={formData.percentage_cgpa} onChange={handleChange} />
              {errors.percentage_cgpa && <small>{errors.percentage_cgpa}</small>}
            </label>
            <label>
              <span>Status</span>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="secondary-btn" onClick={handleReset}>Reset</button>
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Update Student' : 'Save Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;
