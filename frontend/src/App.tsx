import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import NavBar from "./components/NavBar";
import ErrorPage from "./pages/ErrorPage";
import JobDetail from "./pages/JobDetail";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import JobListing from "./pages/JobListing";
import Application from "./pages/Application";

import { User } from "./types"; // import only User class

import "./App.css";

function App() {
    const [user, setUser] = useState<User | undefined>(() => {
        const raw = localStorage.getItem("recruitly_user");
        return raw ? (JSON.parse(raw) as User) : undefined;
    });

    function onLogout() {
        localStorage.clear();
        setUser(undefined);
    }

    return (
        <BrowserRouter>
            <NavBar user={user} onLogout={onLogout} />
            <Routes>
                {/* Not found if route not defined */}
                <Route
                    path="/jobs/:id"
                    element={
                        user ? (
                            <JobDetail />
                        ) : (
                            <ErrorPage
                                errorCode={403}
                                errorMessage="You are not authorized to access this page."
                            />
                        )
                    }
                />

                <Route
                    path="/login"
                    element={
                        user ? <Navigate to="/" /> : <Login setUser={setUser} />
                    }
                />
                <Route
                    path="/"
                    element={
                        user?.role ? (
                            user?.role == "applicant" ?
                                <Home role={user.role} /> : <Dashboard user={user} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/jobs"
                    element={
                        user?.role === "applicant" ? (
                            <JobListing mode="all" />
                        ) : (
                            <ErrorPage
                                errorCode={403}
                                errorMessage="You are not authorized to access this page."
                            />
                        )
                    }
                />
                <Route
                    path="/saved-jobs"
                    element={
                        user?.role === "applicant" ? (
                            <JobListing mode="saved" />
                        ) : (
                            <ErrorPage
                                errorCode={403}
                                errorMessage="You are not authorized to access this page."
                            />
                        )
                    }
                />
                <Route
                    path="/applications"
                    element={
                        user?.role === "applicant" ? (
                            <Application />
                        ) : (
                            <ErrorPage
                                errorCode={403}
                                errorMessage="You are not authorized to access this page."
                            />
                        )
                    }
                />
                {/*<Route path="/job/:id/apply" element={<Application />} />
                <Route path="/application" element={<Application />} />*/}
                <Route
                    path="*"
                    element={
                        <ErrorPage
                            errorCode={404}
                            errorMessage="Page Not Found"
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
