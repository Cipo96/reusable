import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EqpNumericInputMode } from '@eqproject/eqp-numeric';

@Component({
  selector: 'app-test-eqp-numeric',
  templateUrl: './test-eqp-numeric.component.html',
  styleUrls: ['./test-eqp-numeric.component.scss']
})
export class TestEqpNumericComponent implements OnInit {

  @ViewChild('valueInput', { static: true }) valueInput: ElementRef;

  public form: FormGroup;
  public eqpNumericOptions = {
    prefix: '€ ',
    thousands: '.',
    decimal: ',',
    allowNegative: true,
    nullable: true,
    max: 250_000_000,
    precision: 2,
    inputMode: EqpNumericInputMode.NATURAL,
  };

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      value: null,
      inputMode: this.eqpNumericOptions.inputMode,
    });

    this.form.get('inputMode').valueChanges.subscribe(val => {
      this.eqpNumericOptions.inputMode = val;

      // Clear and focus the value input when the input mode is changed.container
      this.form.get('value').setValue(null);
      this.valueInput.nativeElement.focus();
    });

    // Focus on the value input when the demo starts.
    this.valueInput.nativeElement.focus();
  }
}
