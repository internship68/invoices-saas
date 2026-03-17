import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { Logger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const logger = new Logger("Bootstrap");

  logger.log("Starting NestJS application...");
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix("api/v1");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  try {
    await app.listen(port);
    logger.log(`Backend listening on port ${port} with prefix /api/v1`);
    if (process.env.DATABASE_URL) {
        logger.log("DATABASE_URL is configured.");
    } else {
      logger.warn("DATABASE_URL is not set. Database connection will fail.");
    }
  } catch (err) {
    logger.error("Failed to start application", err as Error);
    throw err;
  }
}

bootstrap();

