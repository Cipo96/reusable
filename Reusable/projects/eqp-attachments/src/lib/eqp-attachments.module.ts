import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EqpAttachmentsComponent } from './eqp-attachments.component';
import { MaterialModule } from './modules/material.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { EqpTableModule } from '@eqproject/eqp-table';
import { NgxFileDropModule } from 'ngx-file-drop';

@NgModule({
  declarations: [EqpAttachmentsComponent],
  imports: [
    MaterialModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ImageCropperModule,
    EqpTableModule,
    NgxFileDropModule
  ],
  exports: [EqpAttachmentsComponent]
})
export class EqpAttachmentsModule { }
