import { useEffect, useState } from 'react'
import JobCard from '../components/JobCard'
import JobBoard from '../components/JobBoard'

function Home() {

  const [jobs, setJobs] = useState([]);

  // Fetch jobs from the backend API when the component mounts
  useEffect(() => {
    fetch('/api/jobs')
      .then(response => response.json())
      .then(data => setJobs(data))
      .catch(error => console.error('Error fetching jobs:', error));
  }, []);


  return (
    <>
      <JobBoard jobs={jobs} />
    </>
  );

}


export default Home;
