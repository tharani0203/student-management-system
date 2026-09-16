# Student Management System

A full-stack student administration web app built with Django REST Framework and React.

## Features

- Dashboard overview with summary cards
- Student listing with search and filters
- Student details page
- Create, edit, and delete student records
- Validation for email, phone, GPA/CGPA, and duplicate roll numbers
- Responsive admin dashboard UI

## Tech Stack

- Backend: Python, Django, Django REST Framework, SQLite
- Frontend: React, Vite, React Router, Axios

## Project Structure

- backend/ - Django backend project and API
- frontend/ - React frontend app
- .gitignore - project git exclusions

## Local Setup

### 1) Backend

From the project root:

```bash
cd backend
python manage.py migrate
python manage.py runserver
```

The API will be available at http://127.0.0.1:8000/api/students/

### 2) Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173

## API Endpoints

- GET /api/students/
- POST /api/students/
- GET /api/students/<id>/
- PUT /api/students/<id>/
- DELETE /api/students/<id>/

## Default Admin Access

This project uses the default Django admin and no custom login flow.

## Notes

- The backend is configured for local development and CORS is enabled for the Vite frontend.
- Data is stored in SQLite in the backend folder.

## Verification

This project was validated with:

- Django test suite: passed
- Frontend production build: passed
