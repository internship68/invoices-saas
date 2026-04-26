import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppSettings } from "./app-settings.entity.js";
import { SettingsController } from "./settings.controller.js";
import { SettingsService } from "./settings.service.js";
import { WorkspacesModule } from "../workspaces/workspaces.module.js";

@Module({
  imports: [TypeOrmModule.forFeature([AppSettings]), WorkspacesModule],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [TypeOrmModule],
})
export class SettingsModule {}

