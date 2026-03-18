import { Controller, Get, Param } from "@nestjs/common";
import { InvoicesService } from "./invoices.service.js";

@Controller("public/invoices")
export class PublicInvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get(":id")
  findPublicInvoice(@Param("id") id: string) {
    return this.invoicesService.findPublicInvoice(id);
  }
}

