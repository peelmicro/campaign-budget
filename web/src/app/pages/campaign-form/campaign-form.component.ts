import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CampaignService } from '../../services/campaign.service';
import { CampaignGoal } from '../../models/campaign.interface';

@Component({
  selector: 'app-campaign-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">
        {{ isEdit() ? 'Edit Campaign' : 'New Campaign' }}
      </h1>

      @if (service.error()) {
        <p class="text-red-600 bg-red-50 p-3 rounded mb-4">{{ service.error() }}</p>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4 bg-white p-6 rounded-lg shadow">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="code" class="block text-sm font-medium text-gray-700 mb-1">Code</label>
            <input id="code" formControlName="code" type="text"
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="goal" class="block text-sm font-medium text-gray-700 mb-1">Goal</label>
            <select id="goal" formControlName="goal"
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              @for (g of goals; track g) {
                <option [value]="g">{{ g }}</option>
              }
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="clientName" class="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
            <input id="clientName" formControlName="clientName" type="text"
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="managerName" class="block text-sm font-medium text-gray-700 mb-1">Manager Name</label>
            <input id="managerName" formControlName="managerName" type="text"
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="budget" class="block text-sm font-medium text-gray-700 mb-1">Budget</label>
            <input id="budget" formControlName="budget" type="number" min="0" step="0.01"
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="currencyId" class="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select id="currencyId" formControlName="currencyId"
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              @for (c of service.currencies(); track c.id) {
                <option [value]="c.id">{{ c.code }} ({{ c.symbol }})</option>
              }
            </select>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <label for="days" class="block text-sm font-medium text-gray-700 mb-1">Days</label>
            <input id="days" formControlName="days" type="number" min="1"
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="fromDate" class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input id="fromDate" formControlName="fromDate" type="date"
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="toDate" class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input id="toDate" formControlName="toDate" type="date"
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>

        <div class="flex items-center gap-3 pt-4">
          <button type="submit"
            [disabled]="form.invalid || service.loading()"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {{ service.loading() ? 'Saving...' : (isEdit() ? 'Update' : 'Create') }}
          </button>
          <a routerLink="/" class="text-gray-600 hover:text-gray-800">Cancel</a>
        </div>
      </form>
    </div>
  `,
})
export class CampaignFormComponent implements OnInit {
  readonly service = inject(CampaignService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly goals: CampaignGoal[] = ['REACH', 'ENGAGEMENT', 'BALANCED'];
  readonly campaignId = signal<number | null>(null);
  readonly isEdit = computed(() => this.campaignId() !== null);

  readonly form = this.fb.nonNullable.group({
    code: ['', Validators.required],
    clientName: ['', Validators.required],
    managerName: ['', Validators.required],
    budget: [0, [Validators.required, Validators.min(0.01)]],
    currencyId: [0, [Validators.required, Validators.min(1)]],
    days: [1, [Validators.required, Validators.min(1)]],
    fromDate: ['', Validators.required],
    toDate: ['', Validators.required],
    goal: ['REACH' as CampaignGoal, Validators.required],
  });

  ngOnInit(): void {
    this.service.loadCurrencies();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.campaignId.set(+id);
      const existing = this.service.campaigns().find((c) => c.id === +id);
      if (existing) {
        this.form.patchValue({
          code: existing.code,
          clientName: existing.clientName,
          managerName: existing.managerName,
          budget: +existing.budget,
          currencyId: existing.currencyId,
          days: existing.days,
          fromDate: existing.fromDate,
          toDate: existing.toDate,
          goal: existing.goal,
        });
      } else {
        this.service.getCampaign(+id);
      }
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const dto = {
      ...this.form.getRawValue(),
      currencyId: +this.form.getRawValue().currencyId,
    };

    const campaignId = this.campaignId();
    if (this.isEdit() && campaignId !== null) {
      this.service.updateCampaign(campaignId, dto, (campaign) => {
        this.router.navigate(['/campaigns', campaign.id]);
      });
    } else {
      this.service.createCampaign(dto, (campaign) => {
        this.router.navigate(['/campaigns', campaign.id]);
      });
    }
  }
}
