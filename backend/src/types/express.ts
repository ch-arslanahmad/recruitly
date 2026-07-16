import { Request } from 'express';

export interface AuthRequest extends Request {
    user?: { id: number; name: string; role: string; company?: string };
}
