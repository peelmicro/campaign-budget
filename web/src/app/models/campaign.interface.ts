import { CampaignChannel } from './campaign-channel.interface';
import { Currency } from './currency.interface';

export type CampaignGoal = 'REACH' | 'ENGAGEMENT' | 'BALANCED';

export interface Campaign {
  id: number;
  code: string;
  clientName: string;
  managerName: string;
  budget: number;
  currencyId: number;
  currency: Currency;
  days: number;
  fromDate: string;
  toDate: string;
  goal: CampaignGoal;
  channels: CampaignChannel[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignDto {
  code: string;
  clientName: string;
  managerName: string;
  budget: number;
  currencyId: number;
  days: number;
  fromDate: string;
  toDate: string;
  goal: CampaignGoal;
}
