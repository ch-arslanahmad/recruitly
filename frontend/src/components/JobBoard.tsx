// Applicant view: browse all jobs (GET /api/jobs)
// Recruiter view: their posted jobs with applicant count (GET /api/jobs/my)
import JobCard from "./JobCard";
import { useEffect, useState } from "react";
import { Job } from "../types";
import { api } from "../api";

function JobBoard({
  mode,
  page_title,
  page_description,
}: {
  mode: "all" | "saved";
  page_title: string;
  page_description: string;
}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState("");

  // searching
  const [search, setSearch] = useState("");

  // filtering and sorting
  const [typeFilter, setTypeFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  // for pagination
  const [page, setPage] = useState(1);
  const perPage = 10;

  const searched = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase()),
  );

  const filtered = searched.filter((job) =>
    typeFilter ? job.type === typeFilter : true,
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy == "date") {
      const dataA = a.created_at
        ? new Date(a.created_at.replace(" ", "T")).getTime()
        : 0;
      const dataB = b.created_at
        ? new Date(b.created_at.replace(" ", "T")).getTime()
        : 0;
      return dataA - dataB;
    } else if (sortBy == "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  useEffect(() => {
    const fetchJobs =
      mode === "saved" ? api.jobs.saved.getAll : api.jobs.getAll;
    fetchJobs()
      .then((data: Job[]) => setJobs(data))
      .catch((err) => setError(err.message));
  }, [mode]);

  const totalPages = Math.ceil(sorted.length / perPage);

  const offset = (page - 1) * perPage; // calculate offset
  const visible = sorted.slice(offset, offset + perPage); // from offset to offset + perPage

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  let message = null;

  if (visible.length === 0 && search) {
    message = <p>No jobs match "{search}"</p>;
  } else if (visible.length === 0) {
    message = <p>No jobs found for "{search || typeFilter}"</p>;
  }

  return (
    <div className="home-container">
      {page_title && page_description && (
        <>
          <h1>{page_title}</h1>
          <p> {page_description}</p>
        </>
      )}

      <div className="search-bar">
        <input
          id="search"
          name="search"
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset the page to 1
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
                {["full-time", "part-time", "contract", "remote"].map(
                  (type) => {
                    return (
                      <button
                        key={type}
                        className={`chip ${typeFilter === type ? "active" : ""}`}
                        onClick={() => {
                          setTypeFilter(typeFilter === type ? "" : type);
                          setPage(1);
                        }}
                      >
                        {type}
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
      <div className="card-list">
        {jobs.length === 0 && (
          <p>
            {mode === "saved"
              ? "You haven't saved any jobs yet."
              : "No jobs found right now. Check back soon."}
          </p>
        )}

        {message}

        {visible.length != 0 && (
          <>
            {visible.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </>
        )}
      </div>
      {totalPages > 1 && (
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
      )}
    </div>
  );
}

export default JobBoard;
