import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Workspace } from "../workspaces/workspace.entity.js";
import { Invoice } from "../invoices/invoice.entity.js";

@Entity("clients")
export class Client {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar", nullable: true })
  company?: string | null;

  @Column({ type: "varchar", nullable: true })
  email?: string | null;

  @Column({ type: "varchar", nullable: true })
  phone?: string | null;

  @Column({ type: "varchar", nullable: true })
  taxId?: string | null;

  @Column({ type: "varchar", nullable: true })
  address?: string | null;

  @ManyToOne(() => Workspace, (workspace) => workspace.clients, { nullable: false })
  workspace!: Workspace;

  @OneToMany(() => Invoice, (invoice) => invoice.client)
  invoices!: Invoice[];
}

