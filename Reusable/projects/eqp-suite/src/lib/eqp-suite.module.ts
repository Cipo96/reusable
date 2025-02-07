import { NgModule } from '@angular/core';
import { EqpAttachmentsModule } from '@eqproject/eqp-attachments';
import { EqpDashboardModule } from '@eqproject/eqp-dashboard';
import { EqpFiltersModule } from '@eqproject/eqp-filters';
import { EqpImgDrawingModule } from '@eqproject/eqp-img-drawing';
import { EqpNumericModule } from '@eqproject/eqp-numeric';
import { EqpCalendarModule } from '@eqproject/eqp-calendar';

import { EqpSelectModule } from '@eqproject/eqp-select';
import { EqpTableModule } from '@eqproject/eqp-table';
import { MaterialModule } from './module/material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { EqpSuiteComponent } from './eqp-suite.component';
import { EqpLookupModule } from '@eqproject/eqp-lookup';


@NgModule({
  declarations: [
    EqpSuiteComponent
  ],
  imports: [
    FormsModule,
    MaterialModule,
    CommonModule,
    EqpSelectModule,
    EqpNumericModule,
    EqpImgDrawingModule,
    EqpTableModule,
    EqpCalendarModule,
    EqpFiltersModule,
    EqpAttachmentsModule,
    EqpDashboardModule,
    EqpLookupModule
  ],
  exports: [
    EqpSelectModule,
    EqpNumericModule,
    EqpImgDrawingModule,
    EqpTableModule,
    EqpCalendarModule,
    EqpFiltersModule,
    EqpAttachmentsModule,
    EqpDashboardModule,
    EqpLookupModule
  ]
})
export class EqpSuiteModule { }
