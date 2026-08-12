import db from "../db/database.js";

class Application {
  id: number;
  job_id: number;
  candidate_id: number;
  status: string;

  constructor(
    id: number,
    job_id: number,
    candidate_id: number,
    status: string,
  ) {
    this.id = id;
    this.job_id = job_id;
    this.candidate_id = candidate_id;
    this.status = status;
  }

  static create({
    job_id,
    candidate_id,
    status = "applied",
  }: {
    job_id: number;
    candidate_id: number;
    status?: string;
  }) {
    return db
      .prepare(
        "INSERT INTO application (job_id, candidate_id, status) VALUES (?, ?, ?)",
      )
      .run(job_id, candidate_id, status);
  }

  static find(filters: {
    id?: number;
    job_id?: number;
    candidate_id?: number;
    recruiter_id?: number;
  }) {
    let query = "SELECT * FROM application WHERE 1=1";
    const params: any[] = [];

    if (filters.id !== undefined) {
      query += " AND id = ?";
      params.push(filters.id);
    }
    if (filters.job_id !== undefined) {
      query += " AND job_id = ?";
      params.push(filters.job_id);
    }
    if (filters.candidate_id !== undefined) {
      query += " AND candidate_id = ?";
      params.push(filters.candidate_id);
    }
    if (filters.recruiter_id !== undefined) {
      query += " AND job_id IN (SELECT id FROM job WHERE recruiter_id = ?)";
      params.push(filters.recruiter_id);
    }

    return db.prepare(query).get(...params);
  }

  static findByRecruiter(recruiter_id: number) {
    const query: string = `
      SELECT application.id, application.job_id, application.candidate_id, application.status, application.created_at,
             job.title AS job_title, job.location, job.salary, job.type AS job_type, job.status AS job_status,
             user.name AS candidate_name
      FROM application
      JOIN job ON application.job_id = job.id
      JOIN user ON application.candidate_id = user.id
      WHERE job.recruiter_id = ?
      ORDER BY application.created_at DESC
    `;

    return db.prepare(query).all(recruiter_id);
  }

  static findJobApplicants(job_id: number) {
    const query: string = `SELECT app.id AS application_id, applicant.id AS applicant_id,
      applicant.name AS candidate_name, app.status, app.created_at
      FROM application AS app
      JOIN user AS applicant ON app.candidate_id = applicant.id
      WHERE app.job_id = ?
      ORDER BY app.created_at DESC`;

    return db.prepare(query).all(job_id);
  }

  static findByCandidateWithJobs(candidate_id: number) {
    const query: string = `
        SELECT
            application.id,
            application.job_id,
            application.candidate_id,
            application.status,
            application.created_at,
            job.title AS job_title,
            job.location,
            job.salary,
            job.type AS job_type,
            job.status AS job_status,
            user.company AS company
        FROM application
        JOIN job ON application.job_id = job.id
        JOIN user ON job.recruiter_id = user.id
        WHERE application.candidate_id = ?
        ORDER BY application.created_at DESC
`;

    return db.prepare(query).all(candidate_id);
  }

  static updateStatus(id: number, status: string) {
    db.prepare("UPDATE application SET status = ? WHERE id = ?").run(
      status,
      id,
    );
  }
}

export default Application;
