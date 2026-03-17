import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Workspace } from "../workspaces/workspace.entity.js";
import { Client } from "../clients/client.entity.js";
import { InvoiceItem } from "./invoice-item.entity.js";
import { Receipt } from "../receipts/receipt.entity.js";

export type InvoiceStatus = "draft" | "sent" | "paid";

@Entity("invoices")
export class Invoice {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.invoices, { nullable: false })
  workspace!: any;

  @ManyToOne(() => Client, (client) => client.invoices, { nullable: false })
  client!: any;

  @OneToMany(() => InvoiceItem, (item) => item.invoice, { cascade: true })
  items!: InvoiceItem[];

  @OneToMany(() => Receipt, (receipt) => receipt.invoice)
  receipts!: Receipt[];

  @Column({ type: "varchar", unique: true })
  invoiceNumber!: string;

  @Column({ type: "varchar" })
  status!: InvoiceStatus;

  @Column({ type: "timestamptz" })
  createdAt!: Date;

  @Column({ type: "timestamptz" })
  dueDate!: Date;

  @Column({ type: "numeric", precision: 12, scale: 2 })
  subtotal!: string;

  @Column({ type: "numeric", precision: 12, scale: 2, default: 0 })
  vatAmount!: string;

  @Column({ type: "numeric", precision: 12, scale: 2 })
  total!: string;

  @Column({ type: "boolean", default: false })
  depositEnabled!: boolean;

  @Column({ type: "numeric", precision: 5, scale: 2, default: 0 })
  depositPercent!: string;

  @Column({ type: "numeric", precision: 12, scale: 2, default: 0 })
  depositAmount!: string;

  @Column({ type: "numeric", precision: 12, scale: 2 })
  amountDue!: string;

  @Column({ type: "varchar", nullable: true })
  promptPayId?: string | null;

  @Column({ type: "jsonb", nullable: true })
  installments?: unknown;

  @Column({ nullable: true, type: "text" })
  notes?: string | null;
}

