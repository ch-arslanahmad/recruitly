import db from "../db/database.js";

class User {
    id: number | undefined; // can be undefined for new users
    name: string;
    username: string;
    password: string;
    role: string;
    company: string | undefined;

    constructor(
        id: number | undefined,
        name: string,
        username: string,
        password: string,
        role: string,
        company: string | undefined = undefined,
    ) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.password = password;
        this.role = role;
        this.company = company;
    }

    static create({
        name,
        username,
        password,
        role,
        company,
    }: {
        name: string;
        username: string;
        password: string;
        role: string;
        company?: string | undefined;
    }) {
        return db
            .prepare(
                "INSERT INTO user (name, username, password, role, company) VALUES (?, ?, ?, ?, ?)",
            )
            .run(name, username, password, role, company);
    }

    static findByUsername(username: string) {
        return db
            .prepare("SELECT * FROM user WHERE username = ?")
            .get(username) as User | undefined;
    }

    static findById(id: number) {
        return db.prepare("SELECT * FROM user WHERE id = ?").get(id);
    }

    static getSavedJobs(userID: number) {
        const query =
            "SELECT job.*, user.company AS company, saved_jobs.created_at AS saved_at FROM saved_jobs JOIN job ON job.id = saved_jobs.job_id JOIN user ON user.id = job.recruiter_id WHERE saved_jobs.user_id = ?";
        return db.prepare(query).all(userID);
    }

    static isSavedJob(userID: number, jobID: number) {
        const query = "SELECT * FROM saved_jobs WHERE user_id = ? AND job_id = ?";
        return db.prepare(query).get(userID, jobID) !== undefined;
    }

    static saveJob(userId: number, jobId: number) {
        return db
            .prepare("INSERT INTO saved_jobs (user_id, job_id) VALUES (?, ?)")
            .run(userId, jobId);
    }

    static unsaveJob(userId: number, jobId: number) {
        db.prepare(
            "DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?",
        ).run(userId, jobId);
    }
}

export default User;
