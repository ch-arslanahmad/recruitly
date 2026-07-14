import { Router } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import Application from '../classes/Application.js';

const router = Router();

function apply(req, res) {
  try {

    Application.create(req.body.job_id, req.user.id);
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error applying: ', error: error.message });
  }
}

function myApplications(req, res) {
  try {
    const applications = Application.findByCandidate(req.user.id);

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error listing: ', error: error.message });
  }
}

// @route   GET /applications/job/:id, get all applications for a specific job
function jobApplications(req, res) {
  try {
    const id = req.params.id;
    const applications = Application.findByJob(id);
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error listing: ', error: error.message });
  }
}

// @route   PUT /applications/:id, update the status of an application
function updateStatus(req, res) {
  try {
    const id = req.params.id;
    const status = req.body.status;
    Application.updateStatus(id, status);
    res.status(200).json({ message: 'Application status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating: ', error: error.message });
  }
}


router.post('/', authMiddleware, requireRole('applicant'), apply);
router.get('/my', authMiddleware, requireRole('applicant'), myApplications);
router.get('/job/:id', authMiddleware, requireRole('recruiter'), jobApplications);
router.put('/:id', authMiddleware, requireRole('recruiter'), updateStatus);

export default router;
