// TODO: Implement PDF generation and storage
// - Generate dummy PDF if none uploaded
// - Save PDF to local disk
// - Store file path in database
//  - Update DB with PDF reference
import { useEffect, useRef, useState, FormEvent } from "react";
import { useParams } from "react-router-dom";
import type { Job } from "../types";
import { api } from "../api";
import ErrorPage from "./ErrorPage";

function JobDetail() {
    const [job, setJob] = useState<Job | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [applied, setApplied] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<{
        code: number;
        message: string;
    } | null>(null);

    const { id } = useParams<{ id: string }>();
    const jobId = Number(id);

    useEffect(() => {
        const t = localStorage.getItem("recruitly_token");
        if (!t) return;

        api.jobs.saved
            .check(jobId)
            .then((data) => {
                setSaved(data.isSaved);
            })
            .catch((err) => {
                alert(err.message);
            });
    }, [jobId]);

    function toggleSave() {
        const t = localStorage.getItem("recruitly_token");
        if (!t || !job) return;

        api.jobs.saved
            .toggle(job.id, saved)
            .then(() => setSaved(!saved))
            .catch((err) => alert(err.message));
    }

    useEffect(() => {
        const t = localStorage.getItem("recruitly_token");
        if (!t) return;

        api.jobs
            .get(jobId)
            .then((data) => {
                setJob(data.job as Job);
            })
            .catch((err) => {
                if (err.status === 403) {
                    setError({
                        code: 403,
                        message:
                            "Access denied. This page is for applicants only.",
                    });
                } else {
                    setError({ code: err.status, message: err.message });
                }
            });
    }, [jobId]);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        api.applications
            .apply(jobId)
            .then(() => {
                setApplied(true);
                dialogRef.current?.close();
            })
            .catch((err) => alert(err.message || "Failed to apply"));
    }

    return (
        <>
            {error ? (
                <ErrorPage
                    errorCode={error.code}
                    errorMessage={error.message}
                />
            ) : job ? (
                <div className="job-details">
                    <div className="main-content">
                        <h2>{job.title}</h2>
                        <p className="about-role">{job.about_role}</p>
                        <h3>Requirements</h3>
                        <div className="requirements">
                            {job.requirements?.split(",").map((skill, i) => (
                                <span key={i} className="skill-tag">
                                    {skill}
                                </span>
                            ))}
                        </div>
                        <h3>Responsibilities</h3>
                        <div className="responsibilities">
                            {job.responsibilities
                                ?.split(",")
                                .map((responsibility, i) => (
                                    <span key={i} className="skill-tag">
                                        {responsibility}
                                    </span>
                                ))}
                        </div>
                    </div>
                    <div className="side-bar">
                        <div className="sidebar-item">
                            <i className="fas fa-building sidebar-icon"></i>
                            {job.company}
                        </div>
                        <div className="sidebar-item">
                            <i className="fas fa-location sidebar-icon"></i>
                            {job.location}
                        </div>
                        <div className="sidebar-item">
                            <i className="fas fa-briefcase sidebar-icon"></i>
                            {job.type}
                        </div>
                        <div className="sidebar-item">
                            <i className="fas fa-money-bill-wave sidebar-icon"></i>
                            ${job.salary.toLocaleString()}
                        </div>
                        {job.created_at && (
                            <div className="sidebar-item">
                                <i className="fas fa-calendar sidebar-icon"></i>
                                {new Date(job.created_at).toLocaleDateString(
                                    "en-US",
                                    { month: "long", year: "numeric" },
                                )}
                            </div>
                        )}

                        <div className="sidebar-actions">
                            <button
                                onClick={() => dialogRef.current?.showModal()}
                                disabled={applied}
                            >
                                {applied ? "Applied" : "Apply"}
                            </button>
                            <button
                                className={`bookmark-btn${saved ? " saved" : ""}`}
                                onClick={toggleSave}
                            >
                                <i
                                    className={`fa${saved ? "s" : "r"} fa-bookmark`}
                                ></i>
                            </button>
                        </div>
                        <dialog
                            ref={dialogRef}
                            onClick={(e) => {
                                if (e.target === dialogRef.current)
                                    dialogRef.current?.close();
                            }}
                        >
                            <div className="dialog-header">
                                <div className="form-job-detail">
                                    <h2>Apply to {job.title}</h2>
                                    <p>{job.company}</p>
                                </div>
                                <button
                                    className="dialog-close"
                                    onClick={() => dialogRef.current?.close()}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="coverLetter">
                                    Cover Letter
                                </label>
                                <input
                                    type="file"
                                    id="coverLetter"
                                    name="coverLetter"
                                    accept=".pdf"
                                />
                                <label htmlFor="resume">Resume</label>
                                <input
                                    type="file"
                                    id="resume"
                                    name="resume"
                                    accept=".pdf"
                                />
                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="btn-cancel"
                                        onClick={() =>
                                            dialogRef.current?.close()
                                        }
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit">
                                        Submit Application
                                    </button>
                                </div>
                            </form>
                        </dialog>
                    </div>
                </div>
            ) : (
                <div>Loading...</div>
            )}
        </>
    );
}

export default JobDetail;
