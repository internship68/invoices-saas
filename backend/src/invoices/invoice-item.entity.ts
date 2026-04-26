import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Invoice } from "./invoice.entity.js";

@Entity("invoice_items")
export class InvoiceItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Invoice, (invoice) => invoice.items, { nullable: false })
  invoice!: Invoice;

  @Column({ type: "varchar" })
  description!: string;

  @Column({ type: "integer" })
  quantity!: number;

  @Column({ type: "numeric", precision: 12, scale: 2 })
  unitPrice!: string;

  @Column({ type: "numeric", precision: 12, scale: 2 })
  amount!: string;
}

