import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { JWT_Secret } from "./config.js";


export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(403).json({ message: "No token provided" });
    }

    const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;
    try {
        const decoded = jwt.verify(token, JWT_Secret);
        //@ts-ignore
        req.userId = decoded.id; // matches signin's `id`
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

/*
export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header as string, JWT_Secret)

    if(decoded){
        //@ts-ignore
        req.userId = decoded.id;
        next()
        // override the types of the express request object
    }else{
        res.status(403).json({
            message: "You are not logged in"
        })
    }
}
*/