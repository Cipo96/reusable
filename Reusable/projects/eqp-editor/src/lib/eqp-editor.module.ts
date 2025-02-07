import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { MaterialModule } from './modules/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EqpEditorComponent } from './eqp-editor.component';
import { ListBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { DocumentEditorContainerAllModule, DocumentEditorContainerModule, DocumentEditorModule } from '@syncfusion/ej2-angular-documenteditor';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
@NgModule({
  declarations: [EqpEditorComponent],
  imports: [
    TreeViewModule, 
    DocumentEditorContainerModule, 
    ListBoxAllModule, 
    DocumentEditorContainerAllModule, 
    DocumentEditorModule, 
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule, 
    MaterialModule,
    TranslateModule,
    HttpClientModule 
  ],
  exports: [EqpEditorComponent]
})
export class EqpEditorModule { 
}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
