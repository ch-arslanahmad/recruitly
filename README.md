# Recruitly

A full-stack job board where employers post jobs and applicants search, filter, and apply. Built with React (TypeScript) on the frontend and **Spring Boot (Java)** on the backend.

**Stack:** React (Vite + TS), Spring Boot (Java), SQLite, JWT

## Features

### Authentication
- Register as Employer or Applicant
- Login / Logout
- Role-based access control (JWT)

### Job Listings
- Browse all jobs
- Search by keyword
- Filter by job type
- Sort by date or title
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
├── frontend/           # React app (Vite + TypeScript)
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.tsx
├── backend/            # Spring Boot API (Java 21)
│   └── src/main/java/com/recruitly/backend/
│       ├── controllers/
│       ├── repository/
│       ├── model/
│       └── config/
└── README.md
```

> Branch `migrate/spring-boot` holds the current Spring Boot backend (code-complete,
> compiles) — see `todo.md` for the one remaining smoke test.