import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './modules/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EqpFormComponent } from './eqp-form.component';
import { TextFieldComponent } from './internal-components/text-field/text-field.component';
import { NumberFieldComponent } from './internal-components/number-field/number-field.component';
import { BooleanFieldComponent } from './internal-components/boolean-field/boolean-field.component';
import { ExternalTemplateFieldComponent } from './internal-components/external-template-field/external-template-field.component';
import { DateFieldComponent } from './internal-components/date-field/date-field.component';
import { SelectFieldComponent } from './internal-components/select-field/select-field.component';
import { LookupFieldComponent } from './internal-components/lookup-field/lookup-field.component';
import { EqpDatetimerangepickerModule } from '@eqproject/eqp-datetimerangepicker';
import { EqpLookupModule } from '@eqproject/eqp-lookup';
import { EqpSelectModule } from '@eqproject/eqp-select';

@NgModule({
  imports: [
    FormsModule,
    MaterialModule,
    CommonModule,
    EqpSelectModule,
    EqpLookupModule,
    EqpDatetimerangepickerModule,
    ReactiveFormsModule,
    TranslateModule],
  declarations: [
    EqpFormComponent,
    TextFieldComponent,
    NumberFieldComponent,
    BooleanFieldComponent,
    ExternalTemplateFieldComponent,
    DateFieldComponent,
    SelectFieldComponent,
    LookupFieldComponent,
    SelectFieldComponent
  ],
  exports: [EqpFormComponent]
})
export class EqpFormModule {


}
