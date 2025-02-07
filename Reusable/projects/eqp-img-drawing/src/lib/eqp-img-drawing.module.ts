import { NgModule } from '@angular/core';
import { EqpImgDrawingComponent } from './eqp-img-drawing.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [EqpImgDrawingComponent],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [EqpImgDrawingComponent]
})
export class EqpImgDrawingModule { }
