import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inquiry } from './schemas/inquiry.schema';
import { InquiryDocument } from './types/inquiry.type';
import { CreateInquiryDto, UpdateInquiryStatusDto } from './dto';

@Injectable()
export class InquiryService {
  constructor(
    @InjectModel(Inquiry.name) private inquiryModel: Model<Inquiry>,
  ) {}

  async create(dto: CreateInquiryDto): Promise<Inquiry> {
    return await this.inquiryModel.create(dto);
  }

  async findAll(): Promise<Inquiry[]> {
    return await this.inquiryModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<Inquiry> {
    const inquiry = await this.inquiryModel.findById(id).exec();
    if (!inquiry) {
      throw new NotFoundException('Inquiry not found');
    }
    return inquiry;
  }

  async updateStatus(
    id: string,
    dto: UpdateInquiryStatusDto,
  ): Promise<InquiryDocument> {
    const { status } = dto;
    const inquiry = await this.inquiryModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();

    if (!inquiry) {
      throw new NotFoundException('Inquiry not found');
    }
    return inquiry;
  }
}
