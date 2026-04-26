import { test } from "node:test";
import assert from "node:assert/strict";
import type { Repository } from "typeorm";
import { InvoicesService } from "../src/invoices/invoices.service.js";
import type { Invoice } from "../src/invoices/invoice.entity.js";
import type { InvoiceItem } from "../src/invoices/invoice-item.entity.js";
import type { Client } from "../src/clients/client.entity.js";
import type { Receipt } from "../src/receipts/receipt.entity.js";
import type { AppSettings } from "../src/settings/app-settings.entity.js";
import type { WorkspaceAccessService } from "../src/workspaces/workspace-access.service.js";

test("InvoicesService.create stores invoice items and returns clientId", async () => {
  const workspaceAccess = {
    getOrCreateByOwnerId: async () => ({ id: "ws-1" }),
  } as WorkspaceAccessService;

  const clientsRepo = {
    findOne: async () => ({ id: "client-1" }),
  } as unknown as Repository<Client>;

  const invoicesRepo = {
    count: async () => 0,
    create: (data: Partial<Invoice>) => ({ id: "inv-1", ...data }) as Invoice,
    save: async (data: Invoice) => data,
    findOne: async () =>
      ({
        id: "inv-1",
        client: { id: "client-1" },
        items: [],
      }) as Invoice,
  } as unknown as Repository<Invoice>;

  const itemsRepo = {
    create: (data: Partial<InvoiceItem>) => data as InvoiceItem,
    save: async (data: InvoiceItem[]) => data,
  } as unknown as Repository<InvoiceItem>;

  const receiptsRepo = {} as Repository<Receipt>;
  const settingsRepo = {} as Repository<AppSettings>;

  const service = new InvoicesService(
    invoicesRepo,
    itemsRepo,
    clientsRepo,
    receiptsRepo,
    settingsRepo,
    workspaceAccess,
  );

  const result = await service.create("user-1", {
    clientId: "client-1",
    dueDate: new Date().toISOString(),
    items: [{ description: "Design", quantity: 1, unitPrice: 1000, amount: 1000 }],
    subtotal: 1000,
    vatEnabled: false,
    vatAmount: 0,
    total: 1000,
    depositEnabled: false,
    depositPercent: 0,
    depositAmount: 0,
    amountDue: 1000,
  });

  assert.equal(result.clientId, "client-1");
});
