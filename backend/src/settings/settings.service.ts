import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AppSettings } from "./app-settings.entity.js";
import { Workspace } from "../workspaces/workspace.entity.js";

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(AppSettings)
    private readonly settingsRepo: Repository<AppSettings>,
    @InjectRepository(Workspace)
    private readonly workspacesRepo: Repository<Workspace>,
  ) {}

  async get(userId: string) {
    const workspace = await this.getOrCreateWorkspace(userId);
    let settings = await this.settingsRepo.findOne({ where: { workspace: { id: workspace.id } } });
    if (!settings) {
      settings = this.settingsRepo.create({ workspace });
      settings = await this.settingsRepo.save(settings);
    }
    return settings;
  }

  async update(userId: string, data: any) {
    const workspace = await this.getOrCreateWorkspace(userId);
    let settings = await this.settingsRepo.findOne({ where: { workspace: { id: workspace.id } } });
    if (!settings) {
      settings = this.settingsRepo.create({ workspace });
    }
    Object.assign(settings, data);
    return this.settingsRepo.save(settings);
  }

  private async getOrCreateWorkspace(userId: string) {
    let workspace = await this.workspacesRepo.findOne({ where: { owner: { id: userId } } });
    if (!workspace) {
      workspace = this.workspacesRepo.create({ name: "My Workspace", owner: { id: userId } as any });
      workspace = await this.workspacesRepo.save(workspace);
    }
    return workspace;
  }
}
