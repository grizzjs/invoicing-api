import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Configurations from './config';
import validate from './validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: Configurations,
      isGlobal: true,
      validate,
    }),
  ],
})
export class ConfigsModule {}
