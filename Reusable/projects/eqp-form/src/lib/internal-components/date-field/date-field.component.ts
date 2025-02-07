import { Moment } from 'moment';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormField, FormFieldType } from '@eqproject/eqp-common';
import { AbstractControl, FormGroup } from '@angular/forms';
import { PickerModeEnum } from '@eqproject/eqp-datetimerangepicker';

@Component({
  selector: 'form-date-field',
  templateUrl: './date-field.component.html',
  styleUrl: './date-field.component.scss'
})
export class DateFieldComponent {
  @Input() field: FormField;
  @Input() form: FormGroup;
  @Output() valueChanged: EventEmitter<{ key: string, value: Moment }> = new EventEmitter<{ key: string, value: Moment }>();
  pickerModeEnum = PickerModeEnum;
  formFieldType = FormFieldType;

  constructor() { }

  ngOnInit(): void {
  }

  get control(): AbstractControl {

    if (this.field.formFieldType == FormFieldType.DateRange)
      return this.form.get(this.field.key + "_START");
    else
      return this.form.get(this.field.key);
  }

  // Gestione degli eventi di input
  onInputChange(key: string, event: Moment): void {
    const inputValue = event;
    this.valueChanged.emit({ key, value: inputValue });
  }
}
