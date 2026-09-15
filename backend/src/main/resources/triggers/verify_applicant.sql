CREATE TRIGGER IF NOT EXISTS verify_applicant_role_in_application_insert
BEFORE INSERT ON application
FOR EACH ROW
BEGIN
    SELECT CASE
        WHEN (SELECT role FROM user WHERE id = NEW.candidate_id) != 'applicant' THEN
            RAISE (ABORT, 'Only users with role "applicant" can apply for jobs.')
    END;
END;
