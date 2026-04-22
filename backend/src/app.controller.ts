import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Authorized, Public } from './common/decorators';
import { type User } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
