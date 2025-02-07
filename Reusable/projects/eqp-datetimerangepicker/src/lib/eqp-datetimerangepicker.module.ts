import {
  NGX_MAT_DATE_FORMATS,
  NgxMatDateAdapter,
  NgxMatDateFormats,
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from "@angular-material-components/datetime-picker";
import { NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS, NgxMatMomentModule } from "@angular-material-components/moment-adapter";
import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { CustomNgxDatetimeAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from "./CustomNgxDatetimeAdapter";
import { EqpDatetimerangepickerComponent } from "./eqp-datetimerangepicker.component";
import { EqpRangeHeaderComponent } from "./eqp-range-header/eqp-range-header.component";
import { EqpRangePanelComponent } from "./eqp-range-panel/eqp-range-panel.component";

const MY_FORMATS = {
  parse: {
    dateInput: "L"
  },
  display: {
    dateInput: "L",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};

const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: "L, LTS"
  },
  display: {
    dateInput: "L, LTS",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};

@NgModule({
  declarations: [EqpDatetimerangepickerComponent, EqpRangePanelComponent, EqpRangeHeaderComponent],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatInputModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatMomentModule,
    MatCardModule,
    MatFormFieldModule,
    NgxMatNativeDateModule,
    MatNativeDateModule,
    NgbModule,
    MatIconModule,
    TranslateModule,
    MatButtonModule
  ],
  exports: [EqpDatetimerangepickerComponent],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    {
      provide: NgxMatDateAdapter,
      useClass: CustomNgxDatetimeAdapter,
      deps: [MAT_DATE_LOCALE, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    //{provide: NgbTimeAdapter, useClass: NgbTimeStringAdapter }
    //{ provide: MAT_DATE_LOCALE, useValue: "en-US" }
  ]
})
export class EqpDatetimerangepickerModule {}
