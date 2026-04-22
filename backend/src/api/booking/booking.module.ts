import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingValidatorService } from './services/booking-validator.service';
import { BookingPricingService } from './services/booking-pricing.service';
import { BookingAvailabilityService } from './services/booking-availability.service';
import { BookingCleanupService } from './services/booking-cleanup.service';

@Module({
  controllers: [BookingController],
  providers: [
    PrismaService,
    BookingService,
    BookingValidatorService,
    BookingPricingService,
    BookingAvailabilityService,
    BookingCleanupService,
  ],
  exports: [BookingService],
})
export class BookingModule {}
