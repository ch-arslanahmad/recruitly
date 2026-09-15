--
CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK(role IN ('recruiter', 'applicant')),
    password TEXT NOT NULL, -- hashed (still-text) before storing in the database
    company TEXT, -- only for recruiters
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
);

-- Jobs

CREATE TABLE IF NOT EXISTS job (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recruiter_id INTEGER NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('open', 'closed')),
    about_role TEXT NOT NULL,
    requirements TEXT,
    responsibilities TEXT,
    location TEXT NOT NULL,
    salary INTEGER NOT NULL, -- in USD($).
    type TEXT NOT NULL CHECK(type IN ('full-time', 'part-time', 'contract', 'remote')),
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    UNIQUE(recruiter_id, title) -- prevents duplicate jobs by the same recruiter with the same title.
);

CREATE TABLE IF NOT EXISTS application (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER NOT NULL REFERENCES job(id) ON DELETE CASCADE,
    candidate_id INTEGER NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK(status IN ('applied', 'shortlisted', 'hired', 'rejected')),
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    UNIQUE(job_id, candidate_id) -- so a candidate can't apply for the same job twice.
);


-- Triggers are in separate files under triggers/ because their END; breaks semicolon-based splitters.
-- See triggers/verify_recruiter.sql and triggers/verify_applicant.sql.

-- Saved Jobs

CREATE TABLE IF NOT EXISTS saved_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    job_id INTEGER NOT NULL REFERENCES job(id) ON DELETE CASCADE,
    saved_at TEXT DEFAULT (datetime('now', 'localtime')),
    UNIQUE(user_id, job_id) -- so a user can't save something twice.
);
