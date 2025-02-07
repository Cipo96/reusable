import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { EqpSelectComponent } from "./eqp-select.component";
import { MaterialModule } from "./modules/material.module";
import { EqpLookupModule } from "@eqproject/eqp-lookup";

@NgModule({
  declarations: [EqpSelectComponent],
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    TranslateModule,
    EqpLookupModule
  ],
  exports: [EqpSelectComponent]
})
export class EqpSelectModule {}

export function HttpLoaderFactory(http: HttpClient) {
  // return new TranslateHttpLoader(http);
}
