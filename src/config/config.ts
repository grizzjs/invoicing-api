import { registerAs } from '@nestjs/config';
import { type AppInterface } from './interface/app.interface';
import { type DatabaseInterface } from './interface/database.interface';

export const APP = 'app';
export const DB = 'db';

export const APP_CONFIG = registerAs<AppInterface>(APP, () => ({
  port: process.env.APP_PORT ? +process.env.APP_PORT : 3000,
}));

export const DB_CONFIG = registerAs<DatabaseInterface>(DB, () => ({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  schema: process.env.DB_SCHEMA || 'public',
}));

export default [APP_CONFIG, DB_CONFIG];
