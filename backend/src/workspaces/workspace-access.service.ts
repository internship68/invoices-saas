import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Workspace } from "./workspace.entity.js";

@Injectable()
export class WorkspaceAccessService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspacesRepo: Repository<Workspace>,
  ) {}

  async findByOwnerId(userId: string): Promise<Workspace | null> {
    return this.workspacesRepo.findOne({ where: { owner: { id: userId } } });
  }

  async findByOwnerIdOrThrow(userId: string): Promise<Workspace> {
    const workspace = await this.findByOwnerId(userId);
    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }
    return workspace;
  }

  async getOrCreateByOwnerId(userId: string): Promise<Workspace> {
    const existing = await this.findByOwnerId(userId);
    if (existing) {
      return existing;
    }

    const created = this.workspacesRepo.create({
      name: "My Workspace",
      owner: { id: userId } as Workspace["owner"],
    });
    return this.workspacesRepo.save(created);
  }
}
