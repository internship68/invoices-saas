import jwt from "jsonwebtoken";
import type { User } from "../users/user.entity.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = "7d";

export interface JwtPayload {
  sub: string;
  email: string;
}

export function signUser(user: User): string {
  const payload: JwtPayload = { sub: user.id, email: user.email };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

