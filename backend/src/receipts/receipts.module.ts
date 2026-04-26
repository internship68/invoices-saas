import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Receipt } from "./receipt.entity.js";
import { ReceiptsController } from "./receipts.controller.js";
import { ReceiptsService } from "./receipts.service.js";
import { WorkspacesModule } from "../workspaces/workspaces.module.js";

@Module({
  imports: [TypeOrmModule.forFeature([Receipt]), WorkspacesModule],
  controllers: [ReceiptsController],
  providers: [ReceiptsService],
  exports: [TypeOrmModule],
})
export class ReceiptsModule {}

