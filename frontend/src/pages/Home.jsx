import { useState } from 'react'
import JobCard from '../components/JobCard'

const initialJobs = [
    { id: 1, title: 'Software Engineer', company: 'Tech Corp', location: 'Remote', salary: '$100k', type: 'full-time' },
    { id: 2, title: 'UI Designer', company: 'Creative Studio', location: 'New York', salary: '$85k', type: 'part-time' },
    { id: 3, title: 'Backend Developer', company: 'DataFlow', location: 'San Francisco', salary: '$120k', type: 'full-time' },
];

function Home({role}) {
    const [jobs] = useState(initialJobs);
    { /* For now lets suppose its the 'applicant' role, we will change it later based on the user role*/ }

  return (
  
    
    <div className="home-container">
      <h1>Find your next job</h1>
      <p>Search from thousands of job listings.</p>

      
      <div className="card-list">
      {jobs.map((job) => (
      <JobCard key={job.id} job={job} />
    ))}    
</div>
    </div>
  );

}


export default Home;