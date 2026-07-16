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

    return (
        <div>
            <h2>{job.title}</h2>
            <p>{job.description}</p>
            <button onClick={() => setIsApplied(true)} disabled={isApplied}>
                {isApplied ? "Already Applied" : "Apply"}
            </button>
        </div>
    );
}

export default JobDetail;
