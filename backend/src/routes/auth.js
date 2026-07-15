import { Router } from 'express'; // map functions to endpoints
import jwt from 'jsonwebtoken'; // for generating, handling JWT tokens
import User from '../classes/User.js';
import bcrypt from 'bcryptjs'; // for hashing passwords

const router = Router();

const SECRET = process.env.JWT_SECRET || 'dev-fallback-secret';

// for new user
function register(req, res) {

  try {
    const existing = User.findByUsername(req.body.username);
    if (existing) {
      return res.status(401).json({ message: "Username already taken" });
    }

    req.body.password = bcrypt.hashSync(req.body.password, 10); // hash the password

    const newUser = new User(null, req.body.name, req.body.username, req.body.password, req.body.role, req.body.company);


    const result = User.create(newUser); // create the user in the database

    newUser.id = result.lastInsertRowid;

    let payload = { id: newUser.id, name: newUser.name, role: newUser.role };
    if (newUser.role === 'recruiter') payload.company = newUser.company;

    const JWTtoken = jwt.sign(payload, SECRET); // generate JWT token (contains token + data)

    // the token contains (token + data)
    res.status(201).json({ token: JWTtoken, user: payload }); // response with the token for the new user

  } catch (error) {
    res.status(500).json({ message: 'Error creating user: ', error: String(error) });
  }

}


// for old user
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


    let payload = { id: oldUser.id, name: oldUser.name, role: oldUser.role };

    if (oldUser.role == "recruiter") payload.company = oldUser.company;
    // if the user is a recruiter, include the company in the token payload


    const JWTtoken = jwt.sign(payload, SECRET);

    res.status(201).json({ token: JWTtoken, user: payload }); // response with the token for the logged in user

  } catch (error) {
    res.status(500).json({ message: 'Error logging in: ', error: error.message });
  }
}

router.post('/register', register);
router.post('/login', login);

export default router; // export the router so it can be used in the main app.js file
