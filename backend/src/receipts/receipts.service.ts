import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Receipt } from "./receipt.entity.js";
import { Workspace } from "../workspaces/workspace.entity.js";

@Injectable()
export class ReceiptsService {
  constructor(
    @InjectRepository(Receipt)
    private readonly receiptsRepo: Repository<Receipt>,
    @InjectRepository(Workspace)
    private readonly workspacesRepo: Repository<Workspace>,
  ) {}

  async findAll(userId: string) {
    const workspace = await this.workspacesRepo.findOne({ where: { owner: { id: userId } } });
    if (!workspace) return [];
    return this.receiptsRepo.find({ where: { workspace: { id: workspace.id } } });
  }

  async findOne(userId: string, id: string) {
    const workspace = await this.workspacesRepo.findOne({ where: { owner: { id: userId } } });
    if (!workspace) throw new NotFoundException();
    const receipt = await this.receiptsRepo.findOne({ where: { id, workspace: { id: workspace.id } } });
    if (!receipt) throw new NotFoundException();
    return receipt;
  }
}
