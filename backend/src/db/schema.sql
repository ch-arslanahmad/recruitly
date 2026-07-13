-- 
CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK(role IN ('recruiter', 'applicant')),
    password TEXT NOT NULL, -- hashed (still-text) before storing in the database
    company UNIQUE TEXT, -- only for recruiters
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
);

-- Jobs

CREATE TABLE IF NOT EXISTS job (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recruiter_id INTEGER NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    salary INTEGER NOT NULL, -- in USD($).
    type TEXT NOT NULL CHECK(type IN ('full-time', 'part-time', 'contract', 'remote')),
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS application (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER NOT NULL REFERENCES job(id) ON DELETE CASCADE,
    candidate_id INTEGER NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK(status IN ('applied', 'interviewing', 'offered', 'rejected')),
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
);


CREATE TRIGGER IF NOT EXISTS verify_recruiter_role_in_job_insert
BEFORE INSERT ON job
FOR EACH ROW
BEGIN
    SELECT CASE
        WHEN (SELECT role FROM user WHERE id = NEW.recruiter_id) != 'recruiter' THEN
            RAISE (ABORT, 'Only users with role "recruiter" can create jobs.')
            -- only recruiters can create jobs
    END;
END;

CREATE TRIGGER IF NOT EXISTS verify_applicant_role_in_application_insert
BEFORE INSERT ON application
FOR EACH ROW
BEGIN
    SELECT CASE
        WHEN (SELECT role FROM user WHERE id = NEW.candidate_id) != 'applicant' THEN
            RAISE (ABORT, 'Only users with role "applicant" can apply for jobs.')
            -- only applicants can apply for jobs
    END;
END;

-- Saved Jobs

CREATE TABLE IF NOT EXISTS saved_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    job_id INTEGER NOT NULL REFERENCES job(id) ON DELETE CASCADE,
    saved_at TEXT DEFAULT (datetime('now', 'localtime')),
    UNIQUE(user_id, job_id) -- so a user can't save something twice.
);