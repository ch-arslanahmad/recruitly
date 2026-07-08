import { useState } from "react";
// This component acts as a model that appears for login/signup for recruiter/job-seeker

function AuthModel({ isOpen, onClose }) {
    const [activeRole, setActiveRole] = useState("recruiter");
    const [mode, setMode] = useState("signup");

    if (!isOpen) return null;

    function showForm() {
        return (
            <form>
                {mode === "signup" && (
                    <label htmlFor="name">
                        Name
                        <input type="text" id="name" name="name" />
                    </label>
                )}
                <label htmlFor="username">
                    Username
                    <input type="text" id="username" name="username" />
                </label>
                <label htmlFor="password">
                    Password
                    <input type="password" id="password" name="password" />
                </label>
                {activeRole === "recruiter" && (
                    <label htmlFor="company">
                        Company
                        <input type="text" id="company" name="company" />
                    </label>
                )}
                <button type="submit">
                    {mode === "signup" ? "Sign Up" : "Log In"}
                </button>
            </form>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>
            <p>You are:</p>
            <button
                className={activeRole === "recruiter" ? "active" : ""}
                type="button"
                onClick={() => setActiveRole("recruiter")}
            >
                Recruiter
            </button>
            <button
                className={activeRole === "applicant" ? "active" : ""}
                type="button"
                onClick={() => setActiveRole("applicant")}
            >
                Applicant
            </button>
            <div>
                <button
                    className={mode === "signup" ? "active" : ""}
                    type="button"
                    onClick={() => setMode("signup")}
                >
                    Sign Up
                </button>
                <button
                    className={mode === "login" ? "active" : ""}
                    type="button"
                    onClick={() => setMode("login")}
                >
                    Log In
                </button>
            </div>
            {showForm()}
            </div>
        </div>
    );
}

export default AuthModel;
