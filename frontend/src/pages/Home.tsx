import { useEffect, useState } from "react";
import JobBoard from "../components/JobBoard";

function Home({ role }: { role: string | undefined }) {
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/jobs")
            .then((response) => {
                if (!response.ok) throw new Error("Server error");
                return response.json();
            })
            .then((data) => setJobs(data))
            .catch((err) => {
                if (err.message === "Failed to fetch")
                    setError("Backend is not running");
                else setError(err.message);
            });
    }, []);

    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return <JobBoard jobs={jobs} />;
}

export default Home;
