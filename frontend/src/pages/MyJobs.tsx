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
                    prev.map((j) =>
                        j.id === jobId ? { ...j, status: newStatus } : j,
                    ),
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

    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <>
            <div className="home-container">
                <h1>My Jobs</h1>
                <JobTable
                    jobs={jobs}
                    emptyMessage="You haven't posted any jobs yet."
                    statusToggle={toggleStatus}
                    onEdit={(selectedJob) => {
                        setJob(selectedJob);
                        dialogRef.current?.showModal();
                    }}
                    onDelete={deleteJob}
                />
            </div>

            <JobFormModal
                dialogRef={dialogRef}
                mode={job ? "edit" : "create"}
                job={job ?? undefined}
                onSaved={(savedJob: Job) =>
                    setJobs((prev) => {
                        // find() returns the matching job object, or undefined.
                        // Truthy = EDITING (row already in list); undefined = CREATING (new job).
                        const exists = prev.find((j) => j.id === savedJob.id);

                        // EDIT: rebuild the list, replacing only the row with
                        //       this id (savedJob), leaving every other job untouched.
                        // CREATE: new job goes on top: [newJob, ...oldList].
                        return exists
                            ? prev.map((j) =>
                                  j.id === savedJob.id ? savedJob : j,
                              )
                            : [savedJob, ...prev];
                    })
                }
            />
        </>
    );
}

export default MyJobs;
