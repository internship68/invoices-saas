import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Workspace } from "../workspaces/workspace.entity.js";
import { Invoice } from "../invoices/invoice.entity.js";

@Entity("receipts")
export class Receipt {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.receipts, { nullable: false })
  workspace!: Workspace;

  @ManyToOne(() => Invoice, (invoice) => invoice.receipts, { nullable: false })
  invoice!: Invoice;

  @Column({ type: "varchar", unique: true })
  receiptNumber!: string;

  @Column({ type: "numeric", precision: 12, scale: 2 })
  total!: string;

  @Column({ type: "timestamptz" })
  paidAt!: Date;
}

