import JobBoard from "../components/JobBoard";

function Home() {
  return (
    <JobBoard
      mode="all"
      page_title="Find your next job"
      page_description="Search from thousands of job listings."
    />
  );
}

export default Home;
