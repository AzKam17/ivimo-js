import BigNumber from 'bignumber.js';

export class ColumnNumericTransformer {
  to(data: number): number {
    if (data !== undefined && data !== null) {
      return new BigNumber(data).toNumber();
    }
    return 0;
  }

  from(data: string): number {
    if (data !== undefined && data !== null) {
      return new BigNumber(data).toNumber();
    }
    return 0;
  }
}
