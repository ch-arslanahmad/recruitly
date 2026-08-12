import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applications.js';
import savedJobRoutes from './routes/savedJobs.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Allow the frontend to talk to this backend (cross-origin requests)
app.use(express.json()); // Parse incoming JSON data so we can use it as a JS object (req.body)

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRoutes); // Use the auth routes for /api/auth endpoints
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/saved-jobs', savedJobRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});