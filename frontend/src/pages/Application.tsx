import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Application as ApplicationType,
  Job,
  ApplicationWithJob,
} from "../types";
import { api } from "../api";

function Application() {
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
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
      .then((data: ApplicationWithJob[]) => {
        setApplications(data);
        setJobLoaded(true);
      })
      .catch((err) => setError(err.message));
  }, []);

  const searched = applications.filter(
    (app) =>
      (app.job_title ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (app.company ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const filtered = searched.filter((app) =>
    statusFilter ? app.status === statusFilter : true,
  );

  // .sort() mutates the array in place, so copy it with spread first
  let displayed = filtered;
  if (sortBy === "date") {
    displayed = [...filtered].sort((a, b) => {
      const dataA = a.created_at
        ? new Date(a.created_at.replace(" ", "T")).getTime()
        : 0;
      const dataB = b.created_at
        ? new Date(b.created_at.replace(" ", "T")).getTime()
        : 0;
      return dataA - dataB;
    });
  } else if (sortBy === "title") {
    displayed = [...filtered].sort((a, b) =>
      (a.job_title ?? "").localeCompare(b.job_title ?? ""),
    );
  }

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  let message = null;
  if (applications.length === 0) {
    message = <p>You haven't applied to any jobs yet.</p>;
  } else if (displayed.length === 0 && (search || statusFilter)) {
    message = <p>No applications match "{search || statusFilter}"</p>;
  }

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

          <div className="filter-group" style={{ alignItems: "end" }}>
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

      {message}

      <div className="card-list">
        {displayed.map((app) => {
          return (
            <div key={app.id} className="job-card application-card">
              <h2 className={app.job_title ? "" : "placeholder"}>
                {app.job_title ? app.job_title : `Job #${app.job_id}`}
              </h2>
              {app.company && (
                <p className="meta">
                  <i className="fa-solid fa-building card-icon"></i>
                  {app.company}
                  <span>&middot;</span>
                  <i className="fa-solid fa-location-dot card-icon"></i>
                  {app.location}
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
