import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Logger,
  Inject,
} from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { JwtAuthGuard } from "./jwt-auth.guard.js";
import type { AuthenticatedRequest } from "../common/types/authenticated-request.js";
import { LoginRequestDto, RegisterRequestDto } from "./dto/auth.dto.js";

@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() body: RegisterRequestDto) {
    this.logger.log(`Register request for ${body.email}`);
    return this.authService.register(body);
  }

  @Post("login")
  async login(@Body() body: LoginRequestDto) {
    this.logger.log(`Login request for ${body.email}`);
    const { accessToken, user } = await this.authService.login(body);
    return {
      accessToken,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@Req() req: AuthenticatedRequest) {
    return req.user;
  }
}