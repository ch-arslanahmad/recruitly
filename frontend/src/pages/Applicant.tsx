import { useState, useEffect } from "react";
import { Job, JobApplicant } from "../types";
import { api } from "../api";

function ApplicantCard({
  applicant,
  job,
}: {
  applicant: JobApplicant;
  job: Job;
}) {
  return (
    <div className="job-card application-card">
      <h3>{job.title}</h3>
      <p className="meta">
        {job.location} &middot; {job.type}
      </p>
      <p>
        <i className="fa-solid fa-user card-icon"></i>
        {applicant.candidate_name}
      </p>
      <p>
        <i className="fa-solid fa-clipboard-check card-icon"></i>
        <span className={`status-badge ${applicant.status}`}>
          {applicant.status}
        </span>
      </p>
      {applicant.created_at && (
        <p>
          <i className="fa-solid fa-calendar card-icon"></i>
          {new Date(applicant.created_at).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

function Applicant() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicantsByJob, setApplicantsByJob] = useState<
    Record<number, JobApplicant[]>
  >({});
  const [error, setError] = useState("");
  const [view, setView] = useState<"cards" | "table">("cards");

  useEffect(() => {
    api.recruiter.job
      .getMy()
      .then((res) => {
        setJobs(res.jobs);

        return Promise.all(
          res.jobs.map((job: Job) =>
            api.applications
              .getByJob(job.id)
              .then((apps: JobApplicant[]) => ({ jobId: job.id, apps }))
              .catch(() => ({ jobId: job.id, apps: [] })),
          ),
        );
      })
      .then((results) => {
        setApplicantsByJob(
          Object.fromEntries(results.map((r) => [r.jobId, r.apps])),
        );
      })
      .catch((err) =>
        setError((err as Error).message || "Failed to load data"),
      );
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (jobs.length === 0) {
    return (
      <div className="home-container">
        <h1>Applicants</h1>
        <p>You haven't posted any jobs yet.</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="applicants-header">
        <h1>Applicants</h1>

        <button
          className={`view-toggle-btn${view === "table" ? " active" : ""}`}
          title={
            view === "cards" ? "Switch to table view" : "Switch to card view"
          }
          onClick={() => setView(view === "cards" ? "table" : "cards")}
        >
          <i
            className={
              view === "cards" ? "fa-solid fa-table" : "fa-solid fa-table-cells"
            }
          ></i>{" "}
          {view === "cards" ? "Table" : "Cards"}
        </button>
      </div>
      {jobs.map((job) => {
        const applicants = applicantsByJob[job.id] || [];
        return (
          <div key={job.id} style={{ marginBottom: "2rem" }}>
            {applicants.length === 0 ? (
              <div className="job-card application-card">
                <h3>{job.title}</h3>
                <p>No applicants for this job yet.</p>
              </div>
            ) : (
              <div className="card-list">
                {applicants.map((a) => (
                  <ApplicantCard
                    key={a.application_id}
                    applicant={a}
                    job={job}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Applicant;
