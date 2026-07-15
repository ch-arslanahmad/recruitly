import { Link } from 'react-router-dom';

function NavBar({ user }) {
    return (
        <nav>
            <h1>Recruitly</h1>
            <ul className="nav-links">
                {user ? (
                    user.role === 'applicant' ? (
                        <>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/jobs">Jobs</Link></li>
                            <li><Link to="/applications">Applications</Link></li>
                            <li><Link to="/saved-jobs">Saved Jobs</Link></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/my-jobs">My Jobs</Link></li>
                            <li><Link to="/post-job">Post a Job</Link></li>
                            <li><Link to="/applicants">Applicants</Link></li>
                        </>
                    )
                ) : (
                    <li><Link to="/login">Sign In</Link></li>
                )}
                {user && <li className="logout" ><a href="#" onClick={() => {
                    localStorage.removeItem("recruitly_user"); // remove item from local storage
                    window.location.href = "/"; // move to home page
                }}>Logout</a></li>}
            </ul>
        </nav>
    );
}

export default NavBar;
