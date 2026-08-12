import { NavLink } from "react-router-dom";
import { User } from "../types";

const activeClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "active" : "";

function NavBar({ user, onLogout }: { user?: User; onLogout?: () => void }) {
  return (
    <nav>
      <h1>Recruitly</h1>
      <ul className="nav-links">
        {user ? (
          user.role === "applicant" ? (
            <>
              <li>
                <NavLink to="/" end className={activeClass}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/jobs" className={activeClass}>
                  Jobs
                </NavLink>
              </li>
              <li>
                <NavLink to="/applications" className={activeClass}>
                  Applications
                </NavLink>
              </li>
              <li>
                <NavLink to="/saved-jobs" className={activeClass}>
                  Saved Jobs
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/" end className={activeClass}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/my-jobs" className={activeClass}>
                  My Jobs
                </NavLink>
              </li>
              <li>
                <NavLink to="/applicants" className={activeClass}>
                  Applicants
                </NavLink>
              </li>
            </>
          )
        ) : (
          <li>
            <NavLink to="/login" className={activeClass}>
              Sign In
            </NavLink>
          </li>
        )}
        {user && (
          <li className="logout">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onLogout?.();
              }}
            >
              Logout
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
