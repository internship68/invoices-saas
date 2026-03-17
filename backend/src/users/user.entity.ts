import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Workspace } from "../workspaces/workspace.entity.js";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "varchar" })
  passwordHash!: string;

  @Column({ type: "varchar", nullable: true })
  name?: string | null;

  @OneToMany(() => Workspace, (workspace) => workspace.owner)
  workspaces!: Workspace[];
}

