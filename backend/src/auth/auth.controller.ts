import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Logger,
  HttpException,
  HttpStatus,
  Inject,
} from "@nestjs/common";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";
import { AuthService } from "./auth.service.js";
import { JwtAuthGuard } from "./jwt-auth.guard.js";

class RegisterRequestDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsString()
  name?: string;
}

class LoginRequestDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(@Inject(AuthService) private readonly authService: AuthService) {
    // 🔥 debug ตอน inject
    this.logger.log(`AuthService injected: ${!!authService}`);
    if (!authService) {
      this.logger.error("AuthService is UNDEFINED ❌");
    }
  }

  @Post("register")
  async register(@Body() body: RegisterRequestDto) {
    this.logger.log(`➡️ register() called: ${JSON.stringify(body)}`);

    try {
      if (!this.authService) {
        this.logger.error("authService is undefined ก่อนเรียก register()");
        throw new HttpException(
          "Internal error: authService undefined",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      const result = await this.authService.register(body);

      this.logger.log(`✅ register success: userId=${result.id}`);
      return result;
    } catch (error: any) {
      this.logger.error("❌ register error", error.stack || error);

      throw new HttpException(
        error.message || "Register failed",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("login")
  async login(@Body() body: LoginRequestDto) {
    this.logger.log(`➡️ login() called: email=${body.email}`);

    try {
      if (!this.authService) {
        this.logger.error("authService is undefined ก่อนเรียก login()");
        throw new HttpException(
          "Internal error: authService undefined",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      const { accessToken, user } = await this.authService.login(body);

      this.logger.log(`✅ login success: userId=${user.id}`);

      return {
        accessToken,
        user: { id: user.id, email: user.email, name: user.name },
      };
    } catch (error: any) {
      this.logger.error("❌ login error", error.stack || error);

      throw new HttpException(
        error.message || "Login failed",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@Req() req: any) {
    this.logger.log(`➡️ me() called userId=${req?.user?.id}`);
    return req.user;
  }
}