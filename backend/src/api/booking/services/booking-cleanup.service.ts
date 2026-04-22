import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { BookingStatus, Prisma } from '@prisma/client';

@Injectable()
export class BookingCleanupService {
  constructor(private readonly prismaService: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredBookings(): Promise<void> {
    await this.prismaService.$transaction(async (tx) => {
      const now = new Date();

      const expired = await tx.booking.findMany({
        where: { status: BookingStatus.BOOKING, endDate: { lte: now } },
        select: { id: true },
      });

      if (expired.length === 0) return;

      await tx.booking.updateMany({
        where: { id: { in: expired.map((b) => b.id) } },
        data: { status: BookingStatus.COMPLETED },
      });
    });
  }
}
