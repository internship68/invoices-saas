import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Workspace } from "../workspaces/workspace.entity.js";

@Entity("app_settings")
export class AppSettings {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.settings, { nullable: false })
  workspace!: Workspace;

  @Column({ type: "varchar", nullable: true })
  promptPayId?: string | null;

  @Column({ type: "varchar", nullable: true })
  companyName?: string | null;

  @Column({ type: "varchar", nullable: true })
  companyAddress?: string | null;

  @Column({ type: "varchar", nullable: true })
  companyTaxId?: string | null;

  @Column({ type: "varchar", nullable: true })
  companyPhone?: string | null;

  @Column({ type: "varchar", nullable: true })
  companyEmail?: string | null;
}

