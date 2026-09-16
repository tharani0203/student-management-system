from django.test import TestCase
from rest_framework.test import APIClient

from .models import Student


class StudentAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.payload = {
            'full_name': 'Alice Johnson',
            'email': 'alice@example.com',
            'phone_number': '9876543210',
            'gender': 'Female',
            'date_of_birth': '2001-05-10',
            'department': 'CSE',
            'year': '2',
            'section': 'A',
            'roll_number': 'CS-201',
            'address': 'Main Street',
            'city': 'Bangalore',
            'admission_date': '2022-08-15',
            'percentage_cgpa': 88.5,
            'status': 'Active',
        }

    def test_create_valid_student(self):
        response = self.client.post('/api/students/', self.payload, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Student.objects.count(), 1)

    def test_create_missing_required_field(self):
        bad_payload = self.payload.copy()
        bad_payload.pop('full_name')
        response = self.client.post('/api/students/', bad_payload, format='json')
        self.assertEqual(response.status_code, 400)

    def test_create_invalid_email(self):
        bad_payload = self.payload.copy()
        bad_payload['email'] = 'invalid-email'
        response = self.client.post('/api/students/', bad_payload, format='json')
        self.assertEqual(response.status_code, 400)

    def test_create_duplicate_email(self):
        self.client.post('/api/students/', self.payload, format='json')
        duplicate = self.payload.copy()
        duplicate['email'] = 'alice@example.com'
        duplicate['roll_number'] = 'CS-202'
        response = self.client.post('/api/students/', duplicate, format='json')
        self.assertEqual(response.status_code, 400)

    def test_create_duplicate_roll_number(self):
        self.client.post('/api/students/', self.payload, format='json')
        duplicate = self.payload.copy()
        duplicate['email'] = 'bob@example.com'
        duplicate['roll_number'] = 'CS-201'
        response = self.client.post('/api/students/', duplicate, format='json')
        self.assertEqual(response.status_code, 400)

    def test_list_empty_database(self):
        response = self.client.get('/api/students/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_list_database_with_students(self):
        self.client.post('/api/students/', self.payload, format='json')
        response = self.client.get('/api/students/')
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 1)

    def test_retrieve_student(self):
        created = self.client.post('/api/students/', self.payload, format='json')
        response = self.client.get(f"/api/students/{created.data['student_id']}/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['full_name'], 'Alice Johnson')

    def test_update_valid_student(self):
        created = self.client.post('/api/students/', self.payload, format='json')
        updated_payload = self.payload.copy()
        updated_payload['full_name'] = 'Alice Updated'
        response = self.client.put(f"/api/students/{created.data['student_id']}/", updated_payload, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['full_name'], 'Alice Updated')

    def test_update_invalid_student_id(self):
        response = self.client.get('/api/students/9999/')
        self.assertEqual(response.status_code, 404)

    def test_delete_valid_student(self):
        created = self.client.post('/api/students/', self.payload, format='json')
        response = self.client.delete(f"/api/students/{created.data['student_id']}/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Student.objects.count(), 0)

    def test_delete_invalid_student_id(self):
        response = self.client.delete('/api/students/99999/')
        self.assertEqual(response.status_code, 404)
