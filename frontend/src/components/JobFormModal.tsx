import { useState, useEffect, RefObject } from "react";
import { Job } from "../types";
import { api } from "../api";

function JobFormModal({
    dialogRef,
    mode,
    job,
    onSaved,
}: {
    dialogRef: RefObject<HTMLDialogElement | null>;
    mode: "create" | "edit";
    job?: Job;
    onSaved: (job: Job) => void;
}) {
    useEffect(() => {
        if (job) {
            setForm({
                title: job.title,
                about_role: job.about_role,
                location: job.location,
                salary: job.salary,
                type: job.type,
                requirements: job.requirements ?? "",
                responsibilities: job.responsibilities ?? "",
            });
        } else {
            setForm({
                title: "",
                about_role: "",
                location: "",
                salary: 0,
                type: "full-time",
                requirements: "",
                responsibilities: "",
            });
        }
    }, [job]);

    const [form, setForm] = useState({
        title: job?.title ?? "",
        about_role: job?.about_role ?? "",
        location: job?.location ?? "",
        salary: job?.salary ?? 0,
        type: job?.type ?? "full-time",
        requirements: job?.requirements ?? "",
        responsibilities: job?.responsibilities ?? "",
    });

    function handlePostJob(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (mode == "create") {
            api.recruiter.job
                .create({
                    title: form.title,
                    about_role: form.about_role,
                    location: form.location,
                    salary: Number(form.salary),
                    type: form.type,
                    requirements: form.requirements || undefined,
                    responsibilities: form.responsibilities || undefined,
                })
                .then((job: Job) => {
                    dialogRef?.current?.close();
                    setForm({
                        title: "",
                        about_role: "",
                        location: "",
                        salary: 100,
                        type: "full-time",
                        requirements: "",
                        responsibilities: "",
                    });
                    onSaved(job);
                })
                .catch((err) => {
                    alert(err.message);
                });
        } else if (mode == "edit" && job) {
            /* if mode == edit and job is provided to be edited */
            api.recruiter.job
                .update(job.id, {
                    title: form.title,
                    about_role: form.about_role,
                    location: form.location,
                    salary: Number(form.salary),
                    type: form.type,
                    requirements: form.requirements || undefined,
                    responsibilities: form.responsibilities || undefined,
                })
                .then(() => {
                    // Save succeeded. Close the dialog, clear the form for
                    // next time, then hand the parent the updated job.
                    dialogRef?.current?.close();
                    setForm({
                        title: "",
                        about_role: "",
                        location: "",
                        salary: 100,
                        type: "full-time",
                        requirements: "",
                        responsibilities: "",
                    });

                    onSaved({
                        ...job, // the real job: keeps id, status, applicant_count
                        title: form.title, // only these fields get overwritten
                        about_role: form.about_role,
                        location: form.location,
                        salary: Number(form.salary),
                        type: form.type,
                        requirements: form.requirements || undefined,
                        responsibilities: form.responsibilities || undefined,
                    });
                })
                .catch((err) => {
                    alert(err.message);
                });
        }
    }

    return (
        <dialog
            ref={dialogRef}
            onClick={(e) => {
                if (e.target === dialogRef?.current)
                    dialogRef?.current?.close();
            }}
        >
            <div className="dialog-header">
                <div className="form-job-detail">
                    {mode === "edit" ? (
                        <h2>Edit Job</h2>
                    ) : (
                        <h2>Post a New Job</h2>
                    )}
                </div>
                <button
                    className="dialog-close"
                    onClick={() => dialogRef?.current?.close()}
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>
            <form onSubmit={handlePostJob}>
                <label>Job Title</label>
                <input
                    name="title"
                    required
                    value={form.title}
                    onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                    }
                />

                <label>About the Role</label>
                <textarea
                    required
                    value={form.about_role}
                    onChange={(e) =>
                        setForm({ ...form, about_role: e.target.value })
                    }
                />

                <label>Location</label>
                <input
                    required
                    value={form.location}
                    onChange={(e) =>
                        setForm({ ...form, location: e.target.value })
                    }
                />

                <label>Salary ($)</label>
                <input
                    type="number"
                    required
                    value={form.salary}
                    onChange={(e) =>
                        setForm({ ...form, salary: Number(e.target.value) })
                    }
                />

                <label>Type</label>
                <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="remote">Remote</option>
                </select>

                <label>Requirements (comma separated)</label>
                <textarea
                    value={form.requirements}
                    onChange={(e) =>
                        setForm({ ...form, requirements: e.target.value })
                    }
                />

                <label>Responsibilities (comma separated)</label>
                <textarea
                    value={form.responsibilities}
                    onChange={(e) =>
                        setForm({ ...form, responsibilities: e.target.value })
                    }
                />

                <div className="form-actions">
                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => dialogRef?.current?.close()}
                    >
                        Cancel
                    </button>
                    <button type="submit">Post Job</button>
                </div>
            </form>
        </dialog>
    );
}

export default JobFormModal;
