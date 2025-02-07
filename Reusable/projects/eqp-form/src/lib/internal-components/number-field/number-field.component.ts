import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { FormField } from '@eqproject/eqp-common';

@Component({
  selector: 'form-number-field',
  templateUrl: './number-field.component.html',
  styleUrl: './number-field.component.scss'
})
export class NumberFieldComponent implements OnInit {
  @Input() field: FormField;
  @Input() form: FormGroup;
  @Output() valueChanged: EventEmitter<{ key: string, value: number }> = new EventEmitter<{ key: string, value: number }>();

  constructor() { }

  ngOnInit(): void {

  }

  get control(): AbstractControl {
    return this.form.get(this.field.key);
  }

  onInputChange(key: string, event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.valueChanged.emit({ key, value: Number(inputValue) });
  }
}
