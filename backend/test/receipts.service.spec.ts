import { test } from "node:test";
import assert from "node:assert/strict";
import type { Repository } from "typeorm";
import { ReceiptsService } from "../src/receipts/receipts.service.js";
import type { Receipt } from "../src/receipts/receipt.entity.js";
import type { WorkspaceAccessService } from "../src/workspaces/workspace-access.service.js";

test("ReceiptsService.findAll maps invoice metadata for frontend", async () => {
  const workspaceAccess = {
    findByOwnerId: async () => ({ id: "ws-1" }),
  } as WorkspaceAccessService;

  const receiptsRepo = {
    find: async () =>
      [
        {
          id: "rcp-1",
          invoice: {
            id: "inv-1",
            invoiceNumber: "INV-2026-001",
            client: { id: "client-1" },
            items: [{ description: "Service" }],
            subtotal: "1000.00",
            vatAmount: "0.00",
          },
        },
      ] as Receipt[],
  } as unknown as Repository<Receipt>;

  const service = new ReceiptsService(receiptsRepo, workspaceAccess);
  const result = await service.findAll("user-1");

  assert.equal(result[0]?.invoiceId, "inv-1");
  assert.equal(result[0]?.clientId, "client-1");
  assert.equal(result[0]?.invoiceNumber, "INV-2026-001");
});
