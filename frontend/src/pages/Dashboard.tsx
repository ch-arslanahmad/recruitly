import { useEffect, useState, useRef, FormEvent } from "react";
import { Link } from "react-router-dom";
import { User, Job } from "../types";
import { api } from "../api";
import "./Dashboard.css";

interface Stats {
  total_jobs: number;
  total_applications: number;
  jobs_last_7_days: number;
  total_interviews: number;
}

function Dashboard({ user }: { user: User }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<Stats>({
    total_jobs: 0,
    total_applications: 0,
    jobs_last_7_days: 0,
    total_interviews: 0,
  });
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [form, setForm] = useState({
    title: "",
    about_role: "",
    location: "",
    salary: 0,
    type: "full-time",
    requirements: "",
    responsibilities: "",
  });

  useEffect(() => {
    api.recruiter.job
      .getMy()
      .then((res) => {
        console.log("My Jobs:", res.jobs.length);
        setJobs(res.jobs);
      })
      .catch((err) => {
        console.error("Failed to fetch my jobs:", err);
      });

    api.recruiter.job
      .stats()
      .then((res) => {
        console.log("recruiter stats loaded.", res);
        setStats(res);
      })
      .catch((err) => {
        console.error("Failed to fetch recruiter stats", err);
      });
  }, [user.id]);

  function updateJob(jobId: number, updated: Partial<Job>) {
    api.recruiter.job
      .update(jobId, updated)
      .then(() => {
        // get the previous jobs then get the updated job by id and update
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, ...updated } : j)),
        );
      })
      .catch((err) => {
        console.error("Failed to update job status", err);
      });
  }

  function handlePostJob(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    api.recruiter.job
      .create({
        title: form.title,
        about_role: form.about_role,
        location: form.location,
        salary: Number(form.salary),
        type: form.type,
        requirements: form.requirements || undefined,
        responsibilities: form.responsibilities || undefined,
      })
      .then(() => {
        dialogRef.current?.close();
        setForm({
          title: "",
          about_role: "",
          location: "",
          salary: 100,
          type: "full-time",
          requirements: "",
          responsibilities: "",
        });
        return api.recruiter.job.getMy();
      })
      .then((res) => setJobs(res.jobs))
      .catch((err) => {
        alert(err.message);
      });
  }

  return (
    <>
      <div className="dashboard">
        <div className="header-bar">
          <div className="company-info">
            <div className="company-logo">R</div>
            <div>
              <div className="company-name">{user?.company}</div>
              <div className="company-role">Employer Account</div>
            </div>
          </div>
          <div className="user-avatar">A</div>
        </div>

        <h1>Dashboard</h1>
        <p className="sub">
          Welcome back, {user?.name}! Here's what's happening with your jobs.
        </p>

        {/* Stats */}
        <div className="stats">
          <div className="stat-card">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
            <div className="num">{stats.total_jobs}</div>
            <div className="label">Jobs Posted</div>
          </div>
          <div className="stat-card">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <div className="num">{stats.total_applications}</div>
            <div className="label">Total Applicants</div>
          </div>
          <div className="stat-card">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <div className="num">{stats.jobs_last_7_days}</div>
            <div className="label">New This Week</div>
          </div>
          <div className="stat-card">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <div className="num">{stats.total_interviews}</div>
            <div className="label">Interviews Scheduled</div>
          </div>
        </div>

        <div className="layout">
          <div className="main">
            <div className="top-bar">
              <div className="top-bar-left">
                <span style={{ fontWeight: 600 }}>Your Job Listings</span>
                <Link className="view-all" to="/my-jobs">
                  View All &rarr;
                </Link>
              </div>
              <button
                className="post-btn"
                onClick={() => dialogRef.current?.showModal()}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Post New Job
              </button>
            </div>

            <div className="job-table">
              <div className="table-header">
                <div className="col-title">Job Title</div>
                <div className="col-status">Status</div>
                <div className="col-apps">Applicants</div>
                <div className="col-actions">Edit</div>
              </div>

              {jobs.length === 0 ? (
                <div className="table-row">
                  <div
                    className="col-title"
                    style={{
                      textAlign: "center",
                      color: "#888",
                      width: "100%",
                    }}
                  >
                    No jobs posted yet.
                  </div>
                </div>
              ) : (
                jobs.map((job) => (
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
                        onClick={() =>
                          updateJob(job.id, {
                            ...job,
                            status: job.status === "closed" ? "open" : "closed",
                          })
                        }
                        className={`badge ${
                          job.status === "closed" ? "closed" : "active"
                        }`}
                      >
                        {job.status === "closed" ? "Closed" : "Active"}
                      </button>
                    </div>
                    <div className="col-apps">{job.applicant_count}</div>
                    <div className="col-actions">
                      <button className="icon-btn edit-btn">
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
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="sidebar">
            <div className="quick-card">
              <h3>Quick Actions</h3>
              <ul>
                <li>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Post a New Job
                </li>
                <li>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  View All Applicants
                </li>
                <li>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Message Candidates
                </li>
                <li>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  Edit Company Profile
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className="dialog-header">
          <div className="form-job-detail">
            <h2>Post a New Job</h2>
          </div>
          <button
            className="dialog-close"
            onClick={() => dialogRef.current?.close()}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <form onSubmit={handlePostJob}>
          <label>Job Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <label>About the Role</label>
          <textarea
            required
            value={form.about_role}
            onChange={(e) => setForm({ ...form, about_role: e.target.value })}
          />

          <label>Location</label>
          <input
            required
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <label>Salary ($)</label>
          <input
            type="number"
            required
            value={form.salary}
            onChange={(e) =>
              setForm({ ...form, salary: Number(e.target.value) })
            }
          />

          <label>Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="remote">Remote</option>
          </select>

          <label>Requirements (comma separated)</label>
          <textarea
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
          />

          <label>Responsibilities (comma separated)</label>
          <textarea
            value={form.responsibilities}
            onChange={(e) =>
              setForm({ ...form, responsibilities: e.target.value })
            }
          />

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => dialogRef.current?.close()}
            >
              Cancel
            </button>
            <button type="submit">Post Job</button>
          </div>
        </form>
      </dialog>
    </>
  );
}

export default Dashboard;
