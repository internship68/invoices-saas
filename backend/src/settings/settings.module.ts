import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppSettings } from "./app-settings.entity.js";
import { Workspace } from "../workspaces/workspace.entity.js";
import { SettingsController } from "./settings.controller.js";
import { SettingsService } from "./settings.service.js";

@Module({
  imports: [TypeOrmModule.forFeature([AppSettings, Workspace])],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [TypeOrmModule],
})
export class SettingsModule {}

