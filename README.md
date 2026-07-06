# Recruitly

A full-stack job board where employers post jobs and applicants search, filter, and apply. Built with React and Express.

**Stack:** React, Express.js, SQLite, JWT

## Features

### Authentication
- Register as Employer or Applicant
- Login / Logout
- Role-based access control

### Job Listings
- Browse all jobs
- Search by keyword
- Filter by location, job type, salary range
- Sort by date or salary
- Pagination

### Employer Dashboard
- Create, edit, delete job listings
- View applicant count per job
- See list of applicants

### Applicant Dashboard
- Search and apply to jobs
- Track application status
- Save jobs for later


## Project Structure

```
recruitly/
├── frontend/          # React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.jsx
│   └── package.json
├── backend/           # Express API
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── db/
│   └── package.json
└── README.md
```

