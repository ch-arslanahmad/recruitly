import { useState, useEffect } from "react";
import { api } from "../api";
import { Job } from "../types";
import "./Dashboard.css";

function MyJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  function loadJobs() {
    api.recruiter.job
      .getMy()
      .then((res) => setJobs(res.jobs))
      .catch((err) =>
        setError((err as Error).message || "Failed to load data"),
      );
  }

  function toggleStatus(job: Job) {
    const newStatus = job.status === "closed" ? "open" : "closed";
    api.recruiter.job
      .update(job.id, { ...job, status: newStatus })
      .then(() => {
        setJobs((prev) =>
          prev.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j)),
        );
      })
      .catch((err) => setError((err as Error).message || "Failed to update job"));
  }

  function deleteJob(id: number) {
    if (!confirm("Delete this job? This cannot be undone.")) return;
    api.recruiter.job
      .remove(id)
      .then(() => setJobs((prev) => prev.filter((j) => j.id !== id)))
      .catch((err) => setError((err as Error).message || "Failed to delete job"));
  }

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="home-container">
      <h1>My Jobs</h1>
      {jobs.length === 0 ? (
        <p>You haven't posted any jobs yet.</p>
      ) : (
        <div className="job-table">
          <div className="table-header">
            <div className="col-title">Job Title</div>
            <div className="col-status">Status</div>
            <div className="col-apps">Applicants</div>
            <div className="col-actions">Actions</div>
          </div>
          {jobs.map((job) => (
            <div key={job.id} className="table-row">
              <div className="col-title">
                {job.title}
                <span>
                  {job.location} &middot; {job.type} &middot; $
                  {job.salary.toLocaleString()}
                </span>
              </div>
              <div className="col-status">
                <button
                  onClick={() => toggleStatus(job)}
                  className={`badge ${
                    job.status === "closed" ? "closed" : "active"
                  }`}
                >
                  {job.status === "closed" ? "Closed" : "Active"}
                </button>
              </div>
              <div className="col-apps">{job.applicant_count}</div>
              <div className="col-actions">
                <button className="icon-btn edit-btn" title="Edit">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  </svg>
                </button>
                <button
                  className="icon-btn delete-btn"
                  title="Delete"
                  onClick={() => deleteJob(job.id)}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyJobs;
