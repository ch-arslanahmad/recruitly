// Applicant view: browse all jobs (GET /api/jobs)
// Recruiter view: their posted jobs with applicant count (GET /api/jobs/my)
import JobCard from "./JobCard";
import { useEffect, useState } from "react";
import { Job } from "../types";
import { api } from "../api";

function JobBoard({
  mode,
  page_title,
  page_description,
}: {
  mode: "all" | "saved";
  page_title: string;
  page_description: string;
}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = mode === "saved" ? api.saved.getAll : api.jobs.getAll;
    fetchJobs()
      .then((data: Job[]) => setJobs(data))
      .catch((err) => setError(err.message));
  }, [mode]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="home-container">
      {page_title && page_description && (
        <>
          <h1>{page_title}</h1>
          <p> {page_description}</p>
        </>
      )}
      <div className="card-list">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}

export default JobBoard;
