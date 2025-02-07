import { HttpClient } from "@angular/common/http";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import {
  FilterConfig,
  FilterCvlConfig,
  FilterSizeClass,
  InputType,
  WherePartType
} from "projects/eqp-common/src/public-api";
import { FilterField } from "projects/eqp-common/src/public-api";
import { LinqFilterDTO, LinqPredicateDTO } from "projects/eqp-common/src/public-api";
import { CellAlignmentEnum, ConfigColumn, NumberColumnPipe, TypeColumn } from "projects/eqp-common/src/public-api";
import { BaseFieldModel, BaseType } from "projects/eqp-common/src/public-api";
import { environment } from "src/environments/environment";
import { FieldSizeClass } from "projects/eqp-common/src/lib/models/common-enum.model";

@Component({
  selector: "app-test-eqp-filters",
  templateUrl: "./test-eqp-filter.component.html",
  styleUrls: ["./test-eqp-filter.component.scss"]
})
export class TestEqpFiltersComponent implements OnInit {
  filters: Array<FilterField> = new Array<FilterField>();
  oldFilters: Array<FilterConfig> = new Array<FilterConfig>();
  baseFilters: Array<BaseFieldModel> = new Array<BaseFieldModel>();
  genderEnumCvl = GenderEnum;

  customFilterValue: string = null;

  @ViewChild("externalFilter", { static: true }) externalFilter: TemplateRef<any>;

  columns: Array<ConfigColumn>;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.configureFilters();
  }

  configureFilters() {

    this.baseFilters = [
      { key: "Nome", display: "Nome", baseType: BaseType.Text},
      { key: "Cognome", display: "Cognome" },
    ]



    this.oldFilters = [];

    //#region Filtro tipo TEXT

    let textFilter: FilterConfig = FilterConfig.CreateStandardFilterConfig(
      "PROVA_TEXT_ID",
      "Nome",
      "Name",
      InputType.Text,
      WherePartType.Equal
    );
    textFilter.PreventRemoval = true;
    textFilter.FilterClass = FilterSizeClass.CUSTOM;
    textFilter.CustomFilterClasses = "col-md-12";
    this.oldFilters.push(textFilter);

    //#endregion

    //#region Filtro tipo NUMBER

    let numberFilter: FilterConfig = FilterConfig.CreateStandardFilterConfig(
      "PROVA_NUMBER_ID",
      "Counter",
      "Filtro Numero",
      InputType.Number,
      WherePartType.Equal
    );
    this.oldFilters.push(numberFilter);

    //#endregion

    //#region Filtro di tipo booleano

    let booleanFilter: FilterConfig = FilterConfig.CreateStandardFilterConfig(
      "PROVA_BOOLEAN",
      "Filtro Si/No",
      "IsValid",
      InputType.Boolean,
      WherePartType.Equal
    );
    this.oldFilters.push(booleanFilter);

    //#endregion

    //#region Filtro tipo CVL con enumeratore

    let enumCvlConfig: FilterCvlConfig = FilterCvlConfig.CreateFilterCVLConfig(
      GenderEnum,
      null,
      null,
      null,
      false,
      true,
      true
    );
    let enumFilter: FilterConfig = FilterConfig.CreateStandardFilterConfig(
      "PROVA_ENUM",
      "Sesso",
      "Gender",
      InputType.CvlEnum,
      WherePartType.Equal,
      null,
      enumCvlConfig
    );
    this.oldFilters.push(enumFilter);

    //#endregion

    //#region Filtro range di date

    let filterDateStart: FilterConfig = FilterConfig.CreateStandardFilterConfig(
      "PROVA_DATE_START",
      "Data inizio",
      "StartDate",
      InputType.Date,
      WherePartType.GreaterThanOrEqual,
      FilterSizeClass.SMALL
    );
    this.oldFilters.push(filterDateStart);

    let filterDateEnd: FilterConfig = FilterConfig.CreateStandardFilterConfig(
      "PROVA_DATE_END",
      "Data fine",
      "EndDate",
      InputType.Date,
      WherePartType.LessThanOrEqual,
      FilterSizeClass.SMALL
    );
    this.oldFilters.push(filterDateEnd);

    //#endregion

    //#region Filtro DateTime

    let filterDateTime: FilterConfig = FilterConfig.CreateStandardFilterConfig(
      "PROVA_DATETIME",
      "Data/Ora",
      "DateWithTime",
      InputType.Datetime,
      WherePartType.GreaterThanOrEqual
    );
    this.oldFilters.push(filterDateTime);

    //#endregion

    //#region Filtro CVL

    let cvlConfig: FilterCvlConfig = FilterCvlConfig.CreateFilterCVLConfig(
      null,
      [
        { key: 1, value: "Valore 1" },
        { key: 2, value: "Valore 2" },
        { key: 3, value: "Valore 3" }
      ],
      "key",
      "value",
      true,
      true,
      true,
      null,
      false
    );
    let cvlFilter: FilterConfig = FilterConfig.CreateStandardFilterConfig(
      "PROVA_CVL",
      "Cvl",
      "CvlValue",
      InputType.Cvl,
      WherePartType.Equal,
      null,
      cvlConfig
    );
    this.oldFilters.push(cvlFilter);

    //#endregion

    //#region Filtro CVL per booleani (3 stati)

    let booleanCvlConfig: FilterCvlConfig = FilterCvlConfig.CreateFilterCVLConfig(
      null,
      [
        { key: true, value: "Si" },
        { key: false, value: "No" }
      ],
      "key",
      "value",
      false,
      true,
      true,
      null,
      false
    );
    let booleanCvlFilter: FilterConfig = FilterConfig.CreateStandardFilterConfig(
      "PROVA_CVL_BOOLEAN",
      "Boolean Cvl (Si/No/Tutti)",
      "BooleanCvlValue",
      InputType.BooleanCvl,
      WherePartType.Equal,
      null,
      booleanCvlConfig
    );
    this.oldFilters.push(booleanCvlFilter);

    //#endregion

    this.filters = [
      //Filtro tipo TEXT
      {
        filterID: "PROVA_TEXT_ID",
        display: "Nome",
        inputType: InputType.Text,
        wherePartType: WherePartType.Equal,
        preventRemoval: true,
        fieldSizeClass: FieldSizeClass.CUSTOM,
        customFieldSizeClasses: "col-md-3",
        // ValidationProperties: { Valid: (property) => { return property != null && property != "" }, Hintdisplay: "Campo obbligatorio"}
      },
      //Filtro tipo NUMBER
      {
        filterID: "PROVA_NUMBER_ID",
        display: "Filtro Numero",
        key: "Counter",
        inputType: InputType.Number,
        wherePartType: WherePartType.Equal,
        fieldSizeClass: FieldSizeClass.CUSTOM,
        customFieldSizeClasses: "col-md-3"
        // ValidationProperties: { Valid: (property) => { return property > 0 && property < 4 }, Hintdisplay: "Il numero deve essere compreso tra 1 e 3"}
      },
      //Filtro di tipo booleano
      {
        filterID: "PROVA_BOOLEAN",
        display: "Filtro Si/No",
        key: "IsValid",
        inputType: InputType.Boolean,
        wherePartType: WherePartType.Equal
      },
      //#region Filtro Date
      {
        filterID: "PROVA_DATE_START",
        display: "Data inizio",
        key: "StartDate",
        inputType: InputType.Date,
        wherePartType: WherePartType.GreaterThanOrEqual,
        fieldSizeClass: FieldSizeClass.SMALL
        // ValidationProperties: { Valid: (property) => { return property > new Date(2022, 11, 31) && property < new Date(2024, 1, 1) }, Hintdisplay: "La data deve essere compresa tra il 01/01/2023 e il 31/12/2023"}
      },
      //#endregion
      //Filtro DateTime
      {
        filterID: "PROVA_DATETIME",
        display: "Data/Ora",
        key: "DateWithTime",
        inputType: InputType.Datetime,
        wherePartType: WherePartType.GreaterThanOrEqual
        // ValidationProperties: { Valid: (property) => { return property > new Date(2022, 11, 31) && property < new Date(2024, 1, 1) }, Hintdisplay: "La data deve essere compresa tra il 01/01/2023 e il 31/12/2023"}
      },
      //Filtro tipo CVL con enumeratore,
      {
        filterID: "PROVA_ENUM",
        display: "Sesso",
        key: "Gender",
        inputType: InputType.CvlEnum,
        wherePartType: WherePartType.Equal,
        enumModel: GenderEnum,
        isEnumMultiSelect: false,
        isEnumSearchable: true,
        validationProperties: {
          Valid: (property) => {
            return property != null;
          },
          HintLabel: "Campo obbligatorio"
        }
      },
      //Filtro CVL
      {
        filterID: "PROVA_CVL",
        display: "Cvl",
        key: "CvlValue",
        inputType: InputType.Cvl,
        wherePartType: WherePartType.Equal,
        arrayData: [
          { chiave: 1, value: "Valore 1" },
          { chiave: 2, value: "Valore 2" },
          { chiave: 3, value: "Valore 3" }
        ],
        arrayKeyProperty: "chiave",
        arrayValueProperty: "value",
        isEnumMultiSelect: true,
        isEnumSearchable: true,
        validationProperties: {
          Valid: (property) => {
            return property != null;
          },
          HintLabel: "Campo obbligatorio"
        }
      },
      //Filtro CVL per booleani (3 stati)
      {
        filterID: "PROVA_CVL_BOOLEAN",
        display: "Boolean Cvl (Si/No/Tutti)",
        key: "BooleanCvlValue",
        inputType: InputType.BooleanCvl,
        wherePartType: WherePartType.Equal,
        arrayData: [
          { chiave: true, value: "Si" },
          { chiave: false, value: "No" }
        ],
        arrayKeyProperty: "chiave",
        arrayValueProperty: "value",
        isEnumSearchable: true,
        validationProperties: {
          Valid: (property) => {
            return property != null;
          },
          HintLabel: "Campo obbligatorio"
        }
      },
      //Filtro range di date
      {
        filterID: "PROVA_DATE_RANGE",
        display: "Data",
        key: "Date",
        inputType: InputType.DateRange,
        fieldSizeClass: FieldSizeClass.SMALL
        // ValidationProperties: { Valid: (date1, date2) => { return date1 > new Date(2022, 11, 31) && (date2 < new Date(2024, 0, 1)) }, Hintdisplay: "Le date devono essere comprese tra il 01/01/2023 e il 31/12/2023"}
      },
      {
        filterID: "PROVA_LOOKUP",
        display: "Lookup",
        key: "FK_Company",
        inputType: InputType.Lookup,
        wherePartType: WherePartType.Equal,
        lookupEntityType: "Company",
        lookupFullUrlHttpCall: environment.apiFullUrl + "/lookup/GetLookupEntities",
        isLookupSearchable: true,
        isLookupMultiple: true
        // ValidationProperties: {
        //   Valid: (property) => {
        //     return property != null;
        //   },
        //   Hintdisplay: "Campo obbligatorio"
        // }
      }
    ];

    //#region Filtro con template esterno

    // let filterExternal: FilterConfig = FilterConfig.CreateStandardFilterConfig("PROVA_TEMPLATE_ESTERNO", "Template esterno", "Surname", InputType.CustomTemplate, WherePartType.Equal, FilterSizeClass.SMALL);
    // filterExternal.Externaltemplate = this.externalFilter;
    // filterExternal.CustomWherePartFunction = (config, isResetAll, isRemove) => this.createCustomFilterValue(config, isResetAll, isRemove, this);
    // filterExternal.CustomAppliedFilterInfoFunction = (config, isResetAll, isRemove) => this.createCustomFilterAppliedReview(config, isResetAll, isRemove, this);
    // this.filters.push(filterExternal);

    //#endregion

    this.columns = [
      {
        key: "manageAssociation",
        display: "",
        type: TypeColumn.MenuAction,
        buttonMenuIcon: "more_vert",
        actions: [{ name: "AAAA", icon: "fiber_manual_record", fn: (element, col, index) => alert("CIAO") }],
        styles: { flex: "0 0 6%" }
      },
      {
        key: "name",
        value: "fullName.name",
        display: "Nome (Colonna testo)",
        isFilterable: true
      },
      {
        key: "surname",
        value: "fullName.surname",
        display: "Cognome (Colonna testo)",
        isFilterable: true
      },
      {
        key: "BirthDate",
        display: "Data (Colonna data)",
        type: TypeColumn.Date,
        styles: { flex: "0 0 8%" },
        tooltip: { tooltipText: "Colonna di tipo Date senza formato specifico" },
        isFilterable: true
      },
      {
        key: "Gender",
        display: "Sesso (Colonna Enum)",
        type: TypeColumn.Enum,
        enumModel: GenderEnum,
        styles: { flex: "0 0 8%" },
        tooltip: { tooltipText: "Colonna di tipo Enum" },
        multilanguagePrefixKey: "ENUMS.GENDER.",
        isFilterable: true
      },
      {
        key: "nosi",
        display: "Colonna Booleana",
        type: TypeColumn.Boolean,
        booleanValues: { true: '<i class="fa fa-close"></i>', false: '<i class="fa fa-check"></i>' },
        styles: { flex: "0 0 6%" },
        isFilterable: true
      },
      {
        key: "color",
        display: "Colonna Colore",
        type: TypeColumn.Color,
        styles: { flex: "0 0 8%" },
        tooltip: { tooltipText: "Colonna per il colore" }
      },
      {
        key: "BirthDate2",
        value: "BirthDate",
        display: "Colonna Data con formato",
        type: TypeColumn.Date,
        styles: { flex: "0 0 8%" },
        tooltip: { tooltipText: "Colonna di tipo Date con formato specifico" },
        format: "yyyy-MM-dd",
        isFilterable: true
      },
      {
        key: "booleanValue",
        display: "Checkbox",
        styles: { flex: "0 0 5%" },
        type: TypeColumn.Checkbox,
        tooltip: { tooltipText: "Colonna di tipo Checkbox" },
        disabled: true,
        isFilterable: true
      },
      {
        key: "Icons",
        display: "Icone",
        styles: { flex: "0 0 8%" },
        type: TypeColumn.Icon,
        tooltip: { tooltipText: "Colonna di tipo Checkbox" },
        disabled: true
      },
      {
        key: "Link",
        display: "Link",
        type: TypeColumn.Hyperlink,
        hyperlink: { hyperlinkUrl: "https://google.com", hyperlinkText: "Link", isTargetBlank: true },
        tooltip: { tooltipText: "Colonna di tipo Hyperlink" }
      },
      {
        key: "Price",
        display: "Colonna prezzo",
        numberPipe: NumberColumnPipe.CURRENCY,
        currencyPipeCode: (element) => {
          return "USD";
        },
        styles: { flex: "0 0 7%", cellAlignment: CellAlignmentEnum.CENTER },
        isFilterable: true
      },
      {
        key: "DecimalValue",
        display: "Colonna valore decimale",
        numberPipe: NumberColumnPipe.DECIMAL,
        styles: { flex: "0 0 7%", cellAlignment: CellAlignmentEnum.RIGHT },
        isFilterable: true
      },
      {
        key: "PercentageValue",
        display: "Colonna valore percentuale",
        numberPipe: NumberColumnPipe.PERCENT,
        styles: { cellAlignment: CellAlignmentEnum.CENTER },
        isFilterable: true
      }
    ];
  }

  createCustomFilterValue(filterConfig: FilterConfig, isResetAll: boolean, isRemoveFilter: boolean, context) {
    if (filterConfig.FilterID == "PROVA_TEMPLATE_ESTERNO") {
      if (isResetAll == true) context.customFilterValue = "valore iniziale";
      else if (isRemoveFilter == true) context.customFilterValue = null;

      filterConfig.PropertyObject = context.customFilterValue;

      if (
        context.customFilterValue != null &&
        context.customFilterValue != undefined &&
        context.customFilterValue != ""
      ) {
        let result: LinqPredicateDTO = new LinqPredicateDTO();
        result.PropertyFilters = new Array<LinqFilterDTO>();
        result.PropertyFilters.push(
          LinqFilterDTO.createFilter("Surname", context.customFilterValue, WherePartType.Equal)
        );
        return result;
      }
    }
  }

  createCustomFilterAppliedReview(filterConfig: FilterConfig, isResetAll: boolean, isRemoveFilter: boolean, context) {
    if (filterConfig.FilterID == "PROVA_TEMPLATE_ESTERNO" && isResetAll != true) {
      return context.customFilterValue;
    }
  }

  filtersSelected($event) {
    console.log($event);
    // this.testCall($event);
  }

  /**
   * L'obiettivo di questa funzione è quello di forzare il PropertyObject
   * @param filterConfig
   * @returns
   */
  customFiltersSavedValueLoaded(filterConfig: FilterConfig) {
    if (!filterConfig) return;

    //Se il filtro corrente ha un template esterno (con funzione custom definita) allora qui va forzato il valore della
    //proprietà PropertyObject di filterConfig col valore delle proprietà utilizzate all'interno del template esterno.
    //IN questo modo eqp-filters riuscirà a recuperare il valore da salvare anche per i filtri custom
    if (filterConfig.FilterID == "PROVA_TEMPLATE_ESTERNO" && filterConfig.PropertyObject) {
      this.customFilterValue = filterConfig.PropertyObject;
    }
  }

  testCall(filters: LinqPredicateDTO[]): Promise<any> {
    // Chiamata al TestController per vedere se i filtri arrivano correttamente
    return this.http.post<any>(environment.apiFullUrl + "/test", filters).toPromise();
  }
}

export enum GenderEnum {
  Maschio = 1,
  Femmina = 2
}
