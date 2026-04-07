import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { InquiryService } from './inquiry.service';
import { Inquiry } from './schemas/inquiry.schema';
import { InquiryStatus } from './enum/status.enum';

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

  @Get(':id')
  async findById(@Param() id: string): Promise<Inquiry> {
    return await this.inquiryService.findById(id);
  }

  @Patch(':id/status')
  async updateStatus(
  @Param('id') id: string,          
  @Body('status') status: InquiryStatus, 
  ): Promise<Inquiry> {
  return await this.inquiryService.updateStatus(id, status);
}
}
