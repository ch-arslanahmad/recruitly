import { useEffect, useRef, useState } from "react";

import type { Job } from "../types";

function JobDetail() {
  const job: Job = {
      id: 0,
      recruiter_id: 10,
      title: "Job Title",
      about_role: "Job Description",
      requirements: "know this, know that, professional in speech",
      responsibilities: "responsibility 1, responsibility 2, responsibility 3",
      location: "lahore",
      salary: 1000,
      type: "full-time",
      company: "Google",
      created_at: "2026-01-15"
  };
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [applied, setApplied] = useState(false);


  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Form submitted!");
    setApplied(true);
    dialogRef.current?.close();
  }

  return (<>
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
      <button onClick={() => dialogRef.current?.showModal()} disabled={applied}>
        {applied ? 'Applied' : 'Apply'}
      </button>
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
  </>
  );
}

export default JobDetail;
