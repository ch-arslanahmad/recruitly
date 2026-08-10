// This holds all the API calls to the backend.
// For separation of concerns, we keep them in one separate file.

import { Job, JobApplicant, ApplicationWithJob } from "./types";

const token = () => localStorage.getItem("recruitly_token");
const authHeaders = () => ({ Authorization: `Bearer ${token()}` });

export const api = {
  auth: {
    login: (data: Record<string, unknown>) =>
      fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(async (r) => {
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          throw {
            status: r.status,
            message: body.message || "Login failed",
          };
        }
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

    get: (id: number) =>
      fetch(`/api/jobs/${id}`, { headers: authHeaders() }).then((r) => {
        if (!r.ok) throw { status: r.status, message: "Failed to fetch job" };
        return r.json();
      }),

    saved: {
      getAll: () =>
        fetch("/api/saved-jobs", { headers: authHeaders() }).then((r) => {
          if (!r.ok)
            throw {
              status: r.status,
              message: "Failed to fetch saved jobs",
            };
          return r.json();
        }),

      check: (id: number) =>
        fetch(`/api/saved-jobs/check/${id}`, {
          headers: authHeaders(),
        }).then((r) => {
          if (!r.ok)
            throw {
              status: r.status,
              message: "Failed to check saved job",
            };
          return r.json();
        }),

      toggle: async (jobId: number, isSaved: boolean) => {
        const method = isSaved ? "DELETE" : "POST";
        const url = isSaved ? `/api/saved-jobs/${jobId}` : "/api/saved-jobs";

        return fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
          },
          body:
            method === "POST" ? JSON.stringify({ job_id: jobId }) : undefined,
        }).then((r) => {
          if (!r.ok)
            throw {
              status: r.status,
              message: "Failed to toggle save",
            };
        });
      },
    },
  },

  saved: {
    getAll: () =>
      fetch("/api/saved-jobs", { headers: authHeaders() }).then((r) => {
        if (!r.ok)
          throw {
            status: r.status,
            message: "Failed to fetch saved jobs",
          };
        return r.json();
      }),
  },

  recruiter: {
    job: {
      create: (data: Record<string, unknown>) => {
        console.log("Sending:", data);
        return fetch("/api/jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
          },
          body: JSON.stringify(data),
        })
          .then((r) => {
            console.log("Status:", r.status);
            if (!r.ok)
              throw {
                status: r.status,
                message: "Failed to create job",
              };
            return r.json();
          })
          .then((res) => {
            console.log("Response:", res);
            return res;
          });
      },
      getMy: async () => {
        return fetch(`/api/jobs/my`, { headers: authHeaders() }).then((r) => {
          if (!r.ok)
            throw {
              status: r.status,
              message: "Failed to fetch my jobs.. ",
            };
          return r.json();
        });
      },
      update: async (id: number, data: Partial<Job>) => {
        return fetch(`/api/jobs/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
          },
          body: JSON.stringify(data),
        }).then((r) => {
          if (!r.ok)
            throw {
              status: r.status,
              message: "Failed to update job status",
            };
          return r.json();
        });
      },
      remove: async (id: number) => {
        return fetch(`/api/jobs/${id}`, {
          method: "DELETE",
          headers: authHeaders(),
        }).then((r) => {
          if (!r.ok)
            throw {
              status: r.status,
              message: "Failed to delete job",
            };
          return r.json();
        });
      },
      stats: () =>
        fetch(`/api/jobs/stats`, {
          headers: authHeaders(),
        }).then((r) => {
          if (!r.ok)
            throw {
              status: r.status,
              message: "Failed to fetch job stats",
            };
          return r.json();
        }),
    },
  },
  applications: {
    my: (): Promise<ApplicationWithJob[]> =>
      fetch("/api/applications/my", { headers: authHeaders() }).then((r) => {
        if (!r.ok)
          throw {
            status: r.status,
            message: "Failed to fetch applications",
          };
        return r.json();
      }),

    apply: (jobId: number) =>
      fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({ job_id: jobId }),
      }).then((r) => {
        if (!r.ok)
          throw {
            status: r.status,
            message: "Failed to apply",
          };
        return r.json();
      }),
    getByJob: (jobId: number) =>
      fetch(`/api/applications/job/${jobId}`, {
        headers: authHeaders(),
      }).then((r) => {
        if (!r.ok)
          throw {
            status: r.status,
            message: "Failed to fetch applications",
          };
        return r.json();
      }),
    updateStatus: (applicationId: number, statusName: string) =>
      fetch(`/api/applications/${applicationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({ status: statusName }),
      }).then((r) => {
        if (!r.ok)
          throw {
            status: r.status,
            message: "Failed to update application status",
          };
        return r.json();
      }),
  },
};
