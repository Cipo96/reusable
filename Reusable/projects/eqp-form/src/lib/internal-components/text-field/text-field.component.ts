import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormField } from '@eqproject/eqp-common';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'form-text-field',
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.scss'
})
export class TextFieldComponent implements OnInit {
  @Input() field: FormField;
  @Input() form: FormGroup;
  @Output() valueChanged: EventEmitter<{ key: string, value: string }> = new EventEmitter<{ key: string, value: string }>();

  constructor() { }

  ngOnInit(): void {

  }

  get control(): AbstractControl {
    return this.form.get(this.field.key);
  }

  // Gestione degli eventi di input
  onInputChange(key: string, event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.valueChanged.emit({ key, value: inputValue });
  }
}
