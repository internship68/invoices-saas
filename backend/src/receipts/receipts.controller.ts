import { Controller, Get, Param, Req, UseGuards, Inject } from "@nestjs/common";
import { ReceiptsService } from "./receipts.service.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";

@Controller("receipts")
@UseGuards(JwtAuthGuard)
export class ReceiptsController {
  constructor(@Inject(ReceiptsService) private readonly receiptsService: ReceiptsService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.receiptsService.findAll(req.user.sub);
  }

  @Get(":id")
  findOne(@Req() req: any, @Param("id") id: string) {
    return this.receiptsService.findOne(req.user.sub, id);
  }
}
