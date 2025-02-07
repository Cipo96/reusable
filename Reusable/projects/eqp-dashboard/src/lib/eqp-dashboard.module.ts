import { NgModule, ModuleWithProviders } from "@angular/core";
import { EqpDashboardComponent } from "./eqp-dashboard.component";
// import { DynamicFactory } from "./dynamicRoom/dynamic-factory/dynamic-factory.component";
import { DynamicDirective } from "./dynamicRoom/dynamic.directive";
import { CommonModule } from "@angular/common";


import { NgxEchartsModule } from 'ngx-echarts';

import { HttpClientModule } from '@angular/common/http';

import { FilterPipe } from './pipes/filter.pipe';
import { MaterialModule } from './modules/material.module';
import { FormsModule } from '@angular/forms';
import { ProgressBarColor } from './directives/progress-bar-color';
import { NgxMasonryModule } from 'ngx-masonry';
import { EqpDatetimerangepickerModule } from "@eqproject/eqp-datetimerangepicker";
import { EqpSelectModule } from "@eqproject/eqp-select";

// @dynamic
@NgModule({
  declarations: [EqpDashboardComponent, DynamicDirective, FilterPipe, ProgressBarColor],
  imports: [CommonModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    EqpDatetimerangepickerModule,
    EqpSelectModule,
    NgxMasonryModule,
    NgxEchartsModule.forRoot({
      echarts: chartModule
    })
  ],
  exports: [EqpDashboardComponent],
})
export class EqpDashboardModule { }

// @dynamic
export function chartModule(): any {
  return import('echarts');
}


