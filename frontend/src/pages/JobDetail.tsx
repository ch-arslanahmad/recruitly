// TODO: Implement PDF generation and storage
// - Generate dummy PDF if none uploaded
// - Save PDF to local disk
// - Store file path in database
//  - Update DB with PDF reference
import { useEffect, useRef, useState, FormEvent } from "react";
import { useParams } from "react-router-dom";
import type { Job } from "../types";

function JobDetail() {
  const [job, setJob] = useState<Job | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);

  const { id } = useParams<{ id: string }>();


    useEffect(() => {
      const token = localStorage.getItem("recruitly_token");
      if (!token) return;

      fetch(`/api/saved-jobs/check/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok)
            throw new Error("Failed to check saved job");
          return res.json();
        })
        .then((data) => {
          setSaved(data.isSaved);
        })
        .catch((err) => {
          alert(err.message);
        });
    }, [id])

  function toggleSave() {
    const token = localStorage.getItem("recruitly_token");
    if (!token) return;

    const method = saved ? "DELETE" : "POST";
    const url = saved ? `/api/saved-jobs/${job!.id}` : `/api/saved-jobs`;

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: method === "POST" ? JSON.stringify({ job_id: job!.id }) : undefined,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to toggle save");
        setSaved(!saved);
      })
      .catch((err) => {
        alert(err.message);
      });
  }


  useEffect(() => {
    const token = localStorage.getItem("recruitly_token");
    if (!token) return;

    fetch(`/api/jobs/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok)
          throw new Error("Failed to fetch job");
        return res.json();
      })
      .then((data) => {
        setJob(data.job as Job);
        console.log("Raw Data" + data);

        console.log("\nObject Data" + JSON.stringify(data as Job))
      })
      .catch((err) => {
        alert(err.message);
      });
  }, [id])


  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Form submitted!");
    setApplied(true);
    dialogRef.current?.close();
  }

  return (<>
    {job ?
      <div className="job-details">
        <div className="main-content">
          <h2>{job.title}</h2>
          <p className="about-role">{job.about_role}</p>
          <h3>Requirements</h3>
          <div className="requirements">{job.requirements?.split(",").map((skill, i) => <span key={i} className="skill-tag">{skill}</span>)}</div>
          <h3>Responsibilities</h3>
          <div className="responsibilities">{job.responsibilities?.split(",").map((responsibility, i) => <span key={i} className="skill-tag">{responsibility}</span>)}</div>
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
          {job.created_at && <div className="sidebar-item">
            <i className="fas fa-calendar sidebar-icon"></i>
            {new Date(job.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>}

          <div className="sidebar-actions">
          <button onClick={() => dialogRef.current?.showModal()} disabled={applied}>
            {applied ? 'Applied' : 'Apply'}
            </button>
            <button className={`bookmark-btn${saved ? " saved" : ""}`} onClick={toggleSave}><i className={`fa${saved ? "s" : "r"} fa-bookmark`}></i></button>
          </div>
          <dialog ref={dialogRef} onClick={(e) => { if (e.target === dialogRef.current) dialogRef.current?.close(); }}>
            <div className="dialog-header">
              <div className="form-job-detail">
                <h2>Apply to {job.title}</h2>
                <p>{job.company}</p>
              </div>
              <button className="dialog-close" onClick={() => dialogRef.current?.close()}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <label htmlFor="coverLetter">Cover Letter</label>
              <input type="file" id="coverLetter" name="coverLetter" accept=".pdf" />
              <label htmlFor="resume">Resume</label>
              <input type="file" id="resume" name="resume" accept=".pdf" />
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => dialogRef.current?.close()}>Cancel</button>
                <button type="submit" >Submit Application</button>
              </div>
            </form>
          </dialog>
        </div>
      </div>
      : <div>Loading...</div>}
  </>
  );
}

export default JobDetail;
