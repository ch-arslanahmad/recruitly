import { Router, Request, Response } from "express";
import Job from "../classes/Job.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import type { AuthRequest } from "../types/express.js";

const router = Router();

function list(req: Request, res: Response) {
    try {
        const jobs = Job.findAll();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({
            message: "Failed to list jobs  -  check server logs",
        });
    }
}

function create(req: AuthRequest, res: Response) {
    try {
        const {
            title,
            about_role,
            location,
            salary,
            type,
            requirements,
            responsibilities,
        } = req.body;
        Job.create({
            recruiter_id: req.user!.id,
            title,
            about_role,
            location,
            salary,
            type,
            requirements,
            responsibilities,
        });
        res.status(201).json({ message: "Job created successfully" });
    } catch (error) {
        console.error("Create job error:", error);
        res.status(500).json({
            message: "Failed to create job  -  check server logs",
        });
    }
}

function update(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const {
            title,
            about_role,
            location,
            salary,
            type,
            requirements,
            responsibilities,
            status,
        } = req.body;
        Job.update(id, {
            title,
            about_role,
            location,
            salary,
            type,
            requirements,
            responsibilities,
            status,
        });
        res.json({ message: "Job updated successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update job  -  check server logs",
        });
    }
}

function deleteJob(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        Job.delete(id);
        res.json({ message: "Job deleted" });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete job  -  check server logs",
        });
    }
}

// for recruiters to list their own jobs
function listMyJobs(req: AuthRequest, res: Response) {
    try {
        const jobs = Job.findByRecruiter(req.user!.id);
        res.status(200).json({ message: "Jobs retrieved successfully", jobs });
    } catch (error) {
        res.status(500).json({
            message: "Failed to list jobs  -  check server logs",
        });
    }
}

// find job by id
function findById(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const job = Job.findById(id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.status(200).json({ message: "Job retrieved successfully", job });
    } catch (error) {
        res.status(500).json({
            message: "Failed to find job  -  check server logs",
        });
    }
}

function getStats(req: AuthRequest, res: Response) {
    try {
        const stats = Job.stats(req.user!.id);
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get stats",
        });
    }
}

router.get("/", list);
router.get("/my", authMiddleware, requireRole("recruiter"), listMyJobs);
router.get("/stats", authMiddleware, requireRole("recruiter"), getStats);
router.get("/:id", findById);
router.post("/", authMiddleware, requireRole("recruiter"), create);
router.put("/:id", authMiddleware, requireRole("recruiter"), update);
router.delete("/:id", authMiddleware, requireRole("recruiter"), deleteJob);

export default router;
