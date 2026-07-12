const db = require('../db/database');

class Application {
  constructor(id, job_id, candidate_id, status) {
    this.id = id;
    this.job_id = job_id;
    this.candidate_id = candidate_id;
    this.status = status;
  }

}

module.exports = Application;
