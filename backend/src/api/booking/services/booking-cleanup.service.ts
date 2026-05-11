import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingCleanupService {
  private readonly logger = new Logger(BookingCleanupService.name);

  constructor(private readonly prismaService: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredBookings(): Promise<void> {
    await this.withRetry(async () => {
      await this.prismaService.$transaction(
        async (tx) => {
          const now = new Date();

          const expired = await tx.booking.findMany({
            where: {
              status: BookingStatus.BOOKING,
              endDate: { lte: now },
            },
            select: { id: true },
            take: 1000,
          });

          if (expired.length === 0) return;

          await tx.booking.updateMany({
            where: { id: { in: expired.map((b) => b.id) } },
            data: { status: BookingStatus.COMPLETED },
          });

          this.logger.log(`Updated ${expired.length} expired bookings`);
        },
        {
          timeout: 10000,
        },
      );
    });
  }

  private async withRetry(fn: () => Promise<void>, retries = 3): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await fn();
        return;
      } catch (error) {
        if (attempt === retries) {
          this.logger.error(
            `Failed after ${retries} retries: ${error.message}`,
          );
          throw error;
        }
        this.logger.warn(
          `Retry ${attempt}/${retries} after error: ${error.message}`,
        );
        await this.delay(1000 * attempt);
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
