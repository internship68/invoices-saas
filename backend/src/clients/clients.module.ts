import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Client } from "./client.entity.js";
import { Workspace } from "../workspaces/workspace.entity.js";
import { ClientsController } from "./clients.controller.js";
import { ClientsService } from "./clients.service.js";

@Module({
  imports: [TypeOrmModule.forFeature([Client, Workspace])],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [TypeOrmModule],
})
export class ClientsModule {}

