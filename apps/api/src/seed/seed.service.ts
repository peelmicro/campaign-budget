import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from '../currency/currency.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedCurrencies();
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
}
