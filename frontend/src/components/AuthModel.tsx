import { useState } from "react";

function AuthModel({ onAuth }) {
    const [activeRole, setActiveRole] = useState("applicant");
    const [mode, setMode] = useState("register");
    const [errors, setErrors] = useState({});

    function validate(data) {
        let e = {};

        if (!data.username) e.username = "Username is required";
        if (!data.password) e.password = "Password is required";

        if (mode === "register") {
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

        return e;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const user_data = Object.fromEntries(formData.entries());

        const validationErrors = validate(user_data);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;


        try {
            const response = await fetch(`/api/auth/${mode}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...user_data, role: activeRole }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors({ general: data.message || "An error occurred. Please try again." });
                return;
            }

            const { token, user } = data;

            onAuth(token, user); // pass the user object to the parent component

        } catch (error) {
            console.error("Error during authentication:", error);
            setErrors({ general: "An error occurred. Please try again." });
        }

    }

    return (
        <div className="auth-container">

            {mode === "register" ? <h2 className="auth-title">Create Account</h2> : <h2 className="auth-title">Welcome Back</h2>}

            {mode === "register" && <>
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
            </>
            }

            <form onSubmit={handleSubmit}>
                {mode === "register" && (
                    <>
                        <input name="name" placeholder="Name" required />
                        {errors.name && <p className="field-error">{errors.name}</p>}
                    </>
                )}

                <input name="username" placeholder="Username" required />
                {errors.username && <p className="field-error">{errors.username}</p>}

                <input name="password" type="password" placeholder="Password" required />
                {errors.password && <p className="field-error">{errors.password}</p>}

                {mode === "register" && (
                    <>
                        <input name="confirmPassword" type="password" placeholder="Confirm Password" required />
                        {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
                    </>
                )}

                {mode === "register" && activeRole === "recruiter" && (
                    <>
                        <input name="company" placeholder="Company" required />
                        {errors.company && <p className="field-error">{errors.company}</p>}
                    </>
                )}

                {errors.general && <p className="field-error">{errors.general}</p>}

                <button type="submit">
                    {mode === "register" ? "Sign Up" : "Login"}
                </button>
            </form>
            <div>

                <button
                    className={mode === "register" ? "active" : "login active"}
                    type="button"
                    onClick={() => { setMode(mode === "register" ? "login" : "register"); setErrors({}); }}
                >
                    {mode === "register"
                        ? "Already have an account? Log In"
                        : "Don't have an account? Sign Up"}
                </button>

            </div>
        </div>
    );
}

export default AuthModel;
