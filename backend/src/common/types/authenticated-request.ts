import type { Request } from "express";
import type { JwtPayload } from "../../auth/jwt.util.js";

export type AuthenticatedRequest = Request & {
  user: JwtPayload;
};
