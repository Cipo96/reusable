import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormField } from '@eqproject/eqp-common';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'form-external-template-field',
  templateUrl: './external-template-field.component.html',
  styleUrl: './external-template-field.component.scss'
})
export class ExternalTemplateFieldComponent {
  @Input() field: FormField;
  @Input() form: FormGroup;
  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  get control(): AbstractControl {
    return this.form.get(this.field.key);
  }

  // Gestione degli eventi di input
  onInputChange(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.valueChanged.emit(inputValue);
  }
}
