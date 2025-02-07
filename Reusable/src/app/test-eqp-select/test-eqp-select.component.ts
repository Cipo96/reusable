import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { TranslateService } from "@ngx-translate/core";
import { EqpSelectComponent, TranslateSelectHelper } from "projects/eqp-select/src/public-api";
import { GenderEnum } from "../app.component";

@Component({
  selector: "app-test-eqp-select",
  templateUrl: "./test-eqp-select.component.html",
  styleUrls: ["./test-eqp-select.component.scss"]
})
export class TestEqpSelectComponent implements OnInit {
  testEnum = TestEnum;

  selectWithArrayData: any;

  selectWithEnumData: any;

  selectWithEnumAndSelectAll: any;

  selectWithArrayAndSelectAll: any;

  selectPopulatedWithEnum: any = TestEnum.ITALY;
  selectPopulatedWithArray: any = { Key: 1, Company: { Denomination: "Primo", Vat: "123" }, extra: "ciao1" };
  selectPopulatedWithEnumAndSelectAll: any = [1];
  selectPopulatedWithArrayAndSelectAll: any = [
    { Key: 1, Company: { Denomination: "Primo", Vat: "123" }, extra: "ciao1" }
  ];

  dataSource: Array<any> = new Array<any>();

  primitiveArrayData: Array<string> = ["ciao", "pippo", "paperino", "topolino"];

  selectWithPrimitiveArray: any;
  selectPopulatedWithPrimitiveArray: any = "pippo";
  selectPopulatedWithPrimitiveArrayAndSelectAll: any = ["paperino"];

  selectWithEnumAndEnumDataToExclude: any;

  formSelect: FormGroup;

  genderEnum = GenderEnum;

  multiSelectWithTranslation: any;
  singleSelectWithTranslation: any;

  @ViewChild("selectWithExclude", { static: false }) selectWithExclude: EqpSelectComponent;
  enumDataToExclude: number[] = [];

  @ViewChild("eqpselect", { static: false }) eqpselect: EqpSelectComponent;

  constructor(
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private translateSelectHelper: TranslateSelectHelper,
    private translate: TranslateService
  ) {
    this.translateSelectHelper.loadTranslateService(this.translate);
  }

  ngOnInit(): void {
    this.dataSource = [
      { Key: 1, Company: { Denomination: "Primo", Vat: "123" }, extra: "ciao1" },
      { Key: 2, Company: { Denomination: "Secondo", Vat: "456" }, extra: "ciao2" },
      { Key: 3, Company: { Denomination: "Terzo", Vat: "789" }, extra: "ciao3" }
    ];

    this.createForm();
  }

  createForm() {
    // this.formSelect = this.formBuilder.group({
    //   selectWithArrayData: [null, Validators.required],
    //   selectWithEnumData: [null, Validators.required],
    //   selectWithEnumAndFullObjectAndSelectAll: [null, Validators.required],
    //   selectWithEnumAndSelectAll: [null, Validators.required],
    //   selectWithArrayAndFullObjectAndSelectAll: [null, Validators.required],
    //   selectWithArrayAndSelectAll: [null, Validators.required],
    //   selectPopulatedWithArray: [this.dataSource[0], Validators.required],
    //   selectPopulatedWithArrayAndSelectAll: [[this.dataSource[0]], Validators.required],
    //   selectPopulatedWithEnum: [TestEnum.GERMANY, Validators.required],
    //   selectPopulatedWithEnumAndSelectAll: [[TestEnum.GERMANY, TestEnum.ENGLAND], Validators.required],
    //   selectWithPrimitiveArray: [null, Validators.required],
    //   selectPopulatedWithPrimitiveArray: ["paperino", Validators.required],
    //   selectPopulatedWithPrimitiveArrayAndSelectAll: [["paperino"], Validators.required],
    //   selectWithArrayAndValidation: []
    // });

    this.formSelect = this.formBuilder.group({
      selectWithArrayAndValidation: [null, Validators.required],
      selectWithEnumAndValidation: [TestEnum.ITALY]
    });

    this.cd.detectChanges();
  }

  selectChange(event, ngModelInput = null, formControlValue = null) {
    console.log(event);

    console.log("ngModelInput ", ngModelInput);

    console.log("formControl ", formControlValue);
  }

  getControls(control: string) {
    return this.formSelect.controls[control];
  }

  checkValues() {
  }

  numberToExclude = 1;
  exclude() {
    this.enumDataToExclude.push(this.numberToExclude++);

    this.selectWithExclude.reloadData();
  }

  changeValue(value, isEnum: boolean = false) {
    const formControl = isEnum ? "selectWithEnumAndValidation" : "selectWithArrayAndValidation";
    this.formSelect.get(formControl).setValue(value);
  }

  changeValidator(add: boolean, isEnum: boolean = false) {
    const formControl = isEnum ? "selectWithEnumAndValidation" : "selectWithArrayAndValidation";

    if (add) {
      this.formSelect.get(formControl).setValidators(Validators.required);
    } else {
      this.formSelect.get(formControl).setValidators(null);
    }
    this.formSelect.get(formControl).updateValueAndValidity();
  }

  changeEnable(formControl) {
    if (this.formSelect.get(formControl).enabled) this.formSelect.get(formControl).disable();
    else this.formSelect.get(formControl).enable();
  }

  changeFormGroupEnable() {
    if (this.formSelect.enabled) this.formSelect.disable();
    else this.formSelect.enable();
  }
}

export enum TestEnum {
  ITALY = 1,
  SPAIN = 2,
  GERMANY = 3,
  ENGLAND = 4,
  FRANCE = 5
}

export class OutpatientClinic {
  public Test: SymptomDTO;
}

export class SymptomDTO {
  public Key: number;
  public Description: string;
  public extra?: string;
}
