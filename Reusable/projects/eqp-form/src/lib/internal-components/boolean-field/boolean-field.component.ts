import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BoolLabelPosition, FormField } from '@eqproject/eqp-common';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'form-boolean-field',
  templateUrl: './boolean-field.component.html',
  styleUrl: './boolean-field.component.scss'
})
export class BooleanFieldComponent {
  @Input() field: FormField;
  @Input() form: FormGroup;
  @Output() valueChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  boolLabelPosition = BoolLabelPosition;

  constructor() { }

  ngOnInit(): void {
  }

  get control(): AbstractControl {
    return this.form.get(this.field.key);
  }

  // Gestione degli eventi di input
  onInputChange(event: MatSlideToggleChange): void {
    const inputValue = (event.checked);
    this.valueChanged.emit(inputValue);
  }

  getLabelPosition(field: FormField): 'before' | 'after' {
    return field.booleanLabelPosition;
  }

}
