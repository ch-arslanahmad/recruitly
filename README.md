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

## API Documentation

Base URL: `http://localhost:8080/api`

Authenticated routes require this header:

```http
Authorization: Bearer <jwt-token>
```

Most frontend calls are already wrapped in `frontend/src/api.ts`, so this section is mainly a reference for testing with Postman, curl, or browser dev tools.

### Response and Error Notes

- Success responses usually return JSON.
- Validation and business-rule failures return HTTP status codes such as `400`, `401`, `403`, `404`, or `409`.
- Error bodies are usually one of these shapes:

```json
{ "message": "Something went wrong" }
```

```text
A plain text error message
```

### Auth Routes

#### Register

| Item          | Value                      |
| ------------- | -------------------------- |
| Method        | `POST`                     |
| Path          | `/api/auth/register`       |
| Auth required | No                         |
| Roles         | `applicant` or `recruiter` |

Applicant request:

```json
{
  "name": "Muhammad Arslan",
  "username": "ayesha",
  "password": "password123",
  "role": "applicant"
}
```

Recruiter request:

```json
{
  "name": "Omar",
  "username": "omar",
  "password": "password123",
  "role": "recruiter",
  "company": "Recruitly Labs"
}
```

Success response: `201 Created`

```json
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "name": "Omar",
    "username": "omar",
    "role": "recruiter",
    "company": "Recruitly Labs"
  }
}
```

Common errors:

| Status | Meaning                                 |
| ------ | --------------------------------------- |
| `400`  | Missing required fields or invalid role |
| `409`  | Username already exists                 |
| `500`  | Registration failed                     |

#### Login

| Item          | Value             |
| ------------- | ----------------- |
| Method        | `POST`            |
| Path          | `/api/auth/login` |
| Auth required | No                |

Request:

```json
{
  "username": "omar",
  "password": "password123"
}
```

Success response: `200 OK`

```json
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "name": "Omar Recruiter",
    "username": "omar",
    "role": "recruiter",
    "company": "Recruitly Labs"
  }
}
```

Common errors:

| Status | Meaning                      |
| ------ | ---------------------------- |
| `401`  | Invalid username or password |
| `500`  | Login failed                 |

### Job Routes

#### List all jobs

| Item          | Value              |
| ------------- | ------------------ |
| Method        | `GET`              |
| Path          | `/api/jobs`        |
| Auth required | No                 |
| Response      | Bare `Job[]` array |

Success response: `200 OK`

```json
[
  {
    "id": 10,
    "recruiter_id": 1,
    "title": "Frontend Developer",
    "about_role": "Build React screens for Recruitly.",
    "requirements": "React, TypeScript, CSS",
    "responsibilities": "Build UI, fix bugs, work with APIs",
    "location": "Remote",
    "salary": 75000,
    "type": "full-time",
    "status": "open",
    "company": "Recruitly Labs",
    "applicant_count": 3,
    "created_at": "2026-09-19T08:00:00"
  }
]
```

#### Get one job

| Item          | Value            |
| ------------- | ---------------- |
| Method        | `GET`            |
| Path          | `/api/jobs/{id}` |
| Auth required | Yes              |
| Response      | `{ "job": Job }` |

Success response: `200 OK`

```json
{
  "job": {
    "id": 10,
    "title": "Frontend Developer",
    "location": "Remote",
    "salary": 75000,
    "type": "full-time",
    "status": "open",
    "company": "Recruitly Labs",
    "applicant_count": 3
  }
}
```

Common errors:

| Status | Meaning                |
| ------ | ---------------------- |
| `401`  | Missing or invalid JWT |
| `404`  | Job not found          |

#### List recruiter's jobs

| Item          | Value               |
| ------------- | ------------------- |
| Method        | `GET`               |
| Path          | `/api/jobs/my`      |
| Auth required | Yes                 |
| Role          | Recruiter           |
| Response      | `{ "jobs": Job[] }` |

Success response: `200 OK`

```json
{
  "jobs": [
    {
      "id": 10,
      "title": "Frontend Developer",
      "status": "open",
      "applicant_count": 3
    }
  ]
}
```

#### Get recruiter dashboard stats

| Item          | Value             |
| ------------- | ----------------- |
| Method        | `GET`             |
| Path          | `/api/jobs/stats` |
| Auth required | Yes               |
| Role          | Recruiter         |

Success response: `200 OK`

```json
{
  "totalJobs": 4,
  "totalApplications": 12,
  "newThisWeek": 2,
  "interviews": 3
}
```

#### Create a job

| Item          | Value       |
| ------------- | ----------- |
| Method        | `POST`      |
| Path          | `/api/jobs` |
| Auth required | Yes         |
| Role          | Recruiter   |

Request:

```json
{
  "title": "Frontend Developer",
  "about_role": "Build React screens for Recruitly.",
  "requirements": "React, TypeScript, CSS",
  "responsibilities": "Build UI, fix bugs, work with APIs",
  "location": "Remote",
  "salary": 75000,
  "type": "full-time",
  "company": "Recruitly Labs",
  "status": "open",
  "expires_at": "2025-01-01 15:30:00"
}
```

> [!note]
> `expires_at` is an optional parameter with format YYYY-MM-DD HH:MM:SS. If omitted, defaults to 7 days from creation.

Success response: `201 Created`

```json
{
  "message": "Job created successfully",
  "id": 10
}
```

Note: the company is normally derived from the recruiter user record, but the current Java model still validates `company` on create. Until that validation is removed, include `company` in manual API requests.

#### Update a job

| Item          | Value                      |
| ------------- | -------------------------- |
| Method        | `PUT`                      |
| Path          | `/api/jobs/{id}`           |
| Auth required | Yes                        |
| Role          | Recruiter who owns the job |

Request can include any editable job fields. Example status toggle:

```json
{
  "status": "closed"
}
```

Success response: `200 OK`

```json
{
  "message": "Job updated successfully"
}
```

Common errors:

| Status | Meaning                         |
| ------ | ------------------------------- |
| `403`  | Recruiter does not own this job |
| `404`  | Job does not exist              |

#### Delete a job

| Item          | Value                      |
| ------------- | -------------------------- |
| Method        | `DELETE`                   |
| Path          | `/api/jobs/{id}`           |
| Auth required | Yes                        |
| Role          | Recruiter who owns the job |

Success response: `200 OK`

```json
{
  "message": "Job deleted successfully"
}
```

### Application Routes

Application status values are lowercase in JSON:

- `applied`
- `shortlisted`
- `rejected`
- `hired`

Valid transitions:

- `applied` → `shortlisted` or `rejected`
- `shortlisted` → `hired` or `rejected`
- `rejected` and `hired` are final states

#### Apply to a job

| Item          | Value               |
| ------------- | ------------------- |
| Method        | `POST`              |
| Path          | `/api/applications` |
| Auth required | Yes                 |
| Role          | Applicant           |

Request:

```json
{
  "job_id": 10,
  "status": "applied"
}
```

> [!note]
> `status` is required by the request model (`@NotNull`), but the server always stores `applied` regardless of what you send, you can't apply as
> anything else.

Success response: `201 Created`

```json
{
  "message": "Applied successfully",
  "id": 25
}
```

Common errors:

| Status | Meaning                                      |
| ------ | -------------------------------------------- |
| `400`  | Invalid job, closed job, or validation error |
| `409`  | Candidate already applied to this job        |

#### List my applications

| Item          | Value                             |
| ------------- | --------------------------------- |
| Method        | `GET`                             |
| Path          | `/api/applications/my`            |
| Auth required | Yes                               |
| Role          | Applicant                         |
| Response      | Bare `ApplicationWithJob[]` array |

Success response: `200 OK`

```json
[
  {
    "id": 25,
    "job_id": 10,
    "candidate_id": 5,
    "status": "applied",
    "created_at": "2026-09-19T08:00:00",
    "job_title": "Frontend Developer",
    "location": "Remote",
    "salary": 75000,
    "job_type": "full-time",
    "job_status": "open",
    "company": "Recruitly Labs"
  }
]
```

#### List all applicants for recruiter's jobs

| Item          | Value                                   |
| ------------- | --------------------------------------- |
| Method        | `GET`                                   |
| Path          | `/api/applications/applicants`          |
| Auth required | Yes                                     |
| Role          | Recruiter                               |
| Response      | Bare `ApplicationWithCandidate[]` array |

Success response: `200 OK`

```json
[
  {
    "id": 25,
    "job_id": 10,
    "candidate_id": 5,
    "candidate_name": "Ayesha Khan",
    "status": "applied",
    "job_title": "Frontend Developer",
    "location": "Remote",
    "salary": 75000,
    "job_type": "full-time",
    "job_status": "open"
  }
]
```

#### List applicants for one job

| Item          | Value                        |
| ------------- | ---------------------------- |
| Method        | `GET`                        |
| Path          | `/api/applications/job/{id}` |
| Auth required | Yes                          |
| Role          | Recruiter who owns the job   |
| Response      | Bare `JobApplicant[]` array  |

Success response: `200 OK`

```json
[
  {
    "application_id": 25,
    "applicant_id": 5,
    "candidate_name": "Ayesha Khan",
    "status": "applied",
    "created_at": "2026-09-19T08:00:00"
  }
]
```

#### Update application status

| Item          | Value                                                   |
| ------------- | ------------------------------------------------------- |
| Method        | `PUT`                                                   |
| Path          | `/api/applications/{id}`                                |
| Auth required | Yes                                                     |
| Role          | Recruiter who owns the job connected to the application |

Request:

```json
{
  "status": "shortlisted"
}
```

Success response: `200 OK`

```json
{
  "message": "Successfully updated status"
}
```

Common errors:

| Status | Meaning                                       |
| ------ | --------------------------------------------- |
| `400`  | Invalid status transition                     |
| `403`  | Recruiter does not own this application's job |
| `404`  | Application not found                         |

### Saved Job Routes

Saved jobs are applicant-only actions in the UI.

#### List saved jobs

| Item          | Value              |
| ------------- | ------------------ |
| Method        | `GET`              |
| Path          | `/api/saved-jobs`  |
| Auth required | Yes                |
| Role          | Applicant          |
| Response      | Bare `Job[]` array |

Success response: `200 OK`

```json
[
  {
    "id": 10,
    "title": "Frontend Developer",
    "location": "Remote",
    "salary": 75000,
    "type": "full-time",
    "status": "open",
    "company": "Recruitly Labs"
  }
]
```

#### Save a job

| Item          | Value                     |
| ------------- | ------------------------- |
| Method        | `POST`                    |
| Path          | `/api/saved-jobs/{jobId}` |
| Auth required | Yes                       |
| Role          | Applicant                 |

Success response: `200 OK`

```text
Successfully saved job
```

Common errors:

| Status | Meaning           |
| ------ | ----------------- |
| `404`  | Job not found     |
| `409`  | Job already saved |

#### Unsave a job

| Item          | Value                     |
| ------------- | ------------------------- |
| Method        | `DELETE`                  |
| Path          | `/api/saved-jobs/{jobId}` |
| Auth required | Yes                       |
| Role          | Applicant                 |

Success response: `200 OK`

```text
Successfully unsaved job
```

#### Check whether a job is saved

| Item          | Value                           |
| ------------- | ------------------------------- |
| Method        | `GET`                           |
| Path          | `/api/saved-jobs/check/{jobId}` |
| Auth required | Yes                             |
| Role          | Applicant                       |

Success response: `200 OK`

```json
{
  "isSaved": true
}
```

### Quick curl Examples

Register a recruiter:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Omar Recruiter","username":"omar","password":"password123","role":"recruiter","company":"Recruitly Labs"}'
```

Login:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"omar","password":"password123"}'
```

Create a job with a JWT:

```bash
curl -X POST http://localhost:8080/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"Frontend Developer","about_role":"Build React screens","requirements":"React, TypeScript","responsibilities":"Build UI","location":"Remote","salary":75000,"type":"full-time","company":"Recruitly Labs","status":"open"}'
```
