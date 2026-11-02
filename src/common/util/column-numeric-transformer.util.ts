import { ValueTransformer } from 'typeorm';

export class ColumnNumericTransformer implements ValueTransformer {
  // To database: just pass the number as is
  to(data: number): number {
    return data;
  }

  // From database: convert the string back to a float/number
  from(data: string): number {
    return parseFloat(data);
  }
}
