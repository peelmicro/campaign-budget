import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { Currency } from './currency.entity';

@Controller('currencies')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  findAll(): Promise<Currency[]> {
    return this.currencyService.findAll();
  }

  @Get('code/:code')
  findByCode(@Param('code') code: string): Promise<Currency> {
    return this.currencyService.findByCode(code.toUpperCase());
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Currency> {
    return this.currencyService.findOne(id);
  }
}
