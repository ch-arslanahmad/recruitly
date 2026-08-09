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

  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    const fetchJobs = mode === "saved" ? api.saved.getAll : api.jobs.getAll;
    fetchJobs()
      .then((data: Job[]) => setJobs(data))
      .catch((err) => setError(err.message));
  }, [mode]);

  const totalPages = Math.ceil(jobs.length / perPage);

  const offset = (page - 1) * perPage; // calculate offset
  const visible = jobs.slice(offset, offset + perPage); // from offset to offset + perPage

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
        {jobs.length === 0 ? (
          <p>
            {mode === "saved"
              ? "You haven't saved any jobs yet."
              : "No jobs found right now. Check back soon."}
          </p>
        ) : (
          visible.map((job) => <JobCard key={job.id} job={job} />)
        )}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setPage(1)} disabled={page === 1}>
            First Page
          </button>
          <button onClick={() => setPage(page - 1)} disabled={page === 1}>
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
          >
            Last Page
          </button>
        </div>
      )}
    </div>
  );
}

export default JobBoard;
