import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import User from '../classes/User.js';
import type { AuthRequest } from '../types/express.js';

const router = Router();

function listSaved(req: AuthRequest, res: Response) {
    try {
        const savedJobs = User.getSavedJobs(req.user!.id);
        res.json(savedJobs);
    } catch (error) {
        res.status(500).json({ message: 'Error listing saved jobs: ', error: (error as Error).message });
    }
}

function saveJob(req: AuthRequest, res: Response) {
    try {
        const job_id = Number(req.body.job_id);
        User.saveJob(req.user!.id, job_id);
        res.status(201).json({ message: 'Job saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving job: ', error: (error as Error).message });
    }
}

function unsaveJob(req: AuthRequest, res: Response) {
    try {
        const jobId = Number(req.params.jobId);
        User.unsaveJob(req.user!.id, jobId);
        res.status(200).json({ message: 'Job unsaved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing saved job: ', error: (error as Error).message });
    }
}

router.get('/', authMiddleware, listSaved);
router.post('/', authMiddleware, saveJob);
router.delete('/:jobId', authMiddleware, unsaveJob);

export default router;
