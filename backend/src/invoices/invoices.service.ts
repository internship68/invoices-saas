import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Invoice } from "./invoice.entity.js";
import { InvoiceItem } from "./invoice-item.entity.js";
import { Workspace } from "../workspaces/workspace.entity.js";
import { Client } from "../clients/client.entity.js";
import { Receipt } from "../receipts/receipt.entity.js";
import { AppSettings } from "../settings/app-settings.entity.js";

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoicesRepo: Repository<Invoice>,
    @InjectRepository(InvoiceItem)
    private readonly itemsRepo: Repository<InvoiceItem>,
    @InjectRepository(Workspace)
    private readonly workspacesRepo: Repository<Workspace>,
    @InjectRepository(Client)
    private readonly clientsRepo: Repository<Client>,
    @InjectRepository(Receipt)
    private readonly receiptsRepo: Repository<Receipt>,
    @InjectRepository(AppSettings)
    private readonly settingsRepo: Repository<AppSettings>,
  ) {}

  async findAll(userId: string) {
    const workspace = await this.workspacesRepo.findOne({ where: { owner: { id: userId } } });
    if (!workspace) return [];
    const invoices = await this.invoicesRepo.find({
      where: { workspace: { id: workspace.id } },
      relations: ["items", "client"],
    });
    return invoices.map((inv) => ({
      ...inv,
      // ให้ frontend ใช้ clientId ได้ตรง ๆ
      clientId: (inv as any).client?.id,
    }));
  }

  async findOne(userId: string, id: string) {
    const workspace = await this.workspacesRepo.findOne({ where: { owner: { id: userId } } });
    if (!workspace) throw new NotFoundException();
    const invoice = await this.invoicesRepo.findOne({
      where: { id, workspace: { id: workspace.id } },
      relations: ["items", "client"],
    });
    if (!invoice) throw new NotFoundException();
    return {
      ...invoice,
      clientId: (invoice as any).client?.id,
    };
  }

  async findPublicInvoice(id: string) {
    const invoice = await this.invoicesRepo.findOne({
      where: { id },
      relations: ["items", "client", "workspace"],
    });
    if (!invoice) throw new NotFoundException();

    const settings = await this.settingsRepo.findOne({
      where: { workspace: { id: (invoice as any).workspace?.id } },
    });

    return {
      invoice: {
        ...invoice,
        clientId: (invoice as any).client?.id,
      },
      settings: settings ?? null,
    };
  }

  async create(userId: string, data: any) {
    const workspace = await this.getOrCreateWorkspace(userId);
    const client = await this.clientsRepo.findOne({ where: { id: data.clientId, workspace: { id: workspace.id } } });
    if (!client) throw new NotFoundException("Client not found");

    const invoiceNumber = await this.generateInvoiceNumber(workspace.id);
    const invoice = this.invoicesRepo.create({
      workspace,
      client,
      invoiceNumber,
      status: "draft",
      createdAt: new Date(),
      dueDate: new Date(data.dueDate),
      subtotal: String(data.subtotal),
      vatAmount: String(data.vatAmount),
      total: String(data.total),
      depositEnabled: data.depositEnabled,
      depositPercent: String(data.depositPercent),
      depositAmount: String(data.depositAmount),
      amountDue: String(data.amountDue),
      notes: data.notes,
      promptPayId: data.promptPayId,
      installments: data.installments,
    });
    const saved = await this.invoicesRepo.save(invoice);

    const items = data.items.map((it: any) =>
      this.itemsRepo.create({
        invoice: saved,
        description: it.description,
        quantity: it.quantity,
        unitPrice: String(it.unitPrice),
        amount: String(it.amount),
      }),
    );
    await this.itemsRepo.save(items);

    const withRelations = await this.invoicesRepo.findOne({
      where: { id: saved.id },
      relations: ["items", "client"],
    });
    return {
      ...withRelations!,
      clientId: (withRelations as any)?.client?.id,
    };
  }

  async update(userId: string, id: string, data: any) {
    const workspace = await this.workspacesRepo.findOne({ where: { owner: { id: userId } } });
    if (!workspace) throw new NotFoundException();
    const invoice = await this.invoicesRepo.findOne({
      where: { id, workspace: { id: workspace.id } },
      relations: ["items", "client"],
    });
    if (!invoice) throw new NotFoundException();

    if (data.items) {
      await this.itemsRepo.delete({ invoice: { id: invoice.id } });
      const items = data.items.map((it: any) =>
        this.itemsRepo.create({
          invoice,
          description: it.description,
          quantity: it.quantity,
          unitPrice: String(it.unitPrice),
          amount: String(it.amount),
        }),
      );
      await this.itemsRepo.save(items);
    }

    Object.assign(invoice, {
      status: data.status ?? invoice.status,
      dueDate: data.dueDate ? new Date(data.dueDate) : invoice.dueDate,
      subtotal: data.subtotal !== undefined ? String(data.subtotal) : invoice.subtotal,
      vatAmount: data.vatAmount !== undefined ? String(data.vatAmount) : invoice.vatAmount,
      total: data.total !== undefined ? String(data.total) : invoice.total,
      depositEnabled: data.depositEnabled ?? invoice.depositEnabled,
      depositPercent: data.depositPercent !== undefined ? String(data.depositPercent) : invoice.depositPercent,
      depositAmount: data.depositAmount !== undefined ? String(data.depositAmount) : invoice.depositAmount,
      amountDue: data.amountDue !== undefined ? String(data.amountDue) : invoice.amountDue,
      notes: data.notes !== undefined ? data.notes : invoice.notes,
      promptPayId: data.promptPayId !== undefined ? data.promptPayId : invoice.promptPayId,
      installments: data.installments !== undefined ? data.installments : invoice.installments,
    });

    await this.invoicesRepo.save(invoice);
    const withRelations = await this.invoicesRepo.findOne({
      where: { id },
      relations: ["items", "client"],
    });
    return {
      ...withRelations!,
      clientId: (withRelations as any)?.client?.id,
    };
  }

  async remove(userId: string, id: string) {
    const workspace = await this.workspacesRepo.findOne({ where: { owner: { id: userId } } });
    if (!workspace) throw new NotFoundException();
    const invoice = await this.invoicesRepo.findOne({ where: { id, workspace: { id: workspace.id } } });
    if (!invoice) throw new NotFoundException();
    await this.invoicesRepo.remove(invoice);
    return { success: true };
  }

  async markPaid(userId: string, id: string) {
    const workspace = await this.workspacesRepo.findOne({ where: { owner: { id: userId } } });
    if (!workspace) throw new NotFoundException();
    const invoice = await this.invoicesRepo.findOne({
      where: { id, workspace: { id: workspace.id } },
      relations: ["items", "client"],
    });
    if (!invoice) throw new NotFoundException();

    invoice.status = "paid";
    await this.invoicesRepo.save(invoice);

    const receiptNumber = await this.generateReceiptNumber(workspace.id);
    const receipt = this.receiptsRepo.create({
      workspace,
      invoice,
      receiptNumber,
      total: invoice.total,
      paidAt: new Date(),
    });
    await this.receiptsRepo.save(receipt);

    const withRelations = await this.invoicesRepo.findOne({
      where: { id },
      relations: ["items", "client"],
    });
    return {
      ...withRelations!,
      clientId: (withRelations as any)?.client?.id,
    };
  }

  private async getOrCreateWorkspace(userId: string) {
    let workspace = await this.workspacesRepo.findOne({ where: { owner: { id: userId } } });
    if (!workspace) {
      workspace = this.workspacesRepo.create({ name: "My Workspace", owner: { id: userId } as any });
      workspace = await this.workspacesRepo.save(workspace);
    }
    return workspace;
  }

  private async generateInvoiceNumber(workspaceId: string): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.invoicesRepo.count({ where: { workspace: { id: workspaceId } } });
    return `INV-${year}-${String(count + 1).padStart(3, "0")}`;
  }

  private async generateReceiptNumber(workspaceId: string): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.receiptsRepo.count({ where: { workspace: { id: workspaceId } } });
    return `RCP-${year}-${String(count + 1).padStart(3, "0")}`;
  }
}
