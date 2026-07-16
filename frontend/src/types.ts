export interface User {
    id: number;
    name: string;
    username: string;
    password?: string;
    role: "applicant" | "recruiter";
    company?: string | null;
}

export interface Job {
    id: number;
    recruiter_id: number;
    title: string;
    description: string;
    location: string;
    salary: number;
    type: string;
    created_at?: string;
    company?: string; // joined from user table
}

export interface Application {
    id: number;
    job_id: number;
    candidate_id: number;
    status: string;
    created_at?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}
