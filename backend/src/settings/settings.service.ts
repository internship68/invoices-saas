import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AppSettings } from "./app-settings.entity.js";
import { WorkspaceAccessService } from "../workspaces/workspace-access.service.js";
import { UpdateSettingsDto } from "./dto/settings.dto.js";

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(AppSettings)
    private readonly settingsRepo: Repository<AppSettings>,
    private readonly workspaceAccessService: WorkspaceAccessService,
  ) {}

  async get(userId: string) {
    const workspace = await this.workspaceAccessService.getOrCreateByOwnerId(userId);
    let settings = await this.settingsRepo.findOne({ where: { workspace: { id: workspace.id } } });
    if (!settings) {
      settings = this.settingsRepo.create({ workspace });
      settings = await this.settingsRepo.save(settings);
    }
    return settings;
  }

  async update(userId: string, data: UpdateSettingsDto) {
    const workspace = await this.workspaceAccessService.getOrCreateByOwnerId(userId);
    let settings = await this.settingsRepo.findOne({ where: { workspace: { id: workspace.id } } });
    if (!settings) {
      settings = this.settingsRepo.create({ workspace });
    }
    Object.assign(settings, data);
    return this.settingsRepo.save(settings);
  }

}
