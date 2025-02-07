import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TestEqpAttachmentsComponent } from "./test-eqp-attachments/test-eqp-attachments.component";
import { TestEqpCalendarComponent } from "./test-eqp-calendar/test-eqp-calendar.component";
import { TestEqpDashboardComponent } from "./test-eqp-dashboard/test-eqp-dashboard.component";
import { TestEqpDatetimerangepickerComponent } from "./test-eqp-datetimerangepicker/test-eqp-datetimerangepicker.component";
import { TestEqpEditorComponent } from "./test-eqp-editor/test-eqp-editor.component";
import { TestEqpFiltersComponent } from "./test-eqp-filters/test-eqp-filter.component";
import { TestEqpNumericComponent } from "./test-eqp-numeric/test-eqp-numeric.component";
import { TestEqpSelectComponent } from "./test-eqp-select/test-eqp-select.component";
import { TestEqpTableComponent } from "./test-eqp-table/test-eqp-table.component";
import { TestImgDrawingComponent } from "./test-img-drawing/test-img-drawing.component";
import { TestEqpLookupComponent } from './test-eqp-lookup/test-eqp-lookup.component';
import { TestEqpUiComponent } from './test-eqp-ui/test-eqp-ui.component';
import { TestEqpFormComponent } from './test-eqp-form/test-eqp-form.component';
import { TestAllComponent } from "./test-all/test-all.component";

const routes: Routes = [
  {
    path: "test-attachments",
    component: TestEqpAttachmentsComponent
  },
  {
    path: "test-filters",
    component: TestEqpFiltersComponent
  },
  {
    path: "test-table",
    component: TestEqpTableComponent
  },
  {
    path: "test-editor",
    component: TestEqpEditorComponent
  },
  {
    path: "test-calendar",
    component: TestEqpCalendarComponent
  },
  {
    path: "test-select",
    component: TestEqpSelectComponent
  },
  {
    path: "test-numeric",
    component: TestEqpNumericComponent
  },
  {
    path: "test-img-drawing",
    component: TestImgDrawingComponent
  },
  {
    path: "test-dashboard",
    component: TestEqpDashboardComponent
  },
  {
    path: "test-datetimerangepicker",
    component: TestEqpDatetimerangepickerComponent
  },
  {
    path: 'test-lookup',
    component: TestEqpLookupComponent
  },
  {
    path: 'test-ui',
    component: TestEqpUiComponent,
    data: {
      title: 'Home'
    },
    children: [{
      path: 'test-table', component: TestEqpTableComponent,
      data: {
        title: 'Table'
      },
    }
    ],
  },
  {
    path: 'test-form',
    component: TestEqpFormComponent
  },
  {
    path: 'test-all',
    component: TestAllComponent
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
