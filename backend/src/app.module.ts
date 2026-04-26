import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users/user.entity.js";
import { Workspace } from "./workspaces/workspace.entity.js";
import { Client } from "./clients/client.entity.js";
import { Invoice } from "./invoices/invoice.entity.js";
import { InvoiceItem } from "./invoices/invoice-item.entity.js";
import { Receipt } from "./receipts/receipt.entity.js";
import { AppSettings } from "./settings/app-settings.entity.js";
import { UsersModule } from "./users/users.module.js";
import { AuthModule } from "./auth/auth.module.js";
import { ClientsModule } from "./clients/clients.module.js";
import { InvoicesModule } from "./invoices/invoices.module.js";
import { ReceiptsModule } from "./receipts/receipts.module.js";
import { SettingsModule } from "./settings/settings.module.js";
import { WorkspacesModule } from "./workspaces/workspaces.module.js";
import { validateEnv } from "./config/env.validation.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: "postgres",
        url: process.env.DATABASE_URL,
        ssl: process.env.DB_SSL === "true"
          ? { rejectUnauthorized: false }
          : false,
        entities: [User, Workspace, Client, Invoice, InvoiceItem, Receipt, AppSettings],
        synchronize: true, // TODO: disable in production
        logging: ["error", "schema", "migration"],
      }),
    }),
    UsersModule,
    AuthModule,
    ClientsModule,
    InvoicesModule,
    ReceiptsModule,
    SettingsModule,
    WorkspacesModule,
  ],
})
export class AppModule {}

