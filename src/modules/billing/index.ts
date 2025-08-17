import { BillingMethodController } from '@/modules/billing/infrastructure/controllers';
import { Elysia } from 'elysia';

export const BillingModule = new Elysia({ name: 'billing-module' })
.use(BillingMethodController);
