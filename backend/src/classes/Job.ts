import db from '../db/database.ts';

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

  constructor(id: number, recruiter_id: number, title: string, about_role: string, location: string, salary: number, type: string, requirements?: string, responsibilities?: string) {
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

  static create({ recruiter_id, title, about_role, location, salary, type, requirements, responsibilities } : { recruiter_id: number, title: string, about_role: string, location: string, salary: number, type: string, requirements?: string, responsibilities?: string }) {
    return db.prepare('INSERT INTO job (recruiter_id, title, about_role, location, salary, type, requirements, responsibilities) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(recruiter_id, title, about_role, location, salary, type, requirements ?? null, responsibilities ?? null);
  }

  static findById(id: number): Job | undefined {
    return db.prepare("SELECT job.*, user.company FROM job JOIN user ON job.recruiter_id = user.id WHERE job.id = ?").get(id) as Job | undefined;
  }

  // example filters

  // { type: 'full-time', location: 'remote', minSalary: 50000 }

  // return all jobs (with filters)
  static findAll(filters?: { type?: string; location?: string; minSalary?: number; recruiter_id?: number }): Job[] {
    let query = "SELECT job.*, user.company FROM job JOIN user ON job.recruiter_id = user.id WHERE 1=1";


    // if no filters, return all jobs
    if (!filters) {
      return db.prepare(query).all() as Job[];
    }

    const params = [];

    if (filters.type) {
      query += " AND type = ?";
      params.push(filters.type);
    }
    if (filters.location) {
      query += " AND location = ?";
      params.push(filters.location);
    }
    if (filters.minSalary) {
      query += " AND salary >= ?";
      params.push(filters.minSalary);
    }
    if (filters.recruiter_id) {
      query += " AND recruiter_id = ?";
      params.push(filters.recruiter_id);
    }

    query += " ORDER BY created_at DESC"; // order by most recent first

    return db.prepare(query).all(...params) as Job[];
  }

  static findByRecruiter(recruiter_id: number): Job[] {
    return db.prepare("SELECT job.*, user.company FROM job JOIN user ON job.recruiter_id = user.id WHERE recruiter_id = ?").all(recruiter_id) as Job[];
  }

  static update(id: number, fields: { title?: string; about_role?: string; location?: string; salary?: number; type?: string; requirements?: string; responsibilities?: string }) {

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

    // remove last comma and space
    query = query.slice(0, -2);
    query += " WHERE id = ?";
    params.push(id);

    db.prepare(query).run(...params);
  }

  static delete(id: number) {
    db.prepare("DELETE FROM job WHERE id = ?").run(id);
  }
}

export default Job;
