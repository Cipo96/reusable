import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EqpDatetimerangepickerModule } from "@eqproject/eqp-datetimerangepicker";
import { EqpLookupModule } from "@eqproject/eqp-lookup";
import { EqpSelectModule } from "@eqproject/eqp-select";
import { EqpFiltersComponent } from "./eqp-filters.component";
import { MaterialModule } from "./modules/material.module";

@NgModule({
  declarations: [EqpFiltersComponent],
  imports: [
    FormsModule,
    MaterialModule,
    CommonModule,
    EqpSelectModule,
    EqpLookupModule,
    EqpDatetimerangepickerModule,
    ReactiveFormsModule
  ],
  exports: [EqpFiltersComponent]
})
export class EqpFiltersModule {}
