import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormField } from '@eqproject/eqp-common';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'form-lookup-field',
  templateUrl: './lookup-field.component.html',
  styleUrl: './lookup-field.component.scss'
})
export class LookupFieldComponent {
  @Input() field: FormField;
  @Input() form: FormGroup;
  @Output() valueChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    if (this.field.lookupObject == null)
      throw new Error("Missing lookupObject on field: " + this.field.key);

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
