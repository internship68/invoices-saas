import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Invoice } from "./invoice.entity.js";
import { InvoiceItem } from "./invoice-item.entity.js";
import { Client } from "../clients/client.entity.js";
import { Receipt } from "../receipts/receipt.entity.js";
import { AppSettings } from "../settings/app-settings.entity.js";
import { InvoicesController } from "./invoices.controller.js";
import { InvoicesService } from "./invoices.service.js";
import { PublicInvoicesController } from "./public-invoices.controller.js";
import { WorkspacesModule } from "../workspaces/workspaces.module.js";

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, InvoiceItem, Client, Receipt, AppSettings]), WorkspacesModule],
  controllers: [InvoicesController, PublicInvoicesController],
  providers: [InvoicesService],
  exports: [TypeOrmModule],
})
export class InvoicesModule {}

