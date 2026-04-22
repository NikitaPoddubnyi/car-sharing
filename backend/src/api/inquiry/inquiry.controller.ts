import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { Inquiry } from './schemas/inquiry.schema';
import { InquiryStatus } from './enum/status.enum';
import { Authorization } from 'src/common/decorators';
import { UserRole } from '@prisma/client';
import { CreateInquiryDto, UpdateInquiryStatusDto } from './dto';

@Controller('inquiries')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @Post()
  async create(@Body() dto: CreateInquiryDto): Promise<Inquiry> {
    return await this.inquiryService.create(dto);
  }

  @Get()
  async findAll(): Promise<Inquiry[]> {
    return await this.inquiryService.findAll();
  }

  @Authorization(UserRole.ADMIN)
  @Get(':id')
  async findById(@Param() id: string): Promise<Inquiry> {
    return await this.inquiryService.findById(id);
  }

  @Authorization(UserRole.ADMIN)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateInquiryStatusDto,
  ): Promise<Inquiry> {
    return await this.inquiryService.updateStatus(id, dto);
  }
}
