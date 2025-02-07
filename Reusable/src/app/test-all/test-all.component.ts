import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { BaseFieldModel, BaseType, EqpCommonService } from 'projects/eqp-common/src/public-api';
import { GenderEnumDemo, TestAllService, User } from './test-all.service';
import { FormGroup } from '@angular/forms';
import { EnumHelper } from 'projects/eqp-table/src/public-api';
import { TableColumnField, TypeColumn } from 'projects/eqp-common/src/public-api';
import { HttpClient } from '@angular/common/http';
import { FormField, FormFieldType, LookupObject } from 'projects/eqp-common/src/public-api';
import { FilterField, FilterMode, FilterResultType, FilterSizeClass, InputType, WherePartType } from 'projects/eqp-common/src/public-api';
import { FilterObject } from 'projects/eqp-table/src/lib/internal-components/filter-component/filter.model';
import { environment } from 'src/environments/environment';
import { FieldSizeClass } from 'projects/eqp-common/src/lib/models/common-enum.model';
import { GenderEnum } from '../app.component';

@Component({
  selector: 'test-all',
  templateUrl: './test-all.component.html',
  styleUrl: './test-all.component.scss'
})
export class TestAllComponent {

  baseFields: Array<BaseFieldModel>;
  @ViewChild("externalField", { static: true }) externalField: TemplateRef<any>;
  form: FormGroup;

  users: Array<User> = null;
  user: User = null;
  selectedUserID: number;

  //Oggetti complessi
  formFields: Array<FormField> = null;
  tableColumnFields: Array<TableColumnField>;
  filterFields: Array<FilterField>;

  defaultFilters: FilterObject = {
    resultType: FilterResultType.BASIC,
    usingMode: FilterMode.WITH_CARD,
    filterTitle: 'Filtri',
    filterAppliedTitle: 'Filtri applicati:',
    applyFilterLabel: 'Filtra',
    resetAllFilterLabel: 'Reset',
    restoreAllFilterLabel: 'Ripristina filtri iniziali',
    clearFilterTooltip: 'Clicca per rimuovere questo filtro',
    showExpandend: false,
    currentCultureSelected: 'it-IT',
    applyOnInit: false,
    saveFilter: false,
    saveFilterID: null,
    saveFilterButtonLabel: 'Salva filtro',
    saveFilterTitle: 'Inserire il nome per questo filtro',
    saveFilterConfirmLabel: 'Conferma',
    saveFilterAbortLabel: 'Annulla',
    savedFilterLabel: 'Filtri salvati',
    restoreSavedFilterTooltip: 'Ricarica filtro',
    removeSavedFilterTooltip: 'Elimina filtro',
    useInitialValueOnReset: true,
    filterPreventRemovalTooltip: 'Non è possibile rimuovere questo filtro',
    saveLastFilter: false,
    savedLastFilterName: 'Ultimi filtri usati',
    leftCollapseIcon: true,
    showAppliedFiltersIcon: false,
    complexFilters: [{
      filterID: "PROVA_DATE_START",
      display: "Data inizio",
      key: "StartDate",
      inputType: InputType.Date,
      wherePartType: WherePartType.GreaterThanOrEqual,
      fieldSizeClass: FieldSizeClass.SMALL
    },
    {
      filterID: "PROVA_DATE_RANGE",
      display: "Data",
      key: "Date",
      inputType: InputType.DateRange,
      fieldSizeClass: FieldSizeClass.SMALL
    },
    {
      filterID: "firstName",
      display: "Nome cambiato",
      key: "firstName",
      inputType: InputType.Text,
      fieldSizeClass: FieldSizeClass.LARGE
    }]
  };

  lookupObject: LookupObject = {
    fullUrlHttpCall: environment.apiFullUrl + "/lookup/GetLookupEntities",
    lookupEntityType: "User",
    isLookupSearchable: true,
    isLookupMultiple: true,
  }

  constructor(private testAllService: TestAllService, private enumHelper: EnumHelper, private http: HttpClient, private cd: ChangeDetectorRef) {
  }



  /**
   * Novità:
   * - Modello base da utilizzare nella creazione dei componenti riutilizzabili, che adesso estendono le proprietà comuni BaseFieldModel
   * - Refactoring seguendo questa logica, dei componenti Eqp-Table e Eqp-Filter
   *   I modelli sono diventati ConfigColumn => TableField / FilterConfig => FilterField (sono state applicate le convenzioni typescript passando da PascalCase a camelCase per proprietà classe)
   *   PS: Questo vale per la versione 17, i "vecchi" modelli saranno deprecati ma attualmente rimane la retrocompatibilità
   * - Eqp-table con eqp-filters
   * - Eqp-form
   * - EqpCommon
   */

  ngOnInit() {

    //#region Creazione dati di mockup
    this.createMockData();
    //#endregion

    //#region Parto da un oggetto base generico
    this.createExampleBaseField();
    //#endregion



    //#region Creazione degli oggetti complessi
    this.formFields = EqpCommonService.convertAs<FormField>(this.baseFields, FormField, this.baseFields.map(x => x.key), this.createComplexFormField())
    this.tableColumnFields = EqpCommonService.convertAs<TableColumnField>(this.baseFields, TableColumnField, ["firstName", "lastName", "hired"], this.createComplexTableColumnField())
    this.filterFields = EqpCommonService.convertAs<FilterField>(this.baseFields, FilterField, ["firstName", "lastName", "hired", "gender"], this.createComplexFilterField())
    //#endregion

  }

  private createComplexFormField(): Array<FormField> {
    const additionalProperties: Array<FormField> = [
      {
        key: 'firstName',
        required: true,
        showInForm: true,
        disabled: false,
        display: "Pippo",
        placeholder: "Placeholder",
        fieldSizeClass: FieldSizeClass.LARGE
      },
      {
        key: 'age',
        required: true,
        validationProperties: { HintLabel: "Non valido", Valid: (field) => field == 50 }
      },
      { key: "ID", display: "Lookup", formFieldType: FormFieldType.Lookup, lookupObject: this.lookupObject },
      { key: "ExternalField", display: "ExternalField", formFieldType: FormFieldType.ExternalTemplate, externalTemplate: this.externalField },
    ];

    return additionalProperties;
  }

  private createComplexTableColumnField() {
    const additionalProperties: Array<TableColumnField> = [
      {
        key: "Link",
        display: "Link",
        type: TypeColumn.Hyperlink,
        hyperlink: { hyperlinkUrl: "https://google.com", hyperlinkText: "Link", isTargetBlank: true },
        tooltip: { tooltipText: "Colonna di tipo Hyperlink" },
        styles: { minWidth: "150px" }
      },
      {
        key: "birthDate",
        value: (element) => { return element.birthDate },
        display: "Data senza formato",
        type: TypeColumn.Date,
        tooltip: { tooltipText: "Colonna di tipo Date senza formato specifico" },
        styles: { minWidth: "150px" },
      },
      {
        key: "gender",
        display: "Sesso (Enum)",
        type: TypeColumn.Enum,
        enumModel: GenderEnum,
        tooltip: { tooltipText: "Colonna di tipo Enum" },
        multilanguagePrefixKey: "ENUMS.GENDER.",
        styles: { minWidth: "150px" },
      }
    ]

    return additionalProperties;
  }

  private createComplexFilterField() {
    const additionalProperties: Array<FilterField> = [
      {
        filterID: "PROVA_DATE_START",
        display: "Data inizio",
        key: "StartDate",
        inputType: InputType.Date,
        wherePartType: WherePartType.GreaterThanOrEqual,
        fieldSizeClass: FieldSizeClass.SMALL
      },
      {
        filterID: "PROVA_DATE_RANGE",
        display: "Data",
        key: "Date",
        inputType: InputType.DateRange,
        fieldSizeClass: FieldSizeClass.SMALL
      }
    ]

    return additionalProperties;
  }

  private async createMockData() {
    let res = await this.testAllService.getUsers();
    this.users = res.users;
    this.user = this.users[0];

    this.users.forEach(element => {
      element.hired = Math.random() < 0.5;
      element.gender = Math.random() < 0.5 ? GenderEnumDemo.male : GenderEnumDemo.female;
    });
  }


  private createExampleBaseField() {
    this.baseFields = [
      { key: "firstName", display: "Nome", baseType: BaseType.Text },
      { key: "lastName", display: "Cognome", baseType: BaseType.Text },
      { key: "age", display: "Età", baseType: BaseType.Number },
      { key: "birthDate", display: "Data", baseType: BaseType.Date },
      { key: "hired", display: "Assunto", baseType: BaseType.Boolean },
      { key: "gender", display: "Genere", baseType: BaseType.Enum, enumModel: GenderEnumDemo },
    ]
  }

  filterSelected(event) {
    console.log(event);
  }

  selectUser(event) {
    this.selectedUserID = event.id;
    this.user = this.users.find(x => x.id == event.id);
  }

  onSubmit(event) {
    if (this.selectedUserID != null) {
      let foundedUser = this.users.find(x => x.id == this.selectedUserID)
      foundedUser.age = event.age;
      foundedUser.birthDate = event.birthDate;
      foundedUser.firstName = event.firstName;
      foundedUser.lastName = event.lastName;
      foundedUser.gender = event.gender;
      foundedUser.hired = event.hired;
    }
  }

}
