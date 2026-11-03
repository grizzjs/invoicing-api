import { Module } from '@nestjs/common';
import { CustomersModule } from './customers/customers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Module as S3WrapperModule } from 'nestjs-s3';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { ConfigsModule } from './config/configs.module';
import { DB_CONFIG, S3_CONFIG } from './config/config';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { DeliveryReceiptsModule } from './delivery-receipts/delivery-receipts.module';
import { InvoicesModule } from './invoices/invoices.module';
import { CollectionsModule } from './collections/collections.module';
import { S3Module } from './s3/s3.module';
import { JobOrdersModule } from './job-orders/job-orders.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(DB_CONFIG)],
      useFactory: (dbConfig: ConfigType<typeof DB_CONFIG>) => ({
        type: 'postgres',
        host: dbConfig.host,
        port: dbConfig.port,
        username: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.schema,
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [DB_CONFIG.KEY],
    }),
    S3WrapperModule.forRootAsync({
      imports: [ConfigModule.forFeature(S3_CONFIG)],
      useFactory: (s3Config: ConfigType<typeof S3_CONFIG>) => {
        const config = {
          config: {
            region: 'us-east-1',
            credentials: {
              accessKeyId: s3Config.accessKey,
              secretAccessKey: s3Config.secretKey,
            },
            endpoint: s3Config.host,
            forcePathStyle: true,
            signatureVersion: 'v4',
          },
        };
        return config;
      },
      inject: [S3_CONFIG.KEY],
    }),
    CustomersModule,
    PurchaseOrdersModule,
    JobOrdersModule,
    DeliveryReceiptsModule,
    InvoicesModule,
    CollectionsModule,
    S3Module,
    AuthModule,
  ],
})
export class AppModule {}
