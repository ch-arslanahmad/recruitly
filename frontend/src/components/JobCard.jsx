import '@fortawesome/fontawesome-free/css/all.min.css';


function JobCard({ job }) {
    return (
        <div className="job-card">
            <h2>{job.title}</h2>

            <div className="card-details">

            <p><i className="fa-solid fa-briefcase"></i> {job.company}</p>
            <p><i className="fa-solid fa-map-marker-alt"></i> {job.location}</p>
            <p><i className="fa-solid fa-dollar-sign"></i> {job.salary}</p>
                <p><i className="fa-solid fa-clock"></i> {job.type}</p>
                </div>
        </div>
    );
}

export default JobCard;