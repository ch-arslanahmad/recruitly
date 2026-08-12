import "../App.css";
import { useState, useEffect } from "react";
import { ApplicantWithJob } from "../types";
import { api } from "../api";

function ApplicantCard({ applicant }: { applicant: ApplicantWithJob }) {
  const [status, setStatus] = useState(applicant.status);
  const [error, setError] = useState("");

  function updateStatus(newStatus: string) {
    if (newStatus === status) return;
    api.applications
      .updateStatus(applicant.id, newStatus)
      .then(() => {
        setStatus(newStatus);
      })
      .catch((err) => {
        setError((err as Error).message || "Failed to update status");
        console.error("Failed to update status:", err);
      });
  }

  return (
    <div className="job-card application-card">
      <h3>{applicant.job_title}</h3>
      <p className="meta">
        {applicant.location} &middot; {applicant.job_type}
      </p>
      <p>
        <i className="fa-solid fa-user card-icon"></i>
        {applicant.candidate_name}
      </p>
      <p>
        <i className="fa-solid fa-clipboard-check card-icon"></i>
        <label htmlFor={`status-${applicant.status}`} className="sr-only">
          Status
        </label>
        <select
          id={`status-${applicant.status}`}
          name="status"
          className={`status-badge ${status}`}
          value={status}
          onChange={(e) => updateStatus(e.target.value)}
        >
          <option value="applied">applied</option>
          <option value="interviewing">interviewing</option>
          <option value="offered">offered</option>
          <option value="rejected">rejected</option>
        </select>
      </p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {applicant.created_at && (
        <p>
          <i className="fa-solid fa-calendar card-icon"></i>
          {new Date(applicant.created_at).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

function ApplicantRow({ applicant }: { applicant: ApplicantWithJob }) {
  const [status, setStatus] = useState(applicant.status);
  const [error, setError] = useState("");

  function updateStatus(newStatus: string) {
    if (newStatus === status) return;
    api.applications
      .updateStatus(applicant.id, newStatus)
      .then(() => {
        setStatus(newStatus);
      })
      .catch((err) => {
        setError((err as Error).message || "Failed to update status");
        console.error("Failed to update status:", err);
      });
  }

  return (
    <>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="applicants-row">
        <div className="col-job">{applicant.job_title}</div>
        <div className="col-name">{applicant.candidate_name}</div>
        <div className="col-status">
          <select
            className={status}
            value={status}
            onChange={(e) => updateStatus(e.target.value)}
          >
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="offered">Offered</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="col-date">
          {applicant.created_at &&
            new Date(applicant.created_at).toLocaleDateString()}
        </div>
      </div>
    </>
  );
}

function ApplicantView({
  applicants,
  view,
}: {
  applicants: ApplicantWithJob[];
  view: "cards" | "table";
}) {
  if (view === "cards") {
    return (
      <div className="card-list">
        {applicants.map((applicant) => (
          <ApplicantCard key={applicant.id} applicant={applicant} />
        ))}
      </div>
    );
  } else {
    return (
      <div className="applicants-table">
        <div className="applicants-header-row">
          <div className="col-job">Job Title</div>
          <div className="col-name">Applicant</div>
          <div className="col-status">Status</div>
          <div className="col-date">Date</div>
        </div>
        {applicants.map((applicant) => (
          <ApplicantRow key={applicant.id} applicant={applicant} />
        ))}
      </div>
    );
  }
}

function Applicant() {
  const [applicants, setApplicants] = useState<ApplicantWithJob[]>([]);
  const [error, setError] = useState("");
  const [view, setView] = useState<"cards" | "table">("cards");

  const [search, setSearch] = useState("");

  // paginations
  const [page, setPage] = useState(1);

  // sorting & filtering
  const [sortBy, setSortBy] = useState<"" | "date" | "title">("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const perPage = view === "cards" ? 5 : 10; // number of items per page based on view

  useEffect(() => {
    api.recruiter
      .applicants()
      .then((data: ApplicantWithJob[]) => {
        setApplicants(data);
      })
      .catch((err) =>
        setError((err as Error).message || "Failed to load data"),
      );
  }, []);

  const sorted = [...applicants].sort((a, b) => {
    if (sortBy === "date") {
      const dataA = a.created_at
        ? new Date(a.created_at.replace(" ", "T")).getTime()
        : 0;
      const dataB = b.created_at
        ? new Date(b.created_at.replace(" ", "T")).getTime()
        : 0;
      return dataA - dataB;
    } else if (sortBy === "title") {
      return a.job_title.localeCompare(b.job_title);
    }
    return 0;
  });

  const filtered = sorted.filter((applicant) => {
    if (statusFilter) {
      return applicant.status === statusFilter;
    }
    return true;
  });

  const searched = filtered.filter(
    (applicant) =>
      applicant.job_title.toLowerCase().includes(search.toLowerCase()) ||
      applicant.candidate_name.toLowerCase().includes(search.toLowerCase()),
  );

  // paginations
  const offset = (page - 1) * perPage;
  const totalPages = Math.ceil(applicants.length / perPage);
  const visible = searched.slice(offset, offset + perPage);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (applicants.length === 0) {
    return (
      <div className="home-container">
        <h1>Applicants</h1>
        <p>You haven't posted any jobs yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="home-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by job title or location..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
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
                    (status) => (
                      <button
                        key={status}
                        className={`chip ${statusFilter === status ? "active" : ""}`}
                        onClick={() => {
                          setStatusFilter(statusFilter === status ? "" : status);
                          setPage(1);
                        }}
                      >
                        {status}
                      </button>
                    ),
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
                    onClick={() => {
                      setSortBy(sortBy === "date" ? "" : "date");
                      setPage(1);
                    }}
                  >
                    Date ↑
                  </button>
                  <button
                    className={`chip ${sortBy === "title" ? "active" : ""}`}
                    onClick={() => {
                      setSortBy(sortBy === "title" ? "" : "title");
                      setPage(1);
                    }}
                  >
                    Title ↓
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="applicants-header">
          <h1>Applicants</h1>

          <button
            className={`view-toggle-btn${view === "table" ? " active" : ""}`}
            title={
              view === "cards" ? "Switch to table view" : "Switch to card view"
            }
            onClick={() => {
              setView(view === "cards" ? "table" : "cards");
              setPage(1);
            }}
          >
            <i
              className={
                view === "cards"
                  ? "fa-solid fa-table"
                  : "fa-solid fa-table-cells"
              }
            ></i>{" "}
            {view === "cards" ? "Table" : "Cards"}
          </button>
        </div>
        <ApplicantView applicants={visible} view={view} />
      </div>

      <div className="pagination">
        <button onClick={() => setPage(1)} disabled={page === 1}>
          First Page
        </button>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
        <button
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages}
        >
          Last Page
        </button>
      </div>
    </>
  );
}

export default Applicant;
