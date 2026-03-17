import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Client } from "./client.entity.js";
import { Workspace } from "../workspaces/workspace.entity.js";

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepo: Repository<Client>,
    @InjectRepository(Workspace)
    private readonly workspacesRepo: Repository<Workspace>,
  ) {}

  async findAll(userId: string) {
    const workspace = await this.workspacesRepo.findOne({ where: { owner: { id: userId } } });
    if (!workspace) return [];
    return this.clientsRepo.find({ where: { workspace: { id: workspace.id } } });
  }

  async create(userId: string, data: any) {
    const workspace = await this.getOrCreateWorkspace(userId);
    const client = this.clientsRepo.create({ ...data, workspace });
    return this.clientsRepo.save(client);
  }

  async update(userId: string, id: string, data: any) {
    const workspace = await this.workspacesRepo.findOne({ where: { owner: { id: userId } } });
    if (!workspace) throw new NotFoundException();
    const client = await this.clientsRepo.findOne({ where: { id, workspace: { id: workspace.id } } });
    if (!client) throw new NotFoundException();
    Object.assign(client, data);
    return this.clientsRepo.save(client);
  }

  async remove(userId: string, id: string) {
    const workspace = await this.workspacesRepo.findOne({ where: { owner: { id: userId } } });
    if (!workspace) throw new NotFoundException();
    const client = await this.clientsRepo.findOne({ where: { id, workspace: { id: workspace.id } } });
    if (!client) throw new NotFoundException();
    await this.clientsRepo.remove(client);
    return { success: true };
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
