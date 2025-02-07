import { NgModule } from '@angular/core';
import { EqpCalendarComponent } from './eqp-calendar.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
  declarations: [EqpCalendarComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule
  ],
  exports: [EqpCalendarComponent]
})
export class EqpCalendarModule { }
