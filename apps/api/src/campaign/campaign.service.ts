import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from './campaign.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { DistributionService } from '../distribution/distribution.service';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    private readonly distributionService: DistributionService,
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
    const saved = await this.campaignRepository.save(campaign);
    const full = await this.findOne(saved.id);
    await this.distributionService.distribute(full);
    return this.findOne(saved.id);
  }

  async update(id: number, dto: UpdateCampaignDto): Promise<Campaign> {
    const campaign = await this.findOne(id);
    Object.assign(campaign, dto);
    await this.campaignRepository.save(campaign);
    const full = await this.findOne(id);
    await this.distributionService.distribute(full);
    return this.findOne(id);
  }

  async redistribute(id: number): Promise<Campaign> {
    const campaign = await this.findOne(id);
    await this.distributionService.distribute(campaign);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const campaign = await this.findOne(id);
    await this.campaignRepository.remove(campaign);
  }
}
