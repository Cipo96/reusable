import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NumericMaskConfig, NUMERIC_MASK_CONFIG } from "./eqp-numeric.config";
import { EqpNumericDirective } from './eqp-numeric.directive';
@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [EqpNumericDirective],
  exports: [EqpNumericDirective]
})

export class EqpNumericModule {
  static forRoot(config: NumericMaskConfig): ModuleWithProviders<EqpNumericModule> {
    return {
      ngModule: EqpNumericModule,
      providers: [{
        provide: NUMERIC_MASK_CONFIG,
        useValue: config,
      }]
    }
  }
}
