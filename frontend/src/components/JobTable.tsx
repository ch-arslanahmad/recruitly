import { Job } from "../types";
import "./../pages/Dashboard.css";

interface JobTableProps {
    jobs: Job[];
    statusToggle: (jobId: number, newStatus: "open" | "closed") => void;
    onDelete?: (id: number) => void;
    onEdit?: (job: Job) => void;
    emptyMessage: string;
    actionsLabel?: string;
}

function JobTable({
    jobs,
    statusToggle,
    onDelete,
    onEdit,
    emptyMessage,
}: JobTableProps) {
    return (
        <div className="job-table">
            <div className="table-header">
                <div className="col-title">Job Title</div>
                <div className="col-status">Status</div>
                <div className="col-apps">Applicants</div>
                <div className="col-actions">Actions</div>
            </div>

            {jobs.length === 0 ? (
                <div className="table-row">
                    <div className="col-title table-empty">{emptyMessage}</div>
                </div>
            ) : (
                jobs.map((job) => (
                    <div key={job.id} className="table-row">
                        <div className="col-title">
                            {job.title}
                            <span>
                                {job.location} &middot; {job.type} &middot; $
                                {job.salary.toLocaleString()}
                            </span>
                        </div>
                        <div className="col-status">
                            <button
                                onClick={() =>
                                    statusToggle(
                                        job.id,
                                        job.status === "closed"
                                            ? "open"
                                            : "closed",
                                    )
                                }
                                className={`badge ${job.status === "closed" ? "closed" : "active"}`}
                            >
                                {job.status === "closed" ? "Closed" : "Active"}
                            </button>
                        </div>
                        <div className="col-apps">{job.applicant_count}</div>
                        <div className="col-actions">
                            <button
                                className="icon-btn edit-btn"
                                title="Edit"
                                onClick={() => onEdit?.(job)}
                            >
                                <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                </svg>
                            </button>
                            {onDelete && (
                                <button
                                    className="icon-btn delete-btn"
                                    title="Delete"
                                    onClick={() => onDelete(job.id)}
                                >
                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M3 6h18" />
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        <line x1="10" y1="11" x2="10" y2="17" />
                                        <line x1="14" y1="11" x2="14" y2="17" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default JobTable;
