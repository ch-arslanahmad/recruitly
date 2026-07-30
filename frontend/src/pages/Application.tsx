import { useState, useEffect } from 'react'
import { Application as ApplicationType, Job } from '../types';
import { api } from '../api';

function Application() {
  const [applications, setApplications] = useState<ApplicationType[]>([]);
  const [jobs, setJobs] = useState<Record<number, Job>>({});

  useEffect(() => {
    api.applications.my()
      .then((data: ApplicationType[]) => {
        setApplications(data);
        // Fetch job details for each application


        Promise.all(
        data.map((app: ApplicationType) => {
          api.jobs.get(app.job_id)
              .then((res: { job: Job }) => setJobs((prev) => ({ ...prev, [app.job_id]: res.job })))
              .catch(() => {});
          })
        );
      })
      .catch((err) => alert(err.message));
  }, []);

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
            <div key={app.id} className="job-card">
              <h2>{job ? job.title : `Job #${app.job_id}`}</h2>
              {job && <p>{job.company} &middot; {job.location}</p>}
              <p>Status: <strong>{app.status}</strong></p>
              {app.created_at && (
                <p>Applied: {new Date(app.created_at).toLocaleDateString()}</p>
              )}
              <a href={`/jobs/${app.job_id}`} className="view-details">View Job</a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Application;
