import { Injectable } from '@nestjs/common';
import { PrismaService } from './infra/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}
}
