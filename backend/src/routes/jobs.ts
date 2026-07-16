import { Router, Request, Response } from 'express';
import Job from '../classes/Job.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import type { AuthRequest } from '../types/express.js';

const router = Router();

function list(req: Request, res: Response) {
    try {
        const jobs = Job.findAll();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Error listing jobs: ', error: (error as Error).message });
    }
}

function create(req: AuthRequest, res: Response) {
    try {
        const { title, description, location, salary, type } = req.body;
        Job.create({ recruiter_id: req.user!.id, title, description, location, salary, type });
        res.status(201).json({ message: 'Job created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating job: ', error: (error as Error).message });
    }
}

function update(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const { title, description, location, salary, type } = req.body;
        Job.update(id, { title, description, location, salary, type });
        res.json({ message: 'Job updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating job: ', error: (error as Error).message });
    }
}

function deleteJob(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        Job.delete(id);
        res.json({ message: 'Job deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting job: ', error: (error as Error).message });
    }
}

function listMyJobs(req: AuthRequest, res: Response) {
    try {
        const jobs = Job.findByRecruiter(req.user!.id);
        res.status(200).json({ message: 'Jobs retrieved successfully', jobs });
    } catch (error) {
        res.status(500).json({ message: 'Error listing jobs: ', error: (error as Error).message });
    }
}

function findById(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const job = Job.findById(id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json({ message: 'Job retrieved successfully', job });
    } catch (error) {
        res.status(500).json({ message: 'Error finding job: ', error: (error as Error).message });
    }
}

router.get('/', list);
router.get('/my', authMiddleware, requireRole('recruiter'), listMyJobs);
router.get('/:id', findById);
router.post('/', authMiddleware, requireRole('recruiter'), create);
router.put('/:id', authMiddleware, requireRole('recruiter'), update);
router.delete('/:id', authMiddleware, requireRole('recruiter'), deleteJob);

export default router;
