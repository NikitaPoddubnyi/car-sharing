import { Prisma, BookingStatus } from '@prisma/client';

export function overlapWhere(
  startDate: Date,
  endDate: Date,
): Prisma.BookingWhereInput {
  return {
    status: { not: BookingStatus.CANCELLED },
    startDate: { lte: endDate },
    endDate: { gte: startDate },
  };
}

export function createBookingsFilter(startDate?: Date, endDate?: Date) {
  return startDate && endDate
    ? { none: overlapWhere(startDate, endDate) }
    : undefined;
}
