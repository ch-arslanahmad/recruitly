import JobCard from './JobCard'
import { useState } from "react";


function JobBoard({ jobs }) {
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