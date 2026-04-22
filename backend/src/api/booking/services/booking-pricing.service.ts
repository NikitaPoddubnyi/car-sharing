import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { calculateTotalPrice } from '../utils/booking-helpers';

@Injectable()
export class BookingPricingService {
  calculatePrice(
    pricePerHour: number,
    pricePerDay: number,
    durationHours: number,
  ): Prisma.Decimal {
    const total = calculateTotalPrice(pricePerHour, pricePerDay, durationHours);
    return new Prisma.Decimal(total);
  }
}
