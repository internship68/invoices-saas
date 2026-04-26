import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Client } from "./client.entity.js";
import { WorkspaceAccessService } from "../workspaces/workspace-access.service.js";
import { CreateClientDto, UpdateClientDto } from "./dto/client.dto.js";

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepo: Repository<Client>,
    private readonly workspaceAccessService: WorkspaceAccessService,
  ) {}

  async findAll(userId: string) {
    const workspace = await this.workspaceAccessService.findByOwnerId(userId);
    if (!workspace) return [];
    return this.clientsRepo.find({ where: { workspace: { id: workspace.id } } });
  }

  async create(userId: string, data: CreateClientDto) {
    const workspace = await this.workspaceAccessService.getOrCreateByOwnerId(userId);
    const client = this.clientsRepo.create({ ...data, workspace });
    return this.clientsRepo.save(client);
  }

  async update(userId: string, id: string, data: UpdateClientDto) {
    const workspace = await this.workspaceAccessService.findByOwnerIdOrThrow(userId);
    const client = await this.clientsRepo.findOne({ where: { id, workspace: { id: workspace.id } } });
    if (!client) throw new NotFoundException();
    Object.assign(client, data);
    return this.clientsRepo.save(client);
  }

  async remove(userId: string, id: string) {
    const workspace = await this.workspaceAccessService.findByOwnerIdOrThrow(userId);
    const client = await this.clientsRepo.findOne({ where: { id, workspace: { id: workspace.id } } });
    if (!client) throw new NotFoundException();
    await this.clientsRepo.remove(client);
    return { success: true };
  }
}
