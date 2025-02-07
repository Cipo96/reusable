import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { NgSelectModule } from "@ng-select/ng-select";
import { DynamicLoaderDirective } from "./directives/dynamic-loader/dynamic-loader.directive";
import { EqpLookupComponent } from "./eqp-lookup.component";

@NgModule({
  declarations: [EqpLookupComponent, DynamicLoaderDirective],
  imports: [CommonModule, NgSelectModule, FormsModule, ReactiveFormsModule, HttpClientModule, MatDialogModule],
  exports: [EqpLookupComponent, DynamicLoaderDirective]
})
export class EqpLookupModule {}
