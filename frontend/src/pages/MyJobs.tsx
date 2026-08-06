import { useState, useEffect } from "react";
import { api } from "../api";
import { Job } from "../types";
import JobTable from "../components/JobTable";
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
      .catch((err) =>
        setError((err as Error).message || "Failed to update job"),
      );
  }

  function deleteJob(id: number) {
    if (!confirm("Delete this job? This cannot be undone.")) return;
    api.recruiter.job
      .remove(id)
      .then(() => setJobs((prev) => prev.filter((j) => j.id !== id)))
      .catch((err) =>
        setError((err as Error).message || "Failed to delete job"),
      );
  }

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="home-container">
      <h1>My Jobs</h1>
      <JobTable
        jobs={jobs}
        emptyMessage="You haven't posted any jobs yet."
        onToggleStatus={toggleStatus}
        onDelete={deleteJob}
      />
    </div>
  );
}

export default MyJobs;
