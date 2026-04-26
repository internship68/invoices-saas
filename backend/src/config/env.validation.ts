type AppEnv = {
  NODE_ENV?: string;
  PORT?: string;
  DATABASE_URL?: string;
  DB_SSL?: string;
  JWT_SECRET?: string;
};

export function validateEnv(config: AppEnv): AppEnv {
  const errors: string[] = [];

  if (!config.DATABASE_URL) {
    errors.push("DATABASE_URL is required");
  }

  if (!config.JWT_SECRET) {
    errors.push("JWT_SECRET is required");
  }

  if (config.DB_SSL && !["true", "false"].includes(config.DB_SSL)) {
    errors.push("DB_SSL must be 'true' or 'false'");
  }

  if (config.PORT && Number.isNaN(Number(config.PORT))) {
    errors.push("PORT must be a number");
  }

  if (errors.length > 0) {
    throw new Error(`Invalid environment configuration: ${errors.join(", ")}`);
  }

  return config;
}
