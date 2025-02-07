import { ChangeDetectorRef, Component, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { LookupConfigDTO, LookupDTO } from 'projects/eqp-lookup/src/lib/models/lookup.model';
import { environment } from 'src/environments/environment';
import { AddQuestionComponent } from './add-question/add-question.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EqpLookupComponent } from 'projects/eqp-lookup/src/public-api';

@Component({
  selector: 'app-test-eqp-lookup',
  templateUrl: './test-eqp-lookup.component.html',
  styleUrls: ['./test-eqp-lookup.component.scss']
})
export class TestEqpLookupComponent implements OnInit {

  title = 'eqp-lookup-proj';
  fullUrlHttpCall = environment.apiFullUrl  + '/lookup/GetLookupEntities';

  questionInitialItems: LookupDTO[] | null = null;
  lookupWithInitialItems: LookupDTO | undefined;

  questionLookupWithoutForm: LookupDTO | undefined;
  questionLookupWithoutFormPT2: LookupDTO | undefined;
  addQuestionComponent = AddQuestionComponent;

  lookupFormGroup: FormGroup | undefined;
  questionLookupWithForm: LookupDTO | undefined;
  questionLookupWithFormPT2: LookupDTO | undefined;

  lookupWithSelectAll: LookupDTO | undefined;
  lookupWithGroups: LookupDTO | undefined;

  lookupWithCustomNgOption: LookupDTO|undefined;
  lookupWithCustomNgLabel: LookupDTO|undefined;

  lookupWithManipulateData: LookupDTO | undefined;


  lookupWithStartingData: LookupDTO = {ID: 175, Label: 'test97551234kjh', FullObject: null};
  lookupWithStartingDataGroup: any = [{Key: 'Seleziona tutto', Label: 'Seleziona tutto'}];



  enabled : boolean = true;

  @ViewChild("customOptionTemplate", {static: true}) customOptionTemplate: TemplateRef<any>;

  @ViewChild("customLabelTemplate") customLabelTemplate: TemplateRef<any>;
  
  @ViewChild("lookupCustomOption") lookupCustomOption: EqpLookupComponent;

  groupByFn = (item: any) => item.FullObject.FK_QuestionCategory;
  groupValueFn = (groupKey: string, children: any[]) => ({Key: groupKey, Label: groupKey, Total: children.length});

  groupValueFn2 = null;

  questionCategories: any[];

  constructor(private http:HttpClient, private cd : ChangeDetectorRef, private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    let config: LookupConfigDTO = new LookupConfigDTO();
    config.TypeName = 'Question';
    config.Filters = null;
    config.CustomConfig = null;
    config.ComplexFilters = null;
    this.http.post<LookupDTO[]>(this.fullUrlHttpCall, config).subscribe(res => {
      this.questionInitialItems = res;
      this.cd.detectChanges();
    })

    this.http.get<any[]>(environment.apiFullUrl + '/questioncategory/GetAllQuestionCategory').subscribe(res => {
      this.questionCategories = res;
      this.groupValueFn2 = (groupKey: string, children: any[]) => ({Key: groupKey, Label: this.questionCategories.filter(qc => qc.ID == groupKey)[0].Label, Total: children.length})
      this.cd.detectChanges();
    })

    this.createForm();
  }

  createForm() {
    this.lookupFormGroup = this.formBuilder.group({
      questionLookupWithForm: [null, Validators.required],
      questionLookupWithFormPT2: [null, Validators.required],
      lookupWithSelectAllAndForm: [null, Validators.required],
      lookupWithGroupsAndForm: [null, Validators.required],
      lookupWithStartingData: [{ID: 175, Label: 'test97551234kjh', FullObject: null}, Validators.required],
      lookupWithStartingDataGroup: [[{Key: 'Seleziona tutto', Label: 'Seleziona tutto'}], Validators.required]
    })
  }

  lookupChange(event: any) {
    console.log(event);
  }

  getNumber(element: number | string | undefined | null): number | null {
    if (element != null)
      return Number(element);
    else 
      return <null><unknown> element;
  }

  getLookupValue(lookup: LookupDTO | undefined): string {
    if(lookup == null)
      return "Undefined"
    
    return `Valore: ${lookup.ID} ${lookup.Label} ${lookup.FullObject}`;
  }

  getFormControls(control: string) {
    return this.lookupFormGroup.controls[control];
  }

  changeEnableDisable() {
    this.enabled = !this.enabled;
    if(!this.enabled) {
      this.lookupFormGroup.disable();
    } else
      this.lookupFormGroup.enable();
  }

  manipulateData(items: any) : LookupDTO[] {
    let res: LookupDTO[] = [];
    for(let item of items) {
      item.Label += " sono stato aggiunto dopo";
      res.push(item)
    }

    return res;
  }
}
