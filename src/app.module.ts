import { Module } from '@nestjs/common';
import { CustomersModule } from './customers/customers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { ConfigsModule } from './config/configs.module';
import { DB_CONFIG } from './config/config';
import { ConfigModule, ConfigType } from '@nestjs/config';

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
    CustomersModule,
    PurchaseOrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
