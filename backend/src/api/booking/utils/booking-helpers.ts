import { BadRequestException } from '@nestjs/common';

export const BOOKING_LIMITS = {
  MIN_DURATION_MINUTES: 30,
  MAX_DURATION_HOURS: 720,
  CANCEL_CUTOFF_MINUTES: 15,
} as const;

export function calculateTotalPrice(
  pricePerHour: number,
  pricePerDay: number,
  durationHours: number,
): number {
  const fullDays = Math.floor(durationHours / 24);
  const remainingHours = durationHours % 24;

  let total = 0;

  total += pricePerDay * fullDays;

  if (remainingHours > 0) {
    total += pricePerHour * remainingHours;
  }

  return Math.round(total * 100) / 100;
}

export function validateDateRange(startDate: Date, endDate: Date): void {
  if (startDate < new Date()) {
    throw new BadRequestException('Start date cannot be in the past');
  }

  if (startDate >= endDate) {
    throw new BadRequestException('End date must be after start date');
  }

  const durationMinutes =
    (endDate.getTime() - startDate.getTime()) / (1000 * 60);

  if (durationMinutes < BOOKING_LIMITS.MIN_DURATION_MINUTES) {
    throw new BadRequestException(
      `Minimum booking duration is ${BOOKING_LIMITS.MIN_DURATION_MINUTES} minutes`,
    );
  }

  const durationHours = durationMinutes / 60;
  if (durationHours > BOOKING_LIMITS.MAX_DURATION_HOURS) {
    throw new BadRequestException(
      `Maximum booking duration is ${BOOKING_LIMITS.MAX_DURATION_HOURS} hours`,
    );
  }
}

export function primaryImageInclude() {
  return { where: { isPrimary: true }, take: 1 } as const;
}
