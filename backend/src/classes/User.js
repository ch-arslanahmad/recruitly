import db from '../db/database.js';

class User {
  constructor(id, name, username, password, role, company = null) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.password = password;
    this.role = role;
    this.company = company;
  }

  save(name, username, password, role, company) {
    db.prepare('INSERT INTO user (name, username, password, role, company) VALUES (?, ?, ?, ?, ?)').run(name, username, password, role, company);
  }

  static create(name, username, password, role, company) {
    db.prepare('INSERT INTO user (name, username, password, role, company) VALUES (?, ?, ?, ?, ?)').run(name, username, password, role, company);
  }

  static findByUsername(username) {
    return db.prepare("SELECT * FROM user WHERE username = ?").get(username);
  }

  static findById(id) {
    return db.prepare("SELECT * FROM user WHERE id = ?").get(id);
  }

  static getSavedJobs(userID) {
    const query = "SELECT job.*, saved_jobs.created_at AS saved_at FROM saved_jobs JOIN job ON job.id = saved_jobs.job_id WHERE saved_jobs.user_id = ?";
    return db.prepare(query).all(userID);
  }
}

export default User;
