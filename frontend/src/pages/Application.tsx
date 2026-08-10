import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Application as ApplicationType, Job } from "../types";
import { api } from "../api";

function Application() {
  const [applications, setApplications] = useState<ApplicationType[]>([]);
  const [jobs, setJobs] = useState<Record<number, Job>>({});
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState<"" | "date" | "title">("");

  const [jobLoaded, setJobLoaded] = useState(false);

  useEffect(() => {
    api.applications
      .my()
      .then((data: ApplicationType[]) => {
        setApplications(data);
        // Fetch job details for each application

        Promise.all(
          data.map((app: ApplicationType) =>
            api.jobs
              .get(app.job_id)
              .then((res: { job: Job }) =>
                setJobs((prev) => ({ ...prev, [app.job_id]: res.job })),
              )
              .catch(() => {}),
          ),
        ).then(() => setJobLoaded(true));
      })
      .catch((err) => setError(err.message));
  }, []);

  const searched = applications.filter(
    (app) =>
      (jobs[app.job_id]?.title ?? "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (jobs[app.job_id]?.company ?? "")
        .toLowerCase()
        .includes(search.toLowerCase()),
  );

  const filtered = searched.filter(
    (app) => statusFilter === "" || app.status === statusFilter,
  );

  // .sort() mutates the array in place, so copy it with spread first
  let displayed = filtered;
  if (sortBy === "date") {
    displayed = [...filtered].sort((a, b) => {
      const dataA = a.created_at
        ? new Date(a.created_at.replace(" ", "T")).getTime()
        : 0;
      console.log(`dataA: ${dataA}`);
      const dataB = b.created_at
        ? new Date(b.created_at.replace(" ", "T")).getTime()
        : 0;
      console.log(`dataB: ${dataB}`);
      console.log(`dataB - dataA: ${dataB - dataA}`);
      return dataA - dataB;
    });
  } else if (sortBy === "title") {
    displayed = [...filtered].sort((a, b) =>
      (jobs[a.job_id]?.title ?? "").localeCompare(jobs[b.job_id]?.title ?? ""),
    );
  }

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="home-container">
      <h1>My Applications</h1>
      <div className="search-bar">
        <input
          type="text"
          disabled={!jobLoaded}
          placeholder="Search by job title or company..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />

        <div className="filter-sort-row">
          <div className="filter-group">
            <button
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <i className="fa-solid fa-filter"></i> Filter
              <i
                className={`fa-solid fa-chevron-${showFilters ? "up" : "down"}`}
              ></i>
            </button>

            {showFilters && (
              <div className="filter-options">
                {["applied", "interviewing", "offered", "rejected"].map(
                  (status) => {
                    return (
                      <button
                        key={status}
                        className={`chip ${statusFilter === status ? "active" : ""}`}
                        onClick={() =>
                          setStatusFilter(statusFilter === status ? "" : status)
                        }
                      >
                        {status}
                      </button>
                    );
                  },
                )}
              </div>
            )}
          </div>

          <div className="filter-group">
            <button
              className="filter-toggle"
              onClick={() => setShowSort(!showSort)}
            >
              <i className="fa-solid fa-arrow-down-wide-short"></i> Sort
              <i
                className={`fa-solid fa-chevron-${showSort ? "up" : "down"}`}
              ></i>
            </button>

            {showSort && (
              <div className="filter-options">
                <button
                  className={`chip ${sortBy === "date" ? "active" : ""}`}
                  onClick={() => setSortBy(sortBy === "date" ? "" : "date")}
                >
                  Date ↑
                </button>
                <button
                  className={`chip ${sortBy === "title" ? "active" : ""}`}
                  onClick={() => setSortBy(sortBy === "title" ? "" : "title")}
                >
                  Title ↓
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {applications.length === 0 ? (
        <p>You haven't applied to any jobs yet.</p>
      ) : displayed.length === 0 && search ? (
        <p>No applications match "{search}"</p>
      ) : null}

      <div className="card-list">
        {displayed.map((app) => {
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

                  {new Date(
                    app.created_at.replace(" ", "T"),
                  ).toLocaleDateString("en-US")}
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
