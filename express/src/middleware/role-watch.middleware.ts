import { NextFunction } from "express";

export function roleWatchMiddleware(req: Request, res: Response, next: NextFunction) {

    req['user'] = {
        role: "admin",
        name: 'Emmanuel'
    };
    next();
}