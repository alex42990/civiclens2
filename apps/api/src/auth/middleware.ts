import { verifyToken } from "@clerk/backend";
import type { Request, Response, NextFunction } from "express";

export interface AuthContext {
  userId: string | null;
}

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    (req as any).auth = { userId: null };
    return next();
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });
    (req as any).auth = { userId: payload.sub };
  } catch {
    (req as any).auth = { userId: null };
  }

  next();
}
