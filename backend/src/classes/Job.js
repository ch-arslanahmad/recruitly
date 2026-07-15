import db from '../db/database.js';

class Job {
  constructor(id, recruiter_id, title, description, location, salary, type) {
    this.id = id;
    this.recruiter_id = recruiter_id;
    this.title = title;
    this.description = description;
    this.location = location;
    this.salary = salary;
    this.type = type;
  }

  static create({ recruiter_id, title, description, location, salary, type }) {
    return db.prepare('INSERT INTO job (recruiter_id, title, description, location, salary, type) VALUES (?, ?, ?, ?, ?, ?)').run(recruiter_id, title, description, location, salary, type);
  }

  static findById(id) {
    return db.prepare("SELECT job.*, user.company FROM job JOIN user ON job.recruiter_id = user.id WHERE job.id = ?").get(id);
  }

  // example filters

  // { type: 'full-time', location: 'remote', minSalary: 50000 }

  // return all jobs (with filters)
  static findAll(filters = undefined) {
    let query = "SELECT job.*, user.company FROM job JOIN user ON job.recruiter_id = user.id WHERE 1=1";


    // if no filters, return all jobs
    if (!filters) {
      return db.prepare(query).all();
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

    return db.prepare(query).all(...params);
  }

  static findByRecruiter(recruiter_id) {
    return db.prepare("SELECT job.*, user.company FROM job JOIN user ON job.recruiter_id = user.id WHERE recruiter_id = ?").all(recruiter_id);
  }

  static update(id, fields) {

    let query = "UPDATE job SET ";
    let params = [];

    if (fields.title) {
      query += "title = ?, ";
      params.push(fields.title);
    }
    if (fields.description) {
      query += "description = ?, ";
      params.push(fields.description);
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

    // remove last comma and space
    query = query.slice(0, -2);
    query += " WHERE id = ?";
    params.push(id);

    db.prepare(query).run(...params);
  }

  static delete(id) {
    db.prepare("DELETE FROM job WHERE id = ?").run(id);
  }
}

export default Job;
