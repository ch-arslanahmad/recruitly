import { useState } from "react";

class User {
    constructor(name, username, password, role, company) {
        this.name = name;
        this.username = username;
        this.password = password;
        this.role = role;
        this.company = company || null;
    }
}

let users = [
    new User("John Doe", "johndoe", "password123", "recruiter", "Tech Corp"),
    new User("Jane Smith", "janesmith", "securepass", "applicant", null),
];

// recruitly_session, tells if a user is logged in
// recruitly_users, stores all users in the system

function addUser(user) {
    users.push(user);
    localStorage.setItem("recruitly_session", JSON.stringify({ username: user.username, role: user.role }));
    localStorage.setItem("recruitly_users", JSON.stringify(users));
}

function AuthModel({ onDone }) {
    const stored = localStorage.getItem("recruitly_users");
    if (stored) users = JSON.parse(stored);

    const [activeRole, setActiveRole] = useState("applicant");
    const [mode, setMode] = useState("signup");
    const [errors, setErrors] = useState({});

    function validate(data) {
        let e = {};

        if (!data.username) e.username = "Username is required";
        if (!data.password) e.password = "Password is required";

        if (mode === "signup") {
            if (users.find((u) => u.username === data.username)) {
                e.username = "Username is already taken";
            }

            if (!data.name) e.name = "Name is required";

            if ((data.username?.length ?? 0) < 3)
                e.username = "Username must be at least 3 characters";
            if ((data.password?.length ?? 0) < 6)
                e.password = "Password must be at least 6 characters";
            if (data.password !== data.confirmPassword)
                e.confirmPassword = "Passwords don't match";
            if (activeRole === "recruiter" && !data.company)
                e.company = "Company is required for recruiters";
        }

        if (mode === "login") {
            const user = users.find((u) => u.username === data.username);
            if (!user) {
                e.username = "User not found";
            } else if (user.password !== data.password) {
                e.password = "Incorrect password";
            }
        }

        return e;
    }

    function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        const validationErrors = validate(data);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return; // Stop submission if there are validation errors

        if (mode === "signup") {
            addUser(
                new User(
                    data.name.trim(),
                    data.username.trim(),
                    data.password.trim(),
                    activeRole,
                    activeRole === "recruiter" ? data.company?.trim() : null
                ) // add to users array (localStorage)
            );
            onDone(data.username, activeRole);
        } else {
            const user = users.find((u) => u.username === data.username);
            localStorage.setItem("recruitly_session", JSON.stringify({ username: user.username, role: user.role }));
            onDone(user.username, user.role);
        }
    }

    return (
        <div className="auth-container">
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

    

                <form onSubmit={handleSubmit}>
                    {mode === "signup" && (
                        <>
                            <input name="name" placeholder="Name" required />
                            {errors.name && <p className="field-error">{errors.name}</p>}
                        </>
                    )}

                    <input name="username" placeholder="Username" required />
                    {errors.username && <p className="field-error">{errors.username}</p>}

                    <input name="password" type="password" placeholder="Password" required />
                    {errors.password && <p className="field-error">{errors.password}</p>}

                    {mode === "signup" && (
                        <>
                            <input name="confirmPassword" type="password" placeholder="Confirm Password" required />
                            {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
                        </>
                    )}

                    {mode === "signup" && activeRole === "recruiter" && (
                        <>
                            <input name="company" placeholder="Company" required />
                            {errors.company && <p className="field-error">{errors.company}</p>}
                        </>
                    )}

                    <button type="submit">
                        {mode === "signup" ? "Sign Up" : "Log In"}
                    </button>
                </form>
            <div>

                        <button
                        className=                {mode === "signup" ? "active" : "login active"}
                        type="button"
                        onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setErrors({}); }}
                    >
                  {mode === "signup"                                          
                      ? "Already have an account? Log In"                     
                        : "Don't have an account? Sign Up"}
                </button>

                </div>
        </div>
    );
}

export default AuthModel;
