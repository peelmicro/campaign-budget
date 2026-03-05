import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CurrencyModule } from '../currency/currency.module';
import { ChannelModule } from '../channel/channel.module';
import { CampaignModule } from '../campaign/campaign.module';
import { SeedModule } from '../seed/seed.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'campaign_budget',
      autoLoadEntities: true,
      synchronize: true,
    }),
    CurrencyModule,
    ChannelModule,
    CampaignModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
