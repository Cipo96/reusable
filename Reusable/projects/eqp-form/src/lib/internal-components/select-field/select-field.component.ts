import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormField, FormFieldType } from '@eqproject/eqp-common';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'form-select-field',
  templateUrl: './select-field.component.html',
  styleUrl: './select-field.component.scss'
})
export class SelectFieldComponent {
  @Input() field: FormField;
  @Input() form: FormGroup;
  @Output() valueChanged: EventEmitter<any> = new EventEmitter<any>();
  formFieldType = FormFieldType;

  constructor() { }

  ngOnInit(): void {
    if (this.field.selectObject == null && this.field.formFieldType != FormFieldType.Enum)
      throw new Error("Missing selectObject on field: " + this.field.key);

  }

  get control(): AbstractControl {
    return this.form.get(this.field.key);
  }

  // Gestione degli eventi di input
  onInputChange(event: any): void {
    const inputValue = event;
    this.valueChanged.emit(inputValue);
  }
}
