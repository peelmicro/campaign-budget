import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from './campaign.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
  ) {}

  findAll(): Promise<Campaign[]> {
    return this.campaignRepository.find();
  }

  async findOne(id: number): Promise<Campaign> {
    const campaign = await this.campaignRepository.findOneBy({ id });
    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }
    return campaign;
  }

  async create(dto: CreateCampaignDto): Promise<Campaign> {
    const campaign = this.campaignRepository.create(dto);
    return this.campaignRepository.save(campaign);
  }

  async update(id: number, dto: UpdateCampaignDto): Promise<Campaign> {
    const campaign = await this.findOne(id);
    Object.assign(campaign, dto);
    return this.campaignRepository.save(campaign);
  }

  async remove(id: number): Promise<void> {
    const campaign = await this.findOne(id);
    await this.campaignRepository.remove(campaign);
  }
}
