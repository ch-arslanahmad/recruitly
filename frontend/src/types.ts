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
    about_role: string;
    requirements?: string; // act as array on run-time
    responsibilities?: string; // act as string array on run-time
    location: string;
    salary: number;
    type: string;
    created_at?: string;
    applicant_count: number;
    company?: string;
    status: "open" | "closed";
}

export interface Application {
    id: number;
    job_id: number;
    candidate_id: number;
    status: string;
    created_at?: string;
}

export interface JobApplicant {
    application_id: number;
    applicant_id: number;
    candidate_name: string;
    status: string;
    created_at?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}
