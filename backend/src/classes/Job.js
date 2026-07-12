const db = require('../db/database');

class Job {
  constructor(id, recruiter_id, title, description, location, company, salary, type) {
    this.id = id;
    this.recruiter_id = recruiter_id;
    this.title = title;
    this.description = description;
    this.location = location;
    this.company = company;
    this.salary = salary;
    this.type = type;
  }
}

module.exports = Job;
