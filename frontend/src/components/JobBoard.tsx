// Applicant view: browse all jobs (GET /api/jobs)
// Recruiter view: their posted jobs with applicant count (GET /api/jobs/my)
import JobCard from "./JobCard";
import { Job } from "../types";

function JobBoard({ jobs, title, description }: { jobs: Job[]; title: string; description: string }) {
  return (
    <div className="home-container">
      {(title && description) && <><h1>{title}</h1><p> {description}</p></>}
      <div className="card-list">
        {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

export default JobBoard;
