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
    const receipts = await this.receiptsRepo.find({
      where: { workspace: { id: workspace.id } },
      relations: ["invoice", "invoice.items", "invoice.client"],
    });
    return receipts.map((r) => ({
      ...r,
      invoiceId: (r as any).invoice?.id,
      invoiceNumber: (r as any).invoice?.invoiceNumber,
      clientId: (r as any).invoice?.client?.id,
      items: (r as any).invoice?.items,
      subtotal: (r as any).invoice?.subtotal,
      vatEnabled: (r as any).invoice?.vatEnabled,
      vatAmount: (r as any).invoice?.vatAmount,
    }));
  }

  async findOne(userId: string, id: string) {
    const workspace = await this.workspacesRepo.findOne({ where: { owner: { id: userId } } });
    if (!workspace) throw new NotFoundException();
    const receipt = await this.receiptsRepo.findOne({
      where: { id, workspace: { id: workspace.id } },
      relations: ["invoice", "invoice.items", "invoice.client"],
    });
    if (!receipt) throw new NotFoundException();
    return {
      ...receipt,
      invoiceId: (receipt as any).invoice?.id,
      invoiceNumber: (receipt as any).invoice?.invoiceNumber,
      clientId: (receipt as any).invoice?.client?.id,
      items: (receipt as any).invoice?.items,
      subtotal: (receipt as any).invoice?.subtotal,
      vatEnabled: (receipt as any).invoice?.vatEnabled,
      vatAmount: (receipt as any).invoice?.vatAmount,
    };
  }
}
