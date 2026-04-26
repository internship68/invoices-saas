import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Receipt } from "./receipt.entity.js";
import { WorkspaceAccessService } from "../workspaces/workspace-access.service.js";

@Injectable()
export class ReceiptsService {
  constructor(
    @InjectRepository(Receipt)
    private readonly receiptsRepo: Repository<Receipt>,
    private readonly workspaceAccessService: WorkspaceAccessService,
  ) {}

  async findAll(userId: string) {
    const workspace = await this.workspaceAccessService.findByOwnerId(userId);
    if (!workspace) return [];
    const receipts = await this.receiptsRepo.find({
      where: { workspace: { id: workspace.id } },
      relations: ["invoice", "invoice.items", "invoice.client"],
    });
    return receipts.map((r) => ({
      ...r,
      invoiceId: r.invoice?.id,
      invoiceNumber: r.invoice?.invoiceNumber,
      clientId: r.invoice?.client?.id,
      items: r.invoice?.items,
      subtotal: r.invoice?.subtotal,
      vatEnabled: undefined,
      vatAmount: r.invoice?.vatAmount,
    }));
  }

  async findOne(userId: string, id: string) {
    const workspace = await this.workspaceAccessService.findByOwnerIdOrThrow(userId);
    const receipt = await this.receiptsRepo.findOne({
      where: { id, workspace: { id: workspace.id } },
      relations: ["invoice", "invoice.items", "invoice.client"],
    });
    if (!receipt) throw new NotFoundException();
    return {
      ...receipt,
      invoiceId: receipt.invoice?.id,
      invoiceNumber: receipt.invoice?.invoiceNumber,
      clientId: receipt.invoice?.client?.id,
      items: receipt.invoice?.items,
      subtotal: receipt.invoice?.subtotal,
      vatEnabled: undefined,
      vatAmount: receipt.invoice?.vatAmount,
    };
  }
}
