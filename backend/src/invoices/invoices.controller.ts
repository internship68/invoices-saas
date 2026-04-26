import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, Inject } from "@nestjs/common";
import { InvoicesService } from "./invoices.service.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import type { AuthenticatedRequest } from "../common/types/authenticated-request.js";
import { CreateInvoiceDto, UpdateInvoiceDto } from "./dto/invoice.dto.js";

@Controller("invoices")
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(@Inject(InvoicesService) private readonly invoicesService: InvoicesService) {}

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.invoicesService.findAll(req.user.sub);
  }

  @Get(":id")
  findOne(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.invoicesService.findOne(req.user.sub, id);
  }

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() body: CreateInvoiceDto) {
    return this.invoicesService.create(req.user.sub, body);
  }

  @Put(":id")
  update(@Req() req: AuthenticatedRequest, @Param("id") id: string, @Body() body: UpdateInvoiceDto) {
    return this.invoicesService.update(req.user.sub, id, body);
  }

  @Delete(":id")
  remove(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.invoicesService.remove(req.user.sub, id);
  }

  @Post(":id/mark-paid")
  markPaid(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.invoicesService.markPaid(req.user.sub, id);
  }
}
