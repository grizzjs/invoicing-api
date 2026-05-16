import { NestFactory } from '@nestjs/core';

import serverlessExpress from '@codegenie/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';

import { ValidationPipe } from '@nestjs/common';
import { RequestListener } from 'http';

import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';
import { AppModule } from './app.module';

type ENV = {
  [k in
    | 'DB_PASSWORD'
    | 'DB_HOST'
    | 'DB_SCHEMA'
    | 'DB_PORT'
    | 'DB_USERNAME']?: string;
};

const client: SSMClient = new SSMClient({ region: process.env.AWS_REGION });
let server: Handler;
let cached: ENV | null = null;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  await app.init();

  const expressApp: RequestListener = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

const getParams = async (): Promise<ENV> => {
  if (cached) return cached;
  cached = {};

  const password = await client.send(
    new GetParameterCommand({
      Name: `${process.env.SSM_PARAM_KEY}/DB_PASSWORD`,
      WithDecryption: true, // for SecureString
    }),
  );

  const host = await client.send(
    new GetParameterCommand({
      Name: `${process.env.SSM_PARAM_KEY}/DB_HOST`,
    }),
  );

  const port = await client.send(
    new GetParameterCommand({
      Name: `${process.env.SSM_PARAM_KEY}/DB_PORT`,
    }),
  );

  const username = await client.send(
    new GetParameterCommand({
      Name: `${process.env.SSM_PARAM_KEY}/DB_USERNAME`,
    }),
  );

  const schema = await client.send(
    new GetParameterCommand({
      Name: `${process.env.SSM_PARAM_KEY}/DB_SCHEMA`,
    }),
  );

  cached.DB_PORT = port.Parameter?.Value;
  cached.DB_USERNAME = username.Parameter?.Value;
  cached.DB_SCHEMA = schema.Parameter?.Value;
  cached.DB_HOST = host.Parameter?.Value;
  cached.DB_PASSWORD = password.Parameter?.Value;
  return cached;
};

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  const { DB_HOST, DB_PORT, DB_USERNAME, DB_SCHEMA, DB_PASSWORD } =
    await getParams();
  process.env = {
    ...process.env,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_SCHEMA,
    DB_PASSWORD,
  };
  server = server ?? (await bootstrap());
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return server(event, context, callback);
};
