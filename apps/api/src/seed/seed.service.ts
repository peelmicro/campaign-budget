import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from '../currency/currency.entity';
import { Channel } from '../channel/channel.entity';
import { EngagementRank } from '../channel/engagement-rank.enum';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedCurrencies();
    await this.seedChannels();
  }

  private async seedCurrencies(): Promise<void> {
    const count = await this.currencyRepository.count();
    if (count > 0) {
      this.logger.log('Currencies already seeded, skipping.');
      return;
    }

    const currencies: Partial<Currency>[] = [
      { code: 'USD', isoNumber: '840', symbol: '$', decimalPoints: 2 },
      { code: 'EUR', isoNumber: '978', symbol: '€', decimalPoints: 2 },
      { code: 'GBP', isoNumber: '826', symbol: '£', decimalPoints: 2 },
    ];

    await this.currencyRepository.save(currencies);
    this.logger.log(`Seeded ${currencies.length} currencies.`);
  }

  private async seedChannels(): Promise<void> {
    const count = await this.channelRepository.count();
    if (count > 0) {
      this.logger.log('Channels already seeded, skipping.');
      return;
    }

    const usd = await this.currencyRepository.findOneBy({ code: 'USD' });
    if (!usd) {
      this.logger.warn('USD currency not found, skipping channel seed.');
      return;
    }

    const channels: Partial<Channel>[] = [
      {
        code: 'VIDEO',
        description: 'Video Ads',
        cpm: 15.0,
        currencyId: usd.id,
        engagementRank: EngagementRank.HIGH,
      },
      {
        code: 'DISPLAY',
        description: 'Display Ads',
        cpm: 3.0,
        currencyId: usd.id,
        engagementRank: EngagementRank.MEDIUM,
      },
      {
        code: 'SOCIAL',
        description: 'Social Media Ads',
        cpm: 10.0,
        currencyId: usd.id,
        engagementRank: EngagementRank.LOW,
      },
    ];

    await this.channelRepository.save(channels);
    this.logger.log(`Seeded ${channels.length} channels.`);
  }
}
