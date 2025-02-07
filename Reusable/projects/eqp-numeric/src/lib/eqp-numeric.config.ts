import { InjectionToken } from "@angular/core";

export interface NumericMaskConfig {
  align: string;
  allowNegative: boolean;
  allowZero: boolean;
  decimal: string;
  precision: number;
  prefix: string;
  suffix: string;
  thousands: string;
  nullable: boolean;
  min?: number;
  max?: number;
  inputMode?: EqpNumericInputMode;
}

export enum EqpNumericInputMode {
  FINANCIAL,
  NATURAL
}

export let NUMERIC_MASK_CONFIG = new InjectionToken<NumericMaskConfig>("eqp.numeric.config");
