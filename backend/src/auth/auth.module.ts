import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/user.entity.js";
import { Workspace } from "../workspaces/workspace.entity.js";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";

@Module({
  imports: [TypeOrmModule.forFeature([User, Workspace])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

