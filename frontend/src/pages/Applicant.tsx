import { useState, useEffect } from "react";
import { Job, JobApplicant } from "../types";
import { api } from "../api";

function ApplicantCard({ applicant }: { applicant: JobApplicant }) {
  return (
    <div className="job-card application-card">
      <h3>{applicant.candidate_name}</h3>
      <p>
        <i className="fa-solid fa-clipboard-check card-icon"></i>
        {applicant.status}
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
      .catch((err) => setError((err as Error).message || "Failed to load data"));
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
      <h1>Applicants</h1>
      {jobs.map((job) => {
        const applicants = applicantsByJob[job.id] || [];
        return (
          <div key={job.id} style={{ marginBottom: "2rem" }}>
            <h2 style={{ marginBottom: "1rem" }}>{job.title}</h2>
            {applicants.length === 0 ? (
              <p>No applicants for this job yet.</p>
            ) : (
              <div className="card-list">
                {applicants.map((a) => (
                  <ApplicantCard key={a.application_id} applicant={a} />
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
