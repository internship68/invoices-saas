import { Controller, Get, Param, Req, UseGuards, Inject } from "@nestjs/common";
import { ReceiptsService } from "./receipts.service.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import type { AuthenticatedRequest } from "../common/types/authenticated-request.js";

@Controller("receipts")
@UseGuards(JwtAuthGuard)
export class ReceiptsController {
  constructor(@Inject(ReceiptsService) private readonly receiptsService: ReceiptsService) {}

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.receiptsService.findAll(req.user.sub);
  }

  @Get(":id")
  findOne(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.receiptsService.findOne(req.user.sub, id);
  }
}
