import { TranslateTableHelper } from './helpers/translateTable.helper';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './modules/material.module';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { EqpTableComponent } from './eqp-table.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DateAdapter } from '@angular/material/core';
import { MatTableExporterModule } from 'mat-table-exporter';
import { EqpTableExporterComponent } from './internal-components/eqp-table-exporter/eqp-table-exporter.component';
import { EqpTableBooleanColumnComponent } from './internal-components/boolean-column/boolean-column.component';
import { EqpTableColorColumnComponent } from './internal-components/color-column/color-column.component';
import { EqpTableDateColumnComponent } from './internal-components/date-column/date-column.component';
import { EqpTableEnumColumnComponent } from './internal-components/enum-column/enum-column.component';
import { EqpTableCheckboxColumnComponent } from './internal-components/checkbox-column/checkbox-column.component';
import { EqpTableIconColumnComponent } from './internal-components/icon-column/icon-column.component';
import { EqpTableHyperlinkColumnComponent } from './internal-components/hyperlink-column/hyperlink-column.component';
import { EqpTableImageColumnComponent } from './internal-components/image-column/image-column.component';
import { EqpTableStandardColumnComponent } from './internal-components/standard-column/standard-column.component';
import { EqpTableBaseComponent } from './internal-components/base-component/base.component';
import { GotoPageDirective } from './directives/goto-page.directive';
import { CustomButtonsComponent } from './internal-components/custom-buttons/custom-buttons.component';
import { EqpTableFilterComponent } from './internal-components/filter-component/filter.component';
import { EqpFiltersModule } from '@eqproject/eqp-filters';

@NgModule({
  declarations: [
    EqpTableComponent,
    EqpTableBaseComponent,
    EqpTableExporterComponent,
    EqpTableStandardColumnComponent,
    EqpTableBooleanColumnComponent,
    EqpTableColorColumnComponent,
    EqpTableDateColumnComponent,
    EqpTableEnumColumnComponent,
    EqpTableCheckboxColumnComponent,
    EqpTableIconColumnComponent,
    EqpTableHyperlinkColumnComponent,
    EqpTableImageColumnComponent,
    GotoPageDirective,
    CustomButtonsComponent,
    EqpTableFilterComponent
  ],
  imports: [MaterialModule, CommonModule, TranslateModule, FormsModule, MatTableExporterModule, EqpFiltersModule],
  exports: [EqpTableComponent]
})
export class EqpTableModule {

  constructor(private adapter: DateAdapter<any>, private translateHelper: TranslateTableHelper) {
    let currentLanguage = this.translateHelper.getCurrentLanguage();
    this.setDateAdapterLocale(currentLanguage);
  }

  setDateAdapterLocale(localeString: string): void {
    this.adapter.setLocale(localeString);
  }

  static forRoot(): ModuleWithProviders<EqpTableModule> {
    return {
      ngModule: EqpTableModule,
      providers: []
    }
  }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
