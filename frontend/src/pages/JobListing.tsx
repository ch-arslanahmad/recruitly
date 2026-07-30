import { useEffect, useState } from "react";
import JobBoard from "../components/JobBoard";
import { Job } from "../types";
import { api } from "../api";

function JobListing({ mode }: { mode: "all" | "saved" }) {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = mode === "saved" ? api.saved.getAll : api.jobs.getAll;
    fetchJobs()
      .then((data: Job[]) => setJobs(data))
      .catch((err) => alert(err.message));
  }, [mode])

  return (
    <div>
      <h1 className="page-title">{mode === "all" ? "Job Listings" : "Saved Jobs"}</h1>
      <JobBoard jobs={jobs} />
    </div>
  );
}

export default JobListing;
