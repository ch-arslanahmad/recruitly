import jwt from 'jsonwebtoken';


function authMiddleware(req, res, next) {

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });


    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' }); // if invalid token then error
        req.user = decoded; // attach user info to req.user
        next(); //  proceed to the next middleware or route handler
    });
}

function requireRole(role) {
    // because middle ware requireRole is a function that returns a middleware function
    // we can use it like this:
    // app.get('/admin', authMiddleware, requireRole('admin'), (req, res) => { ... });
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Forbidden: Access Denied.' });
        }
        next();
    };
}


export { authMiddleware, requireRole };