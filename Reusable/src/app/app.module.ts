// import { registerLocaleData } from '@angular/common';
import { LOCALE_ID, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "src/modules/material.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from "@angular-material-components/datetime-picker";
import { registerLocaleData } from "@angular/common";
import localeIt from "@angular/common/locales/it";
import { MAT_DATE_LOCALE } from "@angular/material/core";
registerLocaleData(localeIt, "it-IT");

import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { EqpSelectModule } from "projects/eqp-select/src/public-api";
import { EqpNumericModule } from 'projects/eqp-numeric/src/lib/eqp-numeric.module';
import { EqpEditorModule } from 'projects/eqp-editor/src/lib/eqp-editor.module';
import { EqpFiltersModule } from "projects/eqp-filters/src/public-api";
import { EqpTableModule } from "projects/eqp-table/src/public-api";
import { EqpImgDrawingModule } from 'projects/eqp-img-drawing/src/public-api';
import { EqpDashboardModule } from 'projects/eqp-dashboard/src/public-api';
import { EqpCalendarModule } from 'projects/eqp-calendar/src/public-api';
import { EqpAttachmentsModule } from "projects/eqp-attachments/src/public-api";
import { EqpDatetimerangepickerModule } from "projects/eqp-datetimerangepicker/src/public-api";
import { EqpLookupModule } from "projects/eqp-lookup/src/public-api";
import { EqpUiModule } from "projects/eqp-ui/src/public-api";
import { EqpFormModule } from "projects/eqp-form/src/lib/eqp-form.module";

// import { EqpAttachmentsModule } from "@eqproject/eqp-attachments";
// import { EqpCalendarModule } from "@eqproject/eqp-calendar";
// import { EqpDashboardModule } from "@eqproject/eqp-dashboard";
// import { EqpEditorModule } from "@eqproject/eqp-editor";
// import { EqpFiltersModule } from "@eqproject/eqp-filters";
// import { EqpImgDrawingModule } from "@eqproject/eqp-img-drawing";
// import { EqpNumericModule } from "@eqproject/eqp-numeric";
// import { EqpSelectModule } from "@eqproject/eqp-select";
// import { EqpTableModule } from "@eqproject/eqp-table";
// import { EqpDatetimerangepickerModule } from "@eqproject/eqp-datetimerangepicker";
// import { EqpLookupModule } from "@eqproject/eqp-lookup";
// import { EqpUiModule } from "@eqproject/eqp-ui";

import { MatButtonModule } from "@angular/material/button";
import { TestEqpAttachmentsComponent } from "./test-eqp-attachments/test-eqp-attachments.component";
import { TestEqpCalendarComponent } from "./test-eqp-calendar/test-eqp-calendar.component";
import { TestEqpDashboardComponent } from "./test-eqp-dashboard/test-eqp-dashboard.component";
import { TestEqpDatetimerangepickerComponent } from "./test-eqp-datetimerangepicker/test-eqp-datetimerangepicker.component";
import { TestEqpEditorComponent } from "./test-eqp-editor/test-eqp-editor.component";
import { TestEqpFiltersComponent } from "./test-eqp-filters/test-eqp-filter.component";
import { AddQuestionComponent } from "./test-eqp-lookup/add-question/add-question.component";
import { TestEqpLookupComponent } from "./test-eqp-lookup/test-eqp-lookup.component";
import { TestEqpNumericComponent } from "./test-eqp-numeric/test-eqp-numeric.component";
import { TestEqpSelectComponent } from "./test-eqp-select/test-eqp-select.component";
import { TestEqpTableComponent } from "./test-eqp-table/test-eqp-table.component";
import { TestImgDrawingComponent } from "./test-img-drawing/test-img-drawing.component";
import { TestEqpUiComponent } from "./test-eqp-ui/test-eqp-ui.component";
import { TestEqpFormComponent } from "./test-eqp-form/test-eqp-form.component";
import { DefaultHeaderComponent } from "./test-eqp-ui/default-header/default-header.component";
import { DefaultFooterComponent } from "./test-eqp-ui/default-footer/default-footer.component";
import { TestAllComponent } from "./test-all/test-all.component";

@NgModule({
  declarations: [
    AppComponent,
    TestEqpTableComponent,
    TestEqpFiltersComponent,
    TestEqpAttachmentsComponent,
    TestEqpEditorComponent,
    TestEqpCalendarComponent,
    TestEqpSelectComponent,
    TestEqpNumericComponent,
    TestImgDrawingComponent,
    TestEqpDashboardComponent,
    TestEqpLookupComponent,
    AddQuestionComponent,
    TestEqpDatetimerangepickerComponent,
    TestEqpUiComponent,
    TestEqpFormComponent,
    TestAllComponent,
    DefaultHeaderComponent,
    DefaultFooterComponent
  ],
  imports: [
    MatButtonModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    EqpTableModule,
    EqpSelectModule,
    EqpEditorModule,
    EqpFiltersModule,
    EqpAttachmentsModule,
    EqpLookupModule,
    FormsModule,
    MaterialModule,
    FontAwesomeModule,
    EqpImgDrawingModule,
    EqpCalendarModule,
    EqpNumericModule,
    EqpDashboardModule,
    EqpDatetimerangepickerModule,
    EqpFormModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: false
    }),
    EqpUiModule
  ],
  providers: [HttpClient, { provide: MAT_DATE_LOCALE, useValue: "it-IT" }, { provide: LOCALE_ID, useValue: "it-IT" }],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
