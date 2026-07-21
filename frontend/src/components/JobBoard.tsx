// Applicant view: browse all jobs (GET /api/jobs)
// Recruiter view: their posted jobs with applicant count (GET /api/jobs/my)
import JobCard from "./JobCard";
import { Job } from "../types";
import { useEffect, useState } from "react";

function JobBoard({ jobs }: { jobs: Job[] }) {
    return (
        <div className="home-container">
            <h1>Find your next job</h1>
            <p>Search from thousands of job listings.</p>

            <div className="card-list">
                {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>
        </div>
    );
}

export default JobBoard;
