import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import type { Job } from "../types";

function JobDetail() {
  const [isApplied, setIsApplied] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState("");

  const { id } = useParams();

  useEffect(() => {
    fetch(`/api/jobs/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error("Server error");
        return response.json();
      })
      .then((data) => setJob(data.job))
      .catch((err) => {
        if (err.message === "Failed to fetch")
          setError("Backend is not running");
        else setError(err.message);
      });
  }, [id]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!job) return <p>Not Found...</p>;

  return (<>
    <div className="job-details">
      <div id="main-content">
        <h2 id="title">{job.title}</h2>
        <p id="about-role">{job.about_role}</p>
        <h3>Requirements</h3>
        <div id="requirements">{job.requirements?.split(",").map((skill, i) => <span key={i}>{skill}</span>)}</div>
        <h3>Responsibilities</h3>
        <div id="responsibilities">{job.responsibilities?.split(",").map((responsibility, i) => <span key={i}>{responsibility}</span>)}</div>
      </div>
      <div id="side-bar">
        <div id="company">
          <i className="fas fa-building"></i>
          {job.company}
        </div>
        <div id="location">
          <i className="fas fa-location"></i>
          {job.location}
        </div>
        <div id="type">
          <i className="fas fa-briefcase"></i>
          {job.type}
        </div>
        <div id="salary">
          <i className="fas fa-money-bill-wave"></i>
          ${job.salary.toLocaleString()}
        </div>
        {job.created_at && <div id="created-at">
          <i className="fas fa-calendar"></i>
        {new Date(job.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </div>}
      <button onClick={() => setIsApplied(true)} disabled={isApplied}>
        {isApplied ? "Already Applied" : "Apply"}
        </button>
        </div>
    </div>
  </>
  );
}

export default JobDetail;
