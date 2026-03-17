import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Receipt } from "./receipt.entity.js";
import { Workspace } from "../workspaces/workspace.entity.js";
import { ReceiptsController } from "./receipts.controller.js";
import { ReceiptsService } from "./receipts.service.js";

@Module({
  imports: [TypeOrmModule.forFeature([Receipt, Workspace])],
  controllers: [ReceiptsController],
  providers: [ReceiptsService],
  exports: [TypeOrmModule],
})
export class ReceiptsModule {}

