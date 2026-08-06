import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Application as ApplicationType, Job } from "../types";
import { api } from "../api";

function Application() {
  const [applications, setApplications] = useState<ApplicationType[]>([]);
  const [jobs, setJobs] = useState<Record<number, Job>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    api.applications
      .my()
      .then((data: ApplicationType[]) => {
        setApplications(data);
        // Fetch job details for each application

        Promise.all(
          data.map((app: ApplicationType) => {
            api.jobs
              .get(app.job_id)
              .then((res: { job: Job }) =>
                setJobs((prev) => ({ ...prev, [app.job_id]: res.job })),
              )
              .catch(() => {});
          }),
        );
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (applications.length === 0) {
    return (
      <div className="home-container">
        <h1>My Applications</h1>
        <p>You haven't applied to any jobs yet.</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h1>My Applications</h1>
      <div className="card-list">
        {applications.map((app) => {
          const job = jobs[app.job_id];
          return (
            <div key={app.id} className="job-card application-card">
              <h2 className={job ? "" : "placeholder"}>
                {job ? job.title : `Job #${app.job_id}`}
              </h2>
              {job && (
                <p className="meta">
                  <i className="fa-solid fa-building card-icon"></i>
                  {job.company}
                  <span>&middot;</span>
                  <i className="fa-solid fa-location-dot card-icon"></i>
                  {job.location}
                </p>
              )}
              <p>
                <i className="fa-solid fa-clipboard-check card-icon"></i>
                {app.status}
              </p>
              {app.created_at && (
                <p>
                  <i className="fa-solid fa-calendar card-icon"></i>

                  {new Date(app.created_at).toLocaleDateString()}
                </p>
              )}
              <Link to={`/jobs/${app.job_id}`} className="view-details">
                View Job
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Application;
