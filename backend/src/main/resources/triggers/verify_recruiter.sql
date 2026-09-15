CREATE TRIGGER IF NOT EXISTS verify_recruiter_role_in_job_insert
BEFORE INSERT ON job
FOR EACH ROW
BEGIN
    SELECT CASE
        WHEN (SELECT role FROM user WHERE id = NEW.recruiter_id) != 'recruiter' THEN
            RAISE (ABORT, 'Only users with role "recruiter" can create jobs.')
    END;
END;
