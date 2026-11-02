import { plainToClass } from 'class-transformer';
import { IsNumber, IsString, IsOptional, validateSync } from 'class-validator';

class ConfigValidation {
  @IsOptional()
  @IsNumber()
  APP_PORT: number;

  @IsString()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_SCHEMA: string;

  @IsString()
  S3_HOST: string;

  @IsString()
  S3_ACCESSKEY: string;

  @IsString()
  S3_SECRETKEY: string;
}

export default function validate(configuration: Record<string, unknown>) {
  const finalConfig = plainToClass(ConfigValidation, configuration, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(finalConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(
      `Config validation error: ${errors.map((e) => Object.values(e.constraints || []).join(', ')).join('; ')}`,
    );
  }

  return configuration;
}
