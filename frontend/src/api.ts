// This holds all the API calls to the backend.
// For separation of concerns, we keep them in one separate file.

const token = () => localStorage.getItem("recruitly_token");
const authHeaders = () => ({ Authorization: `Bearer ${token()}` });

export const api = {
    auth: {
        login: (data: Record<string, unknown>) =>
            fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }).then((r) => {
                if (!r.ok) throw { status: r.status, message: "Login failed" };
                return r.json();
            }),

        register: (data: Record<string, unknown>) =>
            fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }).then((r) => {
                if (!r.ok) throw { status: r.status, message: "Registration failed" };
                return r.json();
            }),
    },

    jobs: {
        getAll: () =>
            fetch("/api/jobs").then((r) => {
                if (!r.ok) throw { status: r.status, message: "Failed to fetch jobs" };
                return r.json();
            }),

        get: (id: string) =>
            fetch(`/api/jobs/${id}`, { headers: authHeaders() }).then((r) => {
                if (!r.ok)
                    throw { status: r.status, message: "Failed to fetch job" };
                return r.json();
            }),
    },

    applications: {
        getJob: (jobId: number) =>
            fetch(`/api/jobs/${jobId}`).then((r) => {
                if (!r.ok) throw { status: r.status, message: "Failed to fetch job" };
                return r.json();
            }),
    },

    saved: {
        check: (id: string) =>
            fetch(`/api/saved-jobs/check/${id}`, {
                headers: authHeaders(),
            }).then((r) => {
                if (!r.ok) throw { status: r.status, message: "Failed to check saved job" };
                return r.json();
            }),

        toggle: async (jobId: number, isSaved: boolean) => {
            const method = isSaved ? "DELETE" : "POST";
            const url = isSaved
                ? `/api/saved-jobs/${jobId}`
                : "/api/saved-jobs";

            return fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders(),
                },
                body:
                    method === "POST"
                        ? JSON.stringify({ job_id: jobId })
                        : undefined,
            }).then((r) => {
                if (!r.ok) throw { status: r.status, message: "Failed to toggle save" };
            });
        },
    },
};
