import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BoolLabelPosition, FormField, FormFieldType, LookupObject, SelectObject } from 'projects/eqp-common/src/public-api';
import { environment } from 'src/environments/environment';
import { GenderEnum } from '../app.component';
import { BaseFieldModel, BaseType, EqpCommonService } from 'projects/eqp-common/src/public-api';

@Component({
  selector: 'app-test-eqp-form',
  templateUrl: './test-eqp-form.component.html',
  styleUrl: './test-eqp-form.component.scss'
})
export class TestEqpFormComponent implements OnInit {

  formFields: Array<FormField> = new Array<FormField>();
  form: FormGroup;
  customFilterValue: string = null;
  @ViewChild("externalField", { static: true }) externalField: TemplateRef<any>;

  formBaseFields: Array<FormField>;
  baseField: Array<BaseFieldModel> = [
    { key: "Nome", display: "Nome", baseType: BaseType.Text },
    { key: "Cognome", display: "Cognome", baseType: BaseType.Text },
  ]

  lookupObject: LookupObject = {
    fullUrlHttpCall: environment.apiFullUrl + "/lookup/GetLookupEntities",
    lookupEntityType: "User",
    isLookupSearchable: true,
    isLookupMultiple: true,
  }

  selectObject: SelectObject = {
    arrayData: [{ chiave: 1, value: "Valore 1" },
    { chiave: 2, value: "Valore 2" },
    { chiave: 3, value: "Valore 3" }],
    arrayKeyProperty: "chiave",
    arrayValueProperty: "value"
  };

  constructor(private fb: FormBuilder) {
  }


  ngOnInit() {
    this.formFields = [
      { key: "Nome", display: "Nome", formFieldType: FormFieldType.Text, required: true, tooltip: { tooltipText: "Hint nome" }, validationProperties: { HintLabel: "Nome non valido", Valid: (property) => this.validation(property) } },
      { key: "Cognome", display: "Cognome", formFieldType: FormFieldType.Text, showInForm: true, required: true },
      { key: "Eta", display: "Età", formFieldType: FormFieldType.Number, required: true, orderPosition: 1 },
      { key: "Data", display: "Data", formFieldType: FormFieldType.Date },
      { key: "Datetime", display: "Data e ora", formFieldType: FormFieldType.DateTime },
      { key: "Range", display: "Range", formFieldType: FormFieldType.DateRange },
      { key: "Bool", display: "Bool", formFieldType: FormFieldType.Boolean, booleanLabelPosition: BoolLabelPosition.After },
      { key: "ExternalField", display: "ExternalField", formFieldType: FormFieldType.ExternalTemplate, externalTemplate: this.externalField },
      { key: "ID", display: "Lookup", formFieldType: FormFieldType.Lookup, lookupObject: this.lookupObject },
      { key: "Enum", display: "Genere", formFieldType: FormFieldType.Enum, enumModel: GenderEnum },
      { key: "Cvl", display: "Genere", formFieldType: FormFieldType.Cvl, selectObject: this.selectObject, validationProperties: { HintLabel: "Nome non valido", Valid: (property) => property != null } },
      { key: 'Cascata', display: 'Cascata', formFieldType: FormFieldType.Text, dependentFieldKey: 'Eta', dependentValidation: (value) => this.isAdult(value), showInForm: false }
    ];


    this.formBaseFields = EqpCommonService.convertAs<FormField>(this.baseField, FormField, ['Nome', 'Cognome']);

  }

  validation(event: any) {
    return event != "Andrea"
  }

  valueChange(event: any) {
  }

  disableField(): boolean {
    return true;
  }

  isAdult(age: any): boolean {
    const ageValue = parseInt(age, 10);
    return ageValue > 18;
  }

}
// const formGroupConfig = {};
// this.formFields.forEach(field => {

//   formGroupConfig[field.key] = [field.value || '', field.required ? Validators.required : null];
// });
// this.form = this.fb.group(formGroupConfig);
