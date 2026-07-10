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
                {user && <li><span>Hi, {user.username}</span></li>}
            </ul>
        </nav>
    );
}

export default NavBar;
