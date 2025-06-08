import { BigNumber } from 'bignumber.js';

export class MoneyTransformer {
  to(data: number): string {
    if (data !== undefined && data !== null) {
      return new BigNumber(data).multipliedBy(100).integerValue().toString();
    }
    return "0";
  }

  from(data: string): number {
    if (data !== undefined && data !== null) {
      return new BigNumber(data).dividedBy(100).toNumber();
    }
    return 0;
  }
}