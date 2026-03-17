import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "../users/user.entity.js";
import { Client } from "../clients/client.entity.js";
import { Invoice } from "../invoices/invoice.entity.js";
import { Receipt } from "../receipts/receipt.entity.js";
import { AppSettings } from "../settings/app-settings.entity.js";

@Entity("workspaces")
export class Workspace {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar", default: "free" })
  plan!: string;

  @ManyToOne(() => User, (user) => user.workspaces, { nullable: false })
  owner!: User;

  @OneToMany(() => Client, (client) => client.workspace)
  clients!: Client[];

  @OneToMany(() => Invoice, (invoice) => invoice.workspace)
  invoices!: Invoice[];

  @OneToMany(() => Receipt, (receipt) => receipt.workspace)
  receipts!: Receipt[];

  @OneToMany(() => AppSettings, (settings) => settings.workspace)
  settings!: AppSettings[];
}

