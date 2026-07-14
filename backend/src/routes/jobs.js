import { Router } from 'express'; // deploy functions to endpoints
import Job from '../classes/Job.js';
import { authMiddleware, requireRole } from '../middleware/auth.js'; // for authentication and role-based access control


const router = Router();

// list
function list(req, res) {
    try {
        const jobs = Job.findAll();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Error listing jobs: ', error: error.message });
    }
}


// create
function create(req, res) {
    try {
        const { title, description, company } = req.body;
        const newJob = Job.create(title, description, company);
        res.status(201).json(newJob);
    } catch (error) {
        res.status(500).json({ message: 'Error creating job: ', error: error.message });
    }
}


// update
function update(req, res) {
    try {
        const { id } = req.params;
        const { title, description, company } = req.body;
        const updatedJob = Job.update(id, title, description, company);
        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: 'Error updating job: ', error: error.message });
    }
}

// delete
function deleteJob(req, res) {
    try {
        const { id } = req.params;
        Job.delete(id);
        res.json({ message: 'Job deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting job: ', error: error.message });
    }
}


router.get('/', list);
router.get('/my', authMiddleware, requireRole('recruiter'), listMyJobs);
router.get('/:id', findById);
router.post('/', authMiddleware, requireRole('recruiter'), create);
router.put('/:id', authMiddleware, requireRole('recruiter'), update);
router.delete('/:id', authMiddleware, requireRole('recruiter'), deleteJob);

function listMyJobs(req, res) {
    try {
        const jobs = Job.findByRecruiter(req.user.id);
        res.status(200).json({ message: 'Jobs retrieved successfully', jobs });

    } catch (error) {
        res.status(500).json({ message: 'Error listing jobs: ', error: error.message });
    }
}

function findById(req, res) {
    try {
        const id = req.params.id;
        const job = Job.findById(id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json({ message: 'Job retrieved successfully', job });
    } catch (error) {
        res.status(500).json({ message: 'Error finding job: ', error: error.message });
    }
}

export default router;