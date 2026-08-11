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

  // const [search, setSearch] = useState("");

  // paginations
  const [page, setPage] = useState(1);

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

  // const searched = jobs.filter((job) =>
  //   job.title.toLowerCase().includes(search.toLowerCase()) || ,
  // );

  // paginations
  const offset = (page - 1) * perPage;
  const totalPages = Math.ceil(applicants.length / perPage);
  const visible = applicants.slice(offset, offset + perPage);

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
