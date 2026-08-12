import { useState, useEffect, useRef } from "react";
import { api } from "../api";
import { Job } from "../types";
import JobTable from "../components/JobTable";
import JobFormModal from "../components/JobFormModal";
import "./Dashboard.css";

function MyJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState("");

  const dialogRef = useRef<HTMLDialogElement>(null);

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const perPage = 5;

  useEffect(() => {
    loadJobs();
  }, []);

  function loadJobs() {
    api.recruiter.job
      .getMy()
      .then((res) => setJobs(res.jobs))
      .catch((err) =>
        setError((err as Error).message || "Failed to load data"),
      );
  }

  function toggleStatus(jobId: number, newStatus: "open" | "closed") {
    api.recruiter.job
      .update(jobId, { status: newStatus })
      .then(() => {
        setJobs((prev) =>
          prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j)),
        );
      })
      .catch((err) =>
        setError((err as Error).message || "Failed to update job"),
      );
  }

  function deleteJob(id: number) {
    if (!confirm("Delete this job? This cannot be undone.")) return;
    api.recruiter.job
      .remove(id)
      .then(() => setJobs((prev) => prev.filter((j) => j.id !== id)))
      .catch((err) =>
        setError((err as Error).message || "Failed to delete job"),
      );
  }

  const searched = jobs
    .filter((job) => {
      const matchesSearch =
        (job.title ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (job.location ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        const dataA = a.created_at
          ? new Date(a.created_at.replace(" ", "T")).getTime()
          : 0;
        const dataB = b.created_at
          ? new Date(b.created_at.replace(" ", "T")).getTime()
          : 0;
        return dataA - dataB;
      }
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

  const totalPages = Math.ceil(searched.length / perPage);

  const offset = (page - 1) * perPage;

  const visible = searched.slice(offset, offset + perPage);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <div className="home-container">
        <div className="heading">
          <h1>My Jobs</h1>
          <button
            className="post-btn"
            onClick={() => {
              setJob(null);
              dialogRef.current?.showModal();
            }}
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
                  {["open", "closed"].map((status) => (
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
                  ))}
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

        {jobs.length === 0 ? (
          <p>You haven't posted any jobs yet.</p>
        ) : visible.length === 0 ? (
          <p>No jobs match your search.</p>
        ) : (
          <JobTable
            jobs={visible}
            emptyMessage="You haven't posted any jobs yet."
            statusToggle={toggleStatus}
            onEdit={(selectedJob) => {
              setJob(selectedJob);
              dialogRef.current?.showModal();
            }}
            onDelete={deleteJob}
          />
        )}

        <div className="pagination">
          <button onClick={() => setPage(1)}>First Page</button>

          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
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
      </div>

      <JobFormModal
        dialogRef={dialogRef}
        mode={job ? "edit" : "create"}
        job={job ?? undefined}
        onSaved={(savedJob: Job) =>
          setJobs((prev) => {
            const exists = prev.find((j) => j.id === savedJob.id);
            return exists
              ? prev.map((j) => (j.id === savedJob.id ? savedJob : j))
              : [savedJob, ...prev];
          })
        }
      />
    </>
  );
}

export default MyJobs;
