import { Router, Response } from "express";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { AuthRequest } from "../types/express.js";
import Application from "../classes/Application.js";

const router = Router();

function apply(req: AuthRequest, res: Response) {
    try {
        let user_id: number | undefined = req.user?.id;

        if (!user_id) {
            return res
                .status(400)
                .json({ message: "Unauthorized, ID required" });
        }

        Application.create({
            job_id: req.body.job_id,
            candidate_id: user_id,
        });
        res.status(201).json({ message: "Application submitted successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Error applying: ",
            error: (error as Error).message,
        });
    }
}

function myApplications(req: AuthRequest, res: Response) {
    try {
        let user_id: number | undefined = req.user?.id;

        if (!user_id) {
            return res
                .status(400)
                .json({ message: "Unauthorized, ID required" });
        }

        const applications = Application.findByCandidate(user_id);

        res.json(applications);
    } catch (error) {
        res.status(500).json({
            message: "Error listing: ",
            error: (error as Error).message,
        });
    }
}

// @route   GET /applications/job/:id, get all applications for a specific job
function jobApplications(req: AuthRequest, res: Response) {
    try {
        const id = Number(req.params.id);
        const applications = Application.findByJob(id);
        res.json(applications);
    } catch (error) {
        res.status(500).json({
            message: "Error listing: ",
            error: (error as Error).message,
        });
    }
}

// @route   PUT /applications/:id, update the status of an application
function updateStatus(req: AuthRequest, res: Response) {
    try {
        const id = Number(req.params.id);
        const status = req.body.status;
        Application.updateStatus(id, status);
        res.status(200).json({
            message: "Application status updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating: ",
            error: (error as Error).message,
        });
    }
}

router.post("/", authMiddleware, requireRole("applicant"), apply);
router.get("/my", authMiddleware, requireRole("applicant"), myApplications);
router.get(
    "/job/:id",
    authMiddleware,
    requireRole("recruiter"),
    jobApplications,
);
router.put("/:id", authMiddleware, requireRole("recruiter"), updateStatus);

export default router;
