import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getAuthConfig } from 'src/config/auth.config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getAuthConfig,
      inject: [ConfigService],
    }),
    UserModule,
  ],
})
export class ApiModule {}
