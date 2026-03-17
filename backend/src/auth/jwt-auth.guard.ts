import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { verifyToken } from "./jwt.util.js";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const header = req.headers["authorization"] as string | undefined;
    if (!header || !header.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing Authorization header");
    }
    const token = header.substring("Bearer ".length);
    try {
      const payload = verifyToken(token);
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException("Invalid token");
    }
  }
}

