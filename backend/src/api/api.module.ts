import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getAuthConfig } from 'src/config/auth.config';
import { UserModule } from './user/user.module';
import { InquiryModule } from './inquiry/inquiry.module';
import { CarModule } from './car/car.module';
import { LocationModule } from './location/location.module';
import { BikeModule } from './bike/bike.module';

@Module({
  imports: [
    AuthModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getAuthConfig,
      inject: [ConfigService],
    }),
    UserModule,
    InquiryModule,
    CarModule,
    LocationModule,
    BikeModule,
  ],
})
export class ApiModule {}
