import { registerAs } from '@nestjs/config';
import { type AppInterface } from './interface/app.interface';
import { type DatabaseInterface } from './interface/database.interface';
import { type S3Interface } from './interface/s3.interface';

export const APP = 'app';
export const DB = 'db';
export const S3 = 's3';

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

export const S3_CONFIG = registerAs<S3Interface>(S3, () => ({
  host: process.env.S3_HOST || 'localhost',
  accessKey: process.env.S3_ACCESSKEY || '',
  secretKey: process.env.S3_SECRETKEY || '',
  bucket: process.env.S3_BUCKET || '',
}));

export default [APP_CONFIG, DB_CONFIG, S3_CONFIG];
