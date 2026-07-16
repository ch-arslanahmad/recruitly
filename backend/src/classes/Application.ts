import db from '../db/database.js';

class Application {
  id : number;
  job_id : number;
  candidate_id : number;
  status: string;

    constructor(id : number, job_id : number, candidate_id : number, status : string) {
    this.id = id;
    this.job_id = job_id;
    this.candidate_id = candidate_id;
    this.status = status;
  }

  static create({job_id, candidate_id, status = 'applied'} : {job_id: number, candidate_id: number, status?: string}) {
    return db.prepare("INSERT INTO application (job_id, candidate_id, status) VALUES (?, ?, ?)").run(job_id, candidate_id, status);
  }

  static findById(id : number) {
    return db.prepare("SELECT * FROM application WHERE id = ?").get(id);
  }

  static findByJob(job_id : number) {
    return db.prepare("SELECT * FROM application WHERE job_id = ?").all(job_id);
  }

  static findByCandidate(candidate_id : number) {
    return db.prepare("SELECT * FROM application WHERE candidate_id = ?").all(candidate_id);
  }

   static updateStatus(id : number, status : string) {
       db.prepare("UPDATE application SET status = ? WHERE id = ?").run(status, id);
   }
}

export default Application;
