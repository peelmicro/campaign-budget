import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Currency } from '../currency/currency.entity';
import { CampaignGoal } from './campaign-goal.enum';
import { CampaignChannel } from './campaign-channel.entity';

@Entity()
export class Campaign {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  clientName: string;

  @Column({ type: 'varchar', length: 255 })
  managerName: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  budget: number;

  @ManyToOne(() => Currency, { eager: true })
  @JoinColumn({ name: 'currencyId' })
  currency: Currency;

  @Column()
  currencyId: number;

  @Column({ type: 'int' })
  days: number;

  @Column({ type: 'date' })
  fromDate: string;

  @Column({ type: 'date' })
  toDate: string;

  @Column({ type: 'enum', enum: CampaignGoal })
  goal: CampaignGoal;

  @OneToMany(() => CampaignChannel, (cc) => cc.campaign, { eager: true })
  channels: CampaignChannel[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
