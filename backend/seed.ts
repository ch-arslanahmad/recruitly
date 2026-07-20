import bcrypt from 'bcryptjs';
import db from './src/db/database.js';

const hash = (pw) => bcrypt.hashSync(pw, 10);

db.exec('DELETE FROM saved_jobs');
db.exec('DELETE FROM application');
db.exec('DELETE FROM job');
db.exec('DELETE FROM user');

db.prepare('INSERT INTO user (name, username, password, role, company) VALUES (?, ?, ?, ?, ?)').run('Ali Hassan', 'ali_h', hash('password123'), 'recruiter', 'Google');
db.prepare('INSERT INTO user (name, username, password, role, company) VALUES (?, ?, ?, ?, ?)').run('Sara Khan', 'sara_k', hash('password123'), 'recruiter', 'Microsoft');
db.prepare('INSERT INTO user (name, username, password, role, company) VALUES (?, ?, ?, ?, ?)').run('Ahmed Raza', 'ahmed_r', hash('password123'), 'applicant', null);
db.prepare('INSERT INTO user (name, username, password, role, company) VALUES (?, ?, ?, ?, ?)').run('Fatima Noor', 'fatima_n', hash('password123'), 'applicant', null);

db.prepare('INSERT INTO job (recruiter_id, title, about_role, requirements, responsibilities, location, salary, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(1, 'Software Engineer', 'Build scalable backend services using Node.js and Python.', '3+ years Node.js, experience with REST APIs, knowledge of SQL databases', 'Design and implement backend APIs, optimize database queries, collaborate with frontend team on integrations', 'Lahore', 150000, 'full-time');
db.prepare('INSERT INTO job (recruiter_id, title, about_role, requirements, responsibilities, location, salary, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(1, 'Frontend Developer', 'Create beautiful React UIs with Tailwind CSS.', '2+ years React, TypeScript, CSS/Tailwind, responsive design', 'Build reusable UI components, ensure cross-browser compatibility, optimize page performance', 'Remote', 120000, 'remote');
db.prepare('INSERT INTO job (recruiter_id, title, about_role, requirements, responsibilities, location, salary, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(2, 'Data Scientist', 'Analyze large datasets and build ML models.', 'Python, TensorFlow/PyTorch, SQL, statistics background', 'Develop predictive models, clean and preprocess data, present insights to stakeholders', 'Karachi', 180000, 'full-time');
db.prepare('INSERT INTO job (recruiter_id, title, about_role, requirements, responsibilities, location, salary, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(2, 'DevOps Engineer', 'Manage cloud infrastructure on Azure.', 'Azure/AWS experience, Docker, CI/CD pipelines, Linux administration', 'Set up and maintain cloud infrastructure, automate deployments, monitor system health', 'Islamabad', 160000, 'contract');
db.prepare('INSERT INTO job (recruiter_id, title, about_role, requirements, responsibilities, location, salary, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(1, 'Intern - Web Development', 'Learn web development with experienced mentors.', 'Basic HTML/CSS/JS knowledge, eagerness to learn, currently enrolled in CS or related program', 'Assist with frontend tasks, write documentation, shadow senior developers on projects', 'Lahore', 30000, 'part-time');

db.prepare('INSERT INTO application (job_id, candidate_id, status) VALUES (?, ?, ?)').run(1, 3, 'applied');
db.prepare('INSERT INTO application (job_id, candidate_id, status) VALUES (?, ?, ?)').run(3, 3, 'applied');
db.prepare('INSERT INTO application (job_id, candidate_id, status) VALUES (?, ?, ?)').run(1, 4, 'applied');
db.prepare('INSERT INTO application (job_id, candidate_id, status) VALUES (?, ?, ?)').run(2, 4, 'applied');
db.prepare('INSERT INTO application (job_id, candidate_id, status) VALUES (?, ?, ?)').run(4, 4, 'applied');

db.prepare('INSERT INTO saved_jobs (user_id, job_id) VALUES (?, ?)').run(3, 2);
db.prepare('INSERT INTO saved_jobs (user_id, job_id) VALUES (?, ?)').run(4, 3);

console.log('Seed complete!');
