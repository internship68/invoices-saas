import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Client } from "./client.entity.js";
import { ClientsController } from "./clients.controller.js";
import { ClientsService } from "./clients.service.js";
import { WorkspacesModule } from "../workspaces/workspaces.module.js";

@Module({
  imports: [TypeOrmModule.forFeature([Client]), WorkspacesModule],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [TypeOrmModule],
})
export class ClientsModule {}

