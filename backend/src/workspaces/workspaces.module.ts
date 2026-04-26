import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Workspace } from "./workspace.entity.js";
import { WorkspaceAccessService } from "./workspace-access.service.js";

@Module({
  imports: [TypeOrmModule.forFeature([Workspace])],
  providers: [WorkspaceAccessService],
  exports: [TypeOrmModule, WorkspaceAccessService],
})
export class WorkspacesModule {}

