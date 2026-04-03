import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { InquiryService } from './inquiry.service';
import { Inquiry } from './schemas/inquiry.schema';
import { InquiryStatus } from './enum/status.enum';

@Controller('inquiries')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @Post()
  create(@Body() dto: CreateInquiryDto): Promise<Inquiry> {
    return this.inquiryService.create(dto);
  }

  @Get()
  findAll(): Promise<Inquiry[]> {
    return this.inquiryService.findAll();
  }

  @Get(':id')
  findById(@Body() id: string): Promise<Inquiry> {
    return this.inquiryService.findById(id);
  }

  @Patch(':id/status')
  updateStatus(
  @Param('id') id: string,          
  @Body('status') status: InquiryStatus, 
  ) {
  return this.inquiryService.updateStatus(id, status);
}
}
