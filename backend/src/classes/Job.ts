import db from "../db/database.ts";

class Job {
  id: number;
  recruiter_id: number;
  title: string;
  about_role: string;
  requirements?: string;
  responsibilities?: string;
  location: string;
  salary: number;
  type: string;
  company?: string;
  created_at?: string;

  constructor(
    id: number,
    recruiter_id: number,
    title: string,
    about_role: string,
    location: string,
    salary: number,
    type: string,
    requirements?: string,
    responsibilities?: string,
  ) {
    this.id = id;
    this.recruiter_id = recruiter_id;
    this.title = title;
    this.about_role = about_role;
    this.location = location;
    this.salary = salary;
    this.type = type;
    this.requirements = requirements;
    this.responsibilities = responsibilities;
  }

  static create({
    recruiter_id,
    title,
    about_role,
    location,
    salary,
    type,
    requirements,
    responsibilities,
    status = "open",
  }: {
    recruiter_id: number;
    title: string;
    about_role: string;
    location: string;
    salary: number;
    type: string;
    requirements?: string;
    responsibilities?: string;
    status?: string;
  }) {
    return db
      .prepare(
        "INSERT INTO job (recruiter_id, title, status, about_role, location, salary, type, requirements, responsibilities) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      )
      .run(
        recruiter_id,
        title,
        status,
        about_role,
        location,
        salary,
        type,
        requirements ?? null,
        responsibilities ?? null,
      );
  }

  static findById(id: number): Job | undefined {
    return db
      .prepare(
        "SELECT job.*, user.company FROM job JOIN user ON job.recruiter_id = user.id WHERE job.id = ?",
      )
      .get(id) as Job | undefined;
  }

  static findByRecruiter(recruiter_id: number): Job[] {
    return db
      .prepare(
        "SELECT job.*, user.company, (SELECT COUNT(*) FROM application WHERE job_id = job.id) AS applicant_count FROM job JOIN user ON job.recruiter_id = user.id WHERE recruiter_id = ? ORDER BY job.created_at DESC",
      )
      .all(recruiter_id) as Job[];
  }

  // ALL STATs NEEDED by a recruiter for himself
  static stats(userId: number) {
    const query = `
            SELECT
                (SELECT COUNT(*) FROM job WHERE recruiter_id = @userId) AS total_jobs,
                (SELECT COUNT(*) FROM application WHERE job_id IN (SELECT id FROM job WHERE recruiter_id = @userId)) AS total_applications,
                (SELECT COUNT(*) FROM job WHERE recruiter_id = @userId AND created_at >= DATE('now', '-7 days')) AS jobs_last_7_days,
                (SELECT COUNT(*) FROM application WHERE status = 'interviewing' AND job_id IN (SELECT id FROM job WHERE recruiter_id = @userId)) AS total_interviews
        `;
    return db.prepare(query).get({ userId });
  }

  // example filters

  // { type: 'full-time', location: 'remote', minSalary: 50000 }

  // return all jobs (with filters)
  static findAll(filters?: {
    type?: string;
    location?: string;
    minSalary?: number;
    recruiter_id?: number;
  }): Job[] {
    let query =
      "SELECT job.*, user.company FROM job JOIN user ON job.recruiter_id = user.id WHERE 1=1";
    const params = [];

    if (filters?.type) {
      query += " AND type = ?";
      params.push(filters.type);
    }
    if (filters?.location) {
      query += " AND location = ?";
      params.push(filters.location);
    }
    if (filters?.minSalary) {
      query += " AND salary >= ?";
      params.push(filters.minSalary);
    }
    if (filters?.recruiter_id) {
      query += " AND recruiter_id = ?";
      params.push(filters.recruiter_id);
    }

    query += " ORDER BY created_at DESC";

    return db.prepare(query).all(...params) as Job[];
  }

  static update(
    id: number,
    recruiter_id: number,
    fields: {
      title?: string;
      about_role?: string;
      location?: string;
      salary?: number;
      type?: string;
      requirements?: string;
      responsibilities?: string;
      status?: "open" | "closed";
    },
  ) {
    let query = "UPDATE job SET ";
    let params = [];

    if (fields.title) {
      query += "title = ?, ";
      params.push(fields.title);
    }
    if (fields.about_role) {
      query += "about_role = ?, ";
      params.push(fields.about_role);
    }
    if (fields.location) {
      query += "location = ?, ";
      params.push(fields.location);
    }
    if (fields.salary) {
      query += "salary = ?, ";
      params.push(fields.salary);
    }
    if (fields.type) {
      query += "type = ?, ";
      params.push(fields.type);
    }
    if (fields.requirements) {
      query += "requirements = ?, ";
      params.push(fields.requirements);
    }
    if (fields.responsibilities) {
      query += "responsibilities = ?, ";
      params.push(fields.responsibilities);
    }
    if (fields.status) {
      query += "status = ?, ";
      params.push(fields.status);
    }

    // remove last comma and space
    query = query.slice(0, -2);
    query += " WHERE id = ? AND recruiter_id = ?";
    params.push(id, recruiter_id);

    db.prepare(query).run(...params);
  }

  static delete(id: number, recruiter_id: number) {
    db.prepare("DELETE FROM job WHERE id = ? recruiter_id: number ").run(
      id,
      recruiter_id,
    );
  }
}

export default Job;
