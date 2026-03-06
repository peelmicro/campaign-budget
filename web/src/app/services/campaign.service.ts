import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Campaign, CreateCampaignDto } from '../models/campaign.interface';
import { Currency } from '../models/currency.interface';

@Injectable({ providedIn: 'root' })
export class CampaignService {
  private readonly http = inject(HttpClient);

  readonly campaigns = signal<Campaign[]>([]);
  readonly currencies = signal<Currency[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  loadCampaigns(): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<Campaign[]>('/api/campaigns').subscribe({
      next: (data) => {
        this.campaigns.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  loadCurrencies(): void {
    this.http.get<Currency[]>('/api/currencies').subscribe({
      next: (data) => this.currencies.set(data),
    });
  }

  getCampaign(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<Campaign>(`/api/campaigns/${id}`).subscribe({
      next: (data) => {
        this.campaigns.update((list) => {
          const index = list.findIndex((c) => c.id === data.id);
          return index >= 0
            ? list.map((c) => (c.id === data.id ? data : c))
            : [...list, data];
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  createCampaign(dto: CreateCampaignDto, onSuccess: (campaign: Campaign) => void): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.post<Campaign>('/api/campaigns', dto).subscribe({
      next: (data) => {
        this.campaigns.update((list) => [...list, data]);
        this.loading.set(false);
        onSuccess(data);
      },
      error: (err) => {
        this.error.set(err.error?.message?.join?.(', ') || err.message);
        this.loading.set(false);
      },
    });
  }

  updateCampaign(id: number, dto: Partial<CreateCampaignDto>, onSuccess: (campaign: Campaign) => void): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.patch<Campaign>(`/api/campaigns/${id}`, dto).subscribe({
      next: (data) => {
        this.campaigns.update((list) =>
          list.map((c) => (c.id === data.id ? data : c)),
        );
        this.loading.set(false);
        onSuccess(data);
      },
      error: (err) => {
        this.error.set(err.error?.message?.join?.(', ') || err.message);
        this.loading.set(false);
      },
    });
  }

  redistribute(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.post<Campaign>(`/api/campaigns/${id}/distribute`, {}).subscribe({
      next: (data) => {
        this.campaigns.update((list) =>
          list.map((c) => (c.id === data.id ? data : c)),
        );
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  deleteCampaign(id: number, onSuccess: () => void): void {
    this.loading.set(true);
    this.http.delete(`/api/campaigns/${id}`).subscribe({
      next: () => {
        this.campaigns.update((list) => list.filter((c) => c.id !== id));
        this.loading.set(false);
        onSuccess();
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }
}
