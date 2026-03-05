import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { Campaign } from './campaign.entity';
import { CampaignGoal } from './campaign-goal.enum';
import { DistributionService } from '../distribution/distribution.service';

const mockCampaign: Partial<Campaign> = {
  id: 1,
  code: 'CAMP-001',
  clientName: 'Acme Corp',
  managerName: 'John Doe',
  budget: 10000,
  currencyId: 1,
  days: 30,
  fromDate: '2026-04-01',
  toDate: '2026-04-30',
  goal: CampaignGoal.REACH,
  channels: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockCampaigns = [mockCampaign];

const mockRepository = {
  find: vi.fn().mockResolvedValue(mockCampaigns),
  findOneBy: vi.fn(),
  create: vi.fn(),
  save: vi.fn(),
  remove: vi.fn(),
};

const mockDistributionService = {
  distribute: vi.fn().mockResolvedValue([]),
};

describe('CampaignService', () => {
  let service: CampaignService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignService,
        { provide: getRepositoryToken(Campaign), useValue: mockRepository },
        { provide: DistributionService, useValue: mockDistributionService },
      ],
    }).compile();

    service = module.get<CampaignService>(CampaignService);
  });

  describe('findAll', () => {
    it('should return an array of campaigns', async () => {
      const result = await service.findAll();
      expect(result).toEqual(mockCampaigns);
      expect(mockRepository.find).toHaveBeenCalledOnce();
    });
  });

  describe('findOne', () => {
    it('should return a campaign by id', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockCampaign);
      const result = await service.findOne(1);
      expect(result).toEqual(mockCampaign);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException when campaign not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a campaign and call distribute', async () => {
      const dto = {
        code: 'CAMP-001',
        clientName: 'Acme Corp',
        managerName: 'John Doe',
        budget: 10000,
        currencyId: 1,
        days: 30,
        fromDate: '2026-04-01',
        toDate: '2026-04-30',
        goal: CampaignGoal.REACH,
      };
      mockRepository.create.mockReturnValue(mockCampaign);
      mockRepository.save.mockResolvedValue(mockCampaign);
      mockRepository.findOneBy.mockResolvedValue(mockCampaign);

      const result = await service.create(dto);
      expect(result).toEqual(mockCampaign);
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockCampaign);
      expect(mockDistributionService.distribute).toHaveBeenCalledWith(mockCampaign);
    });
  });

  describe('update', () => {
    it('should update the campaign and call distribute', async () => {
      const updated = { ...mockCampaign, budget: 20000 };
      mockRepository.findOneBy.mockResolvedValue({ ...mockCampaign });
      mockRepository.save.mockResolvedValue(updated);

      const result = await service.update(1, { budget: 20000 });
      expect(result).toEqual(updated);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockDistributionService.distribute).toHaveBeenCalled();
    });

    it('should throw NotFoundException when updating non-existent campaign', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(service.update(999, { budget: 20000 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('redistribute', () => {
    it('should call distribute and return the campaign', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockCampaign);

      const result = await service.redistribute(1);
      expect(result).toEqual(mockCampaign);
      expect(mockDistributionService.distribute).toHaveBeenCalledWith(mockCampaign);
    });

    it('should throw NotFoundException for non-existent campaign', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(service.redistribute(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the campaign', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockCampaign);
      mockRepository.remove.mockResolvedValue(undefined);

      await service.remove(1);
      expect(mockRepository.remove).toHaveBeenCalledWith(mockCampaign);
    });

    it('should throw NotFoundException when removing non-existent campaign', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
