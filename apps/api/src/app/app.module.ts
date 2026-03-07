import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CurrencyModule } from '../currency/currency.module';
import { ChannelModule } from '../channel/channel.module';
import { CampaignModule } from '../campaign/campaign.module';
import { DistributionModule } from '../distribution/distribution.module';
import { SeedModule } from '../seed/seed.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env['DB_HOST'] || 'localhost',
      port: Number(process.env['DB_PORT']) || 3306,
      username: process.env['DB_USER'] || 'root',
      password: process.env['DB_PASSWORD'] || 'root',
      database: process.env['DB_NAME'] || 'campaign_budget',
      autoLoadEntities: true,
      synchronize: true,
    }),
    CurrencyModule,
    ChannelModule,
    CampaignModule,
    DistributionModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
