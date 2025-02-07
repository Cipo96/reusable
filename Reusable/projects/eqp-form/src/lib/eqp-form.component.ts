import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormField, FormFieldType } from '@eqproject/eqp-common';
import { EqpCommonService } from '@eqproject/eqp-common';

@Component({
  selector: 'eqp-form',
  templateUrl: 'eqp-form.component.html',
  styleUrls: ['eqp-form.component.scss']
})
export class EqpFormComponent implements OnInit, OnChanges {

  @Input() fields: FormField[];
  @Input() record: any;
  @Input() disabledForm: boolean;
  form: FormGroup;
  formFieldType = FormFieldType;
  @Output() valueChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() submitEvent: EventEmitter<object> = new EventEmitter<object>();

  @Input("resetFormLabel") resetFormLabel: string = "Reset";
  @Input("submitFormLabel") submitFormLabel: string = "Salva";

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef, public eqpCommonService: EqpCommonService) {
  }

  ngOnInit(): void {

    if (this.fields == null)
      return;

    //Ordino l'array secondo l'order definito dall'utente
    this.fields = this.sortArrayByOrder(this.fields);

    this.form = this.createFormGroup();
    this.cd.detectChanges();

    this.subscribeToValueChanges();
  }

  /**
   * Creo il formGroup dinamicamente a seconda delle key presenti e se non sono stati specificati showInForm
   * inoltre aggiungo qui le validazioni
   * @returns
   */
  private createFormGroup(): FormGroup {
    const group: any = {};

    //Se è stato passato un array di BaseField, lo converto nell'oggetto base corretto
    if (EqpCommonService.isBaseField(this.fields))
      this.fields = EqpCommonService.convertAs<FormField>(this.fields, FormField, this.fields.map(x => x.key));

    this.fields.filter(x => x.showInForm != false).forEach(field => {
      const validators = [];
      let disabled = !!field.disabled || false;
      let fieldValue = this.record ? this.record[field.key] : field.value || null;

      if (this.disabledForm == true)
        disabled = true;

      if (field.validationProperties && field.validationProperties.Valid) {
        validators.push(this.customValidator(field.validationProperties.Valid as (property: any) => boolean));
      }

      if (field.required) {
        const HintLabel = field.validationProperties && field.validationProperties.HintLabel ? field.validationProperties.HintLabel : "Campo obbligatorio";
        validators.push(Validators.required);
        field.validationProperties = { HintLabel, Valid: () => fieldValue != null }
      }

      //Se è di tipo range, devo creare due key e assegnare eventualmente il valore
      //bypassando la generazione normale usata per gli altri tipi
      if (field.formFieldType == FormFieldType.DateRange) {
        group[field.key + '_START'] = [{ value: fieldValue != null ? fieldValue.from : null, disabled: disabled }, validators];
        group[field.key + '_END'] = [{ value: fieldValue != null ? fieldValue.to : null, disabled: disabled }, validators];
      } else {
        // Imposto il valore predefinito per i campi booleani su false se non specificato
        if (field.formFieldType == FormFieldType.Boolean.valueOf() && (fieldValue == null || fieldValue == undefined)) {
          fieldValue = false;
        }

        group[field.key] = [{ value: fieldValue != null ? fieldValue : null, disabled: disabled }, validators];
      }
    });

    return this.fb.group(group);
  }

  private updateFormGroup(field: any): void {
    debugger
    const control = this.form.get(field.key);
    if (field.showInForm && !control) {
      // Se il campo deve essere visibile e non esiste ancora nella form, aggiungilo
      // const validators = this.getValidatorsForField(field); // Ottieni i validatori per il campo
      const initialValue = this.record ? this.record[field.key] : field.value || null; // Ottieni il valore iniziale
      this.form.addControl(field.key, this.fb.control(initialValue));
    } else if (!field.showInForm) {
      // Se il campo non deve essere visibile o se showInForm è impostato su false, rimuovilo dalla form
      this.form.removeControl(field.key);
    }
  }

  // updateFormGroup(): void {
  //   const group: any = {};
  //   const self = this;

  //   this.fields.forEach(field => {
  //     if (field.showInForm != false) {
  //       // Aggiungi solo i campi visibili al formGroup
  //       const control = self.form.get(field.key);

  //       if (control) {
  //         // Mantieni il valore attuale del campo prima di aggiornare il controllo
  //         const currentValue = control.value;

  //         // Aggiorna il controllo nel gruppo
  //         group[field.key] = [{ value: currentValue, disabled: control?.disabled }, control.validator];
  //       } else {
  //         // Se il controllo non esiste nel formGroup, aggiungilo al gruppo con il valore iniziale null
  //         group[field.key] = [null, []];
  //       }
  //     } else {
  //       // Rimuovi i campi non visibili dal formGroup
  //       this.form.removeControl(field.key);
  //     }
  //   });

  //   // Aggiorna il formGroup con i nuovi controlli
  //   this.form = this.fb.group({ ...group });
  // }

  // Aggiorna i valori del form con i nuovi dati
  private updateForm(): void {
    if (this.form) {
      this.form.patchValue(this.record);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.record && !changes.record.firstChange) {
      this.updateForm();
    }
  }

  /**
   * Emit del sotto componente che si sta utilizzando
   * @param value
   */
  handleValueChanged(value: any): void {
    this.valueChanged.emit(value);
  }

  /**
   * Validazioni custom definite dall'utente
   * @param validatorFn
   * @returns
   */
  customValidator(validatorFn: (property: any) => boolean): any {
    return (control: FormControl) => {
      const isValid = validatorFn(control.value);
      return isValid ? null : { 'customValidation': true };
    };
  }

  subscribeToValueChanges(): void {
    this.fields.forEach(field => {
      if (field.dependentFieldKey) {
        const dependentFieldControl = this.form.get(field.dependentFieldKey);
        if (dependentFieldControl) {
          dependentFieldControl.valueChanges.subscribe(value => {
            const dependentField = this.fields.find(f => f.key === field.key);
            if (dependentField) {
              dependentField.showInForm = field.dependentValidation(value);
              // this.updateForm()
              this.updateFormGroup(dependentField);
            }
          });
        }
      }
    });
  }

  /**
   * Al submit, invio l'oggetto form, valutare se inviare a prescindere o solo se valida
   * contestualmente faccio l'emit dell'oggetto in modo da poter fare ulteriori controlli custom
   * qualora ce ne fosse bisogno
   */
  onSubmit(): void {
    this.fields.filter(field => field.showInForm != false).forEach(field => {
      const control = this.form.get(field.key);
      if (control) {
        // Imposta il controllo come "touched" per visualizzare i messaggi di errore
        control.markAsTouched();
      }
    });

    if (this.form.valid)
      this.submitEvent.emit(this.form.getRawValue());

  }

  /**
   * Reset dei campo presenti nel form
   * non posso usare il reset dell'intera form in quanto c'è da gestire
   * il caso boolean a false (in futuro potrebbero esserci altri controlli)
   */
  resetForm(): void {
    // this.form.reset();
    this.fields.filter(field => field.showInForm != false).forEach(field => {
      const control = this.form.get(field.key);
      if (control) {
        control.reset();
      }

      if (field.formFieldType == FormFieldType.Boolean)
        control.setValue(false);
    });
  }

  /**
   * Sorts the given array of FormField objects by their orderPosition property.
   * If a FormField object's orderPosition is null, it is placed at the end of the sorted array.
   * @param fields The array of FormField objects to be sorted.
   * @returns The sorted array of FormField objects.
   */
  private sortArrayByOrder(fields: FormField[]): FormField[] {

    fields.sort(function (a, b) {
      if (a.orderPosition == null && b.orderPosition == null) {
        return 0;
      }
      if (a.orderPosition == null) {
        return 1;
      }
      if (b.orderPosition == null) {
        return -1;
      }

      return a.orderPosition - b.orderPosition;
    });

    return fields;
  }

}
