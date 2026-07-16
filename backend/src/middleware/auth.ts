import { Request, Response, NextFunction } from "express";
import type { AuthRequest } from "../types/express.js";
import jwt from "jsonwebtoken";

function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(
        token,
        process.env.JWT_SECRET || "dev-fallback-secret",
        (err, decoded) => {
            if (err) return res.status(401).json({ message: "Invalid token" }); // if invalid token then error
            req.user = decoded as { id: number; name: string; role: string; company?: string }; // attach user info to req.user
            next(); //  proceed to the next middleware or route handler
        },
    );
}

function requireRole(role: string) {
    // because middle ware requireRole is a function that returns a middleware function
    // we can use it like this:
    // app.get('/admin', authMiddleware, requireRole('admin'), (req, res) => { ... });
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (req.user?.role !== role) {
            return res
                .status(403)
                .json({ message: "Forbidden: Access Denied." });
        }
        next();
    };
}

export { authMiddleware, requireRole };
