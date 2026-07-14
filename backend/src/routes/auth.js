import { Router } from 'express'; // map functions to endpoints
import jwt from 'jsonwebtoken'; // for generating, handling JWT tokens
import User from '../classes/User.js';
import bcrypt from 'bcryptjs'; // for hashing passwords

const router = Router();

const SECRET = process.env.JWT_SECRET || 'dev-fallback-secret';

function register(req, res) {

  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10);

    User.create(req.body.name, req.body.username, req.body.password, req.body.role, req.body.company);

    res.status(201).json({ message: 'User created' });

  } catch (error) {
    res.status(500).json({ message: 'Error creating user: ', error: error.message });
  }

}

function login(req, res) {

  try {
    const oldUser = User.findByUsername(req.body.username);

    if (!oldUser) {
      return res.status(401).json({ message: "Invalid username" });
    }

    if (!bcrypt.compareSync(req.body.password, oldUser.password)) {
      return res.status(401).json({ message: "Invalid password" });
    }


    // currently does not check for role, but we can add that later if needed
    const token = jwt.sign({ id: oldUser.id, role: oldUser.role }, SECRET);

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in: ', error: error.message });
  }
}

router.post('/register', register);
router.post('/login', login);

export default router; // export the router so it can be used in the main app.js file
