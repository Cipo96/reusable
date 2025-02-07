Table of contents
=================

* [Getting started](#getting-started)
* [API](#api)
* [Use cases](#use-cases)
* [Credits](#credits)

## Required

- [X] Angular Material installed and imported
- [X] @angular-material-components/datetime-picker (v2.0.4)
- [X] @angular-material-components/moment-adapter
- [X] Moment.js

## Getting started

This package allows the definition of filters to be used on a data list of any type.
With eqp-filters you can configure different types of filters (to choose from a predefined set) or create a custom filter to inject into the directive itself.

##### Notes

The directive does not really apply the filter but dynamically composes the filter to be returned to the user.

### Step 1: Install `eqp-dynamic-filters`:

#### NPM

```shell
npm install --save @eqproject/eqp-filters
```

### Step 2: Import the EqpFiltersModule :

```js
import { EqpFiltersModule } from '@eqproject/eqp-filters';

@NgModule({
  declarations: [AppComponent],
  imports: [EqpFiltersModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### Changes from 2.0.4 version

- Filters configuration simplified: `CreateFilterCVLConfig` and `CreateStandardFilterConfig` methods are not used anymore, instead you can create an array of `FilterField` objects.
- Added the validation of form fields. You can use `FilterField` property `ValidationProperties` defining the validity clauses.
  Example:

```js
    this.filters = [
          {
            filterID: 'POSTAL_CODE_ID',
            display: "Postal Code",
            key: "PostalCode",
            inputType: InputType.Text,
            wherePartType: WherePartType.Equal,
            //Example of validation
            validationProperties: { Valid: (property) => { return property.length == 5 }, HintLabel: "The postal code must have 5 digits"}
          }
    ]
```

`Valid` property takes a function that must return true with the value inserted. If this function returns `false` the field will be marked as invalid and a hint label will be displayed.
`HintLabel` property takes a string that represents a hint to the user to validate the field.

- Added the feature that allows to pass an array of `ConfigColumn` that will generate an array of `FilterConfig`, giving the user a simple way to apply filters to an `eqp-table`. The ConfigColumns must have `IsFilterable` property set to `true`. You can concatenate the generated filters with `eqpTableAdditionalFilters` input.
- Added the DateRange `InputType`.

## Convert BaseFieldModel to TableColumnField

To convert, in your component, you can use static EqpCommonService (eqp-common package required)
```js
            this.filterFields = EqpCommonService.convertAs<FilterField>(this.baseFields, FilterField, ["firstName", "lastName", "hired", "gender"], this.createComplexFilterField())

```


baseFields is the base array, ["firstName"]... are the fields I want to be returned and createComplexFilterField is the method that contains the transposition logic.

```js
    
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

```

additional complexity logics for the selected properties are defined in the method.

## API

### Inputs

| Input                         | Type                    | Default                                      | Required | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ----------------------------- | ----------------------- | -------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [filtersField]                | `Array<FilterField>`  | `-`                                        | yes      | Array of FilterConfig Objects                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| [resultType]                  | `FilterResultType`    | `BASIC`                                    | yes      | It allows you to define the type of result to be returned to the calling component, when the "Apply Filters" button is pressed. The possible values are, 1-BASIC: returns an object that will contain as many properties as there are filters valued, each property will have a name and value consistent with the filter configuration; 2-ADVANCED: Returns a complex object to use as LinqPredicate                                                                                                                                                  |
| [usingMode]                   | `FilterMode`          | `WITH_CARD`                                | yes      | It allows you to define the method of use and the graphic aspect of the directive. Possible values are, 1-WITH_CARD: an expandable card is rendered and the filters are displayed in the mat-card-content. When you apply filters in the card-header, the applied filters are summarized 2-WITH_BUTTON: a button is rendered (with the same style as the previous card-header). Pressing the button opens a modal containing all the filters. When filters are applied or reset, the modal closes and the applied filters are summarized in the button |
| [filterTitle]                 | `string`              | `Filtri`                                   | no       | Allows you to define the label to show as a title for the filters                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| [filterAppliedTitle]          | `string`              | `Filtri applicati:`                        | no       | Allows you to define the label to show in the header of the card when there are filters applied                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| [applyFilterLabel]            | `string`              | `Filtra`                                   | no       | Allows you to define the button label to apply filters                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| [resetAllFilterLabel]         | `string`              | `Reset`                                    | no       | Allows you to define the button label to reset filters                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| [showExpandend]               | `boolean`             | false                                        | no       | When using usingMode = WITH_CARD it allows to define the starting state of the card. If TRUE then part open otherwise collapsed                                                                                                                                                                                                                                                                                                                                                                                                                        |
| [currentCultureSelected]      | `string`              | `it-IT`                                    | yes      | It allows you to define the culture (and the relative language) to be used for the localization of dates                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| [applyOnInit]                 | `boolean`             | `false`                                    | no       | If TRUE then invokes the filterSelected output event at the init of the component. To be used when you want to give a starting value to some filters                                                                                                                                                                                                                                                                                                                                                                                                   |
| [saveFilter]                  | `boolean`             | `false`                                    | no       | If it assumes the value TRUE then the filter saving function will be active; the user can, after setting the different conditions, click on the 'Save filters' button to store the current filter status. This operation can be done several times in order to memorize more filters with different conditions. If the property is TRUE then it is mandatory to define the saveFilterID input                                                                                                                                                          |
| [saveFilterID]                | `string`              | -                                            | no       | If saveFilter is TRUE then this input is required and must contain a unique name that identifies the component. This unique value will be used to store the different filters configured by the user.                                                                                                                                                                                                                                                                                                                                                  |
| [saveFilterButtonLabel]       | `string`              | `Salva filtro`                             | no       | If saveFilter is TRUE then this input allows you to define the label to show for the save filter button                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| [saveFilterTitle]             | `string`              | `Inserire il nome per questo filtro`       | no       | If saveFilter is TRUE then this input allows you to define the title of the modal for entering the name of the filter to be saved                                                                                                                                                                                                                                                                                                                                                                                                                      |
| [saveFilterConfirmLabel]      | `string`              | `Conferma`                                 | no       | If saveFilter is TRUE then this input allows you to define the label of the confirm button for saving the filters                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| [saveFilterAbortLabel]        | `string`              | `Annulla`                                  | no       | If saveFilter is TRUE then this input allows you to define the label of the cancel button for saving filters                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| [restoreSavedFilterTooltip]   | `string`              | `Ricarica filtro`                          | no       | It allows you to define the tooltip to be shown to reload a filter from those previously saved (default value: 'Reload filter'). This input is used only when saveFilter = TRUE                                                                                                                                                                                                                                                                                                                                                                        |
| [removeSavedFilterTooltip]    | `string`              | `Elimina filtro`                           | no       | It allows you to define the tooltip to be displayed to delete a filter from those previously saved (default value: 'Delete filter'). This input is used only when saveFilter = TRUE                                                                                                                                                                                                                                                                                                                                                                    |
| [savedFilterLabel]            | `string`              | `Filtri salvati`                           | no       | If saveFilter is TRUE then this input allows you to define the section label that shows all previously saved filters (default value: 'Saved Filters')                                                                                                                                                                                                                                                                                                                                                                                                  |
| [useInitialValueOnReset]      | `boolean`             | `true`                                     | no       | If TRUE then when the RESET key is pressed for the filters that had default start values then those values will be reset, otherwise if FALSE all the filters will be deleted                                                                                                                                                                                                                                                                                                                                                                           |
| [filterPreventRemovalTooltip] | `string`              | `Non è possibile rimuovere questo filtro` | no       | Allows you to redefine the label to be shown as a tooltip when you hover the mouse over a filter for which PreventRemoval = TRUE (i.e. when deletion is prevented for a filter)                                                                                                                                                                                                                                                                                                                                                                        |
| [saveLastFilter]              | `boolean`             | `false`                                    | no       | If TRUE saves the last user selected filters and if the parameter `applyOnInit` is TRUE they will be restored and applied.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| [savedLastFilterName]         | `string`              | `Ultimi filtri usati`                      | no       | If `saveLastFilter` is TRUE then this input allows you to define the name of the last selected filters.                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| [leftCollapseIcon]            | `boolean`             | `true`                                     | no       | If TRUE and `usingMode == FilterMode.WITH_CARD` then shows the arrow to expand/collapse the card on the left side of the header, otherwise shows it on the right side.                                                                                                                                                                                                                                                                                                                                                                               |
| [showAppliedFiltersIcon]      | `boolean`             | `false`                                    | no       | If TRUE,`usingMode == FilterMode.WITH_CARD` and the user selected some filters then shows a filter icon on the left of the header title. To change this icon color you can use its own css class named `eqp-filters-applied-filter-icon`.                                                                                                                                                                                                                                                                                                          |
| [eqpTableConfigColumns]       | `Array<ConfigColumn>` | `null`                                     | no       | If defined, filters are generated from an array of ConfigColumns that have `IsFilterable` property set to TRUE, replacing filters passed by `filtersConfig`.                                                                                                                                                                                                                                                                                                                                                                                       |
| [eqpTableAdditionalFilters]   | `Array<FilterField>`  | `null`                                     | no       | Additional filters that will be concatenated with the filters generated from `eqpTableConfigColumns`.                                                                                                                                                                                                                                                                                                                                                                                                                                                |

### Outputs

| Output                          | Event Arguments       | Required | Description                                                                                                                                                                                                                                                                                                                         |
| ------------------------------- | --------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [filtersSelected]               | `EventEmitter<any>` | yes      | Invoked when buttons are pressed to apply or reset filters. Returns as a parameter the object (in case of resultType = BASIC) or the array of complex objects (if resultType = ADVANCED) with the results of the applied filters.                                                                                                   |
| [customFiltersSavedValueLoaded] | `EventEmitter<any>` | yes      | Output event fired when filters are reloaded from localstorage and the current filter expects an external template. This event is invoked only if the filter has an external template and only if the storage of the filters has been requested for eqp-filters. The complete filter configuration is passed as an event parameter. |

### Models used

#### FilterFieldModel: class for configure each individual filter

| Property                        | Description                                                                                                                                                                                                                                                                                                                                     | Type                 | Examples                                                                                                                                                                         |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| filterID                        | Unique Filter ID string                                                                                                                                                                                                                                                                                                                         | `string`           | -                                                                                                                                                                                |
| filterClass                     | Set the dimension of the filter control                                                                                                                                                                                                                                                                                                         | `FilterSizeClass`  | SMALL;MEDIUM;LARGE;CUSTOM                                                                                                                                                        |
| customFieldSizeClasses          | If `FilterClass == FilterSizeClass.CUSTOM` sets the custom defined classes on the filter control                                                                                                                                                                                                                                              | `string`           | -                                                                                                                                                                                |
| display                         | Set the label for the filter                                                                                                                                                                                                                                                                                                                    | `string`           | -                                                                                                                                                                                |
| key                             | Property name of the array objects on which the filter is to be applied                                                                                                                                                                                                                                                                         | `string`           | Name                                                                                                                                                                             |
| value                           | Property value of the array objects on which the filter is to be applied (default null)                                                                                                                                                                                                                                                         | `any`              | -                                                                                                                                                                                |
| inputType                       | Enum that define the type of the filter control to show                                                                                                                                                                                                                                                                                         | `InputType`        | The possible values are: Text, Number, Date, Datetime, CvlEnum, Cvl, Boolean, BooleanCvl, CustomTemplate                                                                         |
| wherePartType                   | It defines, in the case of resultType = ADVANCED, the type of logical comparison operator to be made                                                                                                                                                                                                                                            | `WherePartType`    | A value to be chosen between Equal, NotEqual, StringContains, StringNotContains, GreaterThan, GreaterThanOrEqual, LessThan, LessThanOrEqual, ContainsElement, NotContainsElement |
| externaltemplate                | Defines an external template to pass to the directive and which contains a custom filter (defined by the user who uses the directive)                                                                                                                                                                                                           | `TemplateRef<any>` | -                                                                                                                                                                                |
| enumModel                       | Se la CVL si basa su un enumeratore allora in questa proprietà va definito il type dell'enumeratore da usare. In questo modo la sorgente dati della CVL sarà l'insieme dei valori definiti per l'enumeratore                                                                                                                                  | `any`              | -                                                                                                                                                                                |
| arrayData                       | If the CVL is based on an array then in this property the array to be shown as the data source of the CVL must be defined                                                                                                                                                                                                                       | `any[]`            | -                                                                                                                                                                                |
| arrayKeyProperty                | In the case of ArrayData defined it allows to indicate the property of the objects of the array to bind to the filter                                                                                                                                                                                                                           | `string`           | -                                                                                                                                                                                |
| arrayValueProperty              | In the case of ArrayData defined, it allows you to indicate the property of the objects to be displayed in the filter                                                                                                                                                                                                                           | `string`           | -                                                                                                                                                                                |
| isEnumSearchable                | If TRUE then it shows the search field within the CVL                                                                                                                                                                                                                                                                                           | `boolean`          | -                                                                                                                                                                                |
| showEnumCancelButton            | If TRUE then it shows the button to clear the CVL selection                                                                                                                                                                                                                                                                                     | `boolean`          | -                                                                                                                                                                                |
| enumSearchText                  | Allows you to define the label for the search field                                                                                                                                                                                                                                                                                             | `string`           | -                                                                                                                                                                                |
| isEnumMultiSelect               | It allows you to define the multi-selection of CVL values                                                                                                                                                                                                                                                                                       | `boolean`          | -                                                                                                                                                                                |
|                                 |                                                                                                                                                                                                                                                                                                                                                 | `boolean`          | -                                                                                                                                                                                |
| customWherePartFunction         | Allows you to define an external custom function to be invoked for the current filter when the APPLY FILTERS or RESET buttons are pressed                                                                                                                                                                                                       | `Function`         | -                                                                                                                                                                                |
| customAppliedFilterInfoFunction | It allows you to define the custom function to return the value of the applied filter, to be shown in the header of the card                                                                                                                                                                                                                    | `Function`         | -                                                                                                                                                                                |
| childElementPropertyName        | For filters of type ContainsElement and NotContainsElement that rely on applying a where part with the operator ANY of LINQ then this property allows you to define the name of the property of the child objects on which to apply the where part. In this case, the name of the property containing the child list will go into PropertyName. | `string`           | -                                                                                                                                                                                |
| preventRemoval                  | Allows you to disable the cancellation of the filter for the user. By default it assumes the value FALSE (if true then the X button will not be shown in the summary of the applied filters)                                                                                                                                                    | `boolean`          | -                                                                                                                                                                                |
| validationProperties            | Allows you to define clauses to validate the filter field                                                                                                                                                                                                                                                                                       | `ValidationObject` | -                                                                                                                                                                                |

#### ValidationObject Model: class used for validating the field

| Property  | Description                                                                       | Type         |
| --------- | --------------------------------------------------------------------------------- | ------------ |
| Valid     | Function that returns a boolean value accepting the same input type of the filter | `Function` |
| HintLabel | String that gives an hint to insert the correct value                             | `string`   |

##### Enums description

| EnumType         | Description                                                                                          | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FilterSizeClass  | Allows to define the dimension of the filter                                                         | SMALL apply the col-4 bootstrap class, MEDIUM apply the col-8 bootstrap class, LARGE apply the col-12 bootstrap class and CUSTOM sets the custom defined classes on the filter control                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| InputType        | Allow the define the type of the input control to show for the filter                                | Text: show an input text; Number:show an input number; Date: show a material datepicker; CvlEnum: show an[eqp-select](https://www.npmjs.com/package/@eqproject/eqp-select) for the enumData type defined on the CvlConfig for the filter; Cvl: show an [eqp-select](https://www.npmjs.com/package/@eqproject/eqp-select) for the arrayData defined on the CvlConfig for the filter; Boolean: show a material slide; BooleanCvl: show an [eqp-select](https://www.npmjs.com/package/@eqproject/eqp-select) for the arrayData defined on the CvlConfig for the boolean filter value with states(NULL,TRUE, FALSE); CustomTemplate: show an external ng-template passed to the directive |
| WherePartType    | It defines, in the case of resultType = ADVANCED, the type of logical comparison operator to be made | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| FilterResultType | Defines the type of the object to return when the apply filters button is pressed                    | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| FilterMode       | Defines how the directive is to be used                                                              | WITH_CARD (default value): show a mat-card with expandable content. In the mat-card-content the filters are showed; WITH_BUTTON: show a button. When the button is pressed, a mat-dialog window are open with all the configured filters                                                                                                                                                                                                                                                                                                                                                                                                                                     |

## Use cases

### Use Example in class :

Define selector in html

```html
<eqp-dynamic-filters [filtersField]="filters" (filtersSelected)="filtersSelected($event)"></eqp-dynamic-filters>
```

CASE 1:Text type filter configuration

```js
    this.filters = [
          {
            filterID: 'PROVA_TEXT_ID',
            display: "Nome",
            key: "Name",
            inputType: InputType.Text,
            wherePartType: WherePartType.Equal,
            //Example of validation
            validationProperties: { Valid: (property) => { return property != null || property != "" }, HintLabel: "Campo obbligatorio"}
          }
    ]
```

    Configurazione precedente:

```js
    filters: FilterField[];
  
    let textFilter: FilterField= FilterField.createStandardFilterConfig("TEXT_FILTER", "Name", "Name", InputType.Text, WherePartType.Equal);
    this.filters.push(textFilter);
```

CASE 2: Number type filter configuration

```js
    this.filters = [
          {
            filterID: 'PROVA_NUMBER_ID',
            display: "Filtro Numero",
            key: "Counter",
            inputType: InputType.Number,
            wherePartType: WherePartType.Equal,
            //Example of validation
            validationProperties: { Valid: (property) => { return property > 0 && property < 4 }, HintLabel: "Il numero deve essere compreso tra 1 e 3"}
          }
    ]
```

    Configurazione precedente:

```js
    filters: FilterField[];
  
    let numberFilter: FilterField = FilterField.CreateStandardFilterConfig("NUMBER_FILTER", "Counter", "Filtro Numero", InputType.Number, WherePartType.Equal);
    this.filters.push(numberFilter);
```

CASE 3: Boolean type filter configuration

```js
    this.filters = [
          {
            filterID: 'PROVA_BOOLEAN',
            display: "Filtro Si/No",
            key: "IsValid",
            inputType: InputType.Boolean,
            wherePartType: WherePartType.Equal
          }
    ]
```

    Configurazione precedente:

```js
    filters: FilterField[];
  
    let booleanFilter: FilterField = FilterField.CreateStandardFilterConfig("BOOLEAN_FILTER","Bool Filter", "IsValid", InputType.Boolean, WherePartType.Equal);
     this.filters.push(booleanFilter);
```

CASE 4: CVL Enum type filter configuration

```js
    //Assuming you define a GenderEnum type enumerator with the values MALE and FEMALE

    this.filters = [
          {
            filterID: 'PROVA_ENUM',
            display: "Sesso",
            key: "Gender",
            inputType: InputType.CvlEnum,
            wherePartType: WherePartType.Equal,
            enumModel: GenderEnum,
            isEnumMultiSelect: false,
            isEnumSearchable: true,
            enumSearchText: "Search",
            //Example of validation
            validationProperties: { Valid: (property) => { return property != null }, HintLabel: "Campo obbligatorio"}
          }
    ]
```

    Configurazione precedente:

```js
    filters: FilterField[];
  
    //Assuming you define a GenderEnum type enumerator with the values MALE and FEMALE
  
    let enumCvlConfig: FilterCvlConfig = FilterCvlConfig.CreateFilterCVLConfig(GenderEnum, null, null, null, false, true, true);
    let enumFilter: FilterField= FilterField.CreateStandardFilterConfig("CVL_ENUM_FILTER", "Gender", "Gender", InputType.CvlEnum, WherePartType.Equal, null, enumCvlConfig);
    this.filters.push(enumFilter);
```

CASE 5: Date type filter configuration

```js
    this.filters = [
      {
        filterID: 'PROVA_DATE_START',
        display: "Data inizio",
        key: "StartDate",
        inputType: InputType.Date,
        wherePartType: WherePartType.GreaterThanOrEqual,
        //Example of validation
        validationProperties: { Valid: (property) => { return property > new Date(2022, 11, 31) && property < new Date(2024, 1, 1) }, HintLabel: "La data deve essere compresa tra il 01/01/2023 e il 31/12/2023"}
      }
    ]
```

    Configurazione precedente:

```js
    filters: FilterField[];
  
    let filterDateStart: FilterField= FilterField.CreateStandardFilterConfig("DATE_FILTER", "Start date","StartDate", InputType.Date, WherePartType.GreaterThanOrEqual, FilterSizeClass.SMALL);
    this.filters.push(filterDateStart);
```

CASE 6: Datetime type filter configuration

```js
    this.filters = [
      {
        filterID: 'PROVA_DATETIME',
        display: "Data/Ora",
        key: "DateWithTime",
        inputType: InputType.Datetime,
        wherePartType: WherePartType.GreaterThanOrEqual,
        //Example of validation
        validationProperties: { Valid: (property) => { return property != null }, HintLabel: "Campo obbligatorio"}
      }
    ]
```

    Configurazione precedente:

```js
    filters: FilterField[];
  
    let filterDateStart: FilterField= FilterField.CreateStandardFilterConfig("DATETIME_FILTER", "Start datetime","StartDatetime", InputType.Datetime, WherePartType.GreaterThanOrEqual, FilterSizeClass.SMALL);
    this.filters.push(filterDateStart);
```

CASE 7: Daterange type filter configuration

```js
    this.filters = [
      {
        filterID: 'PROVA_DATE_RANGE',
        display: "Data",
        key: "Date",
        inputType: InputType.DateRange,
        //Example of validation
        validationProperties: { Valid: (date1, date2) => { return date1 > new Date(2022, 11, 31) && date2 < new Date(2024, 1, 1) }, HintLabel: "Le date devono essere comprese tra il 01/01/2023 e il 31/12/2023"}
      }
    ]
```

CASE 8: CVL type filter configuration

```js
    this.filters = [
      {
        filterID: 'PROVA_CVL',
        display: "Cvl",
        key: "CvlValue",
        inputType: InputType.Cvl,
        wherePartType: WherePartType.Equal,
        arrayData: [{ key: 1, value: "Valore 1" }, { key: 2, value: "Valore 2" }, { key: 3, value: "Valore 3" }],
        arrayKeyProperty: "key",
        arrayValueProperty: "value",
        isEnumMultiSelect: true,
        isEnumSearchable: true,
        enumSearchText: "Search",
        //Example of validation
        validationProperties: { Valid: (property) => { return property != null }, HintLabel: "Campo obbligatorio"}
      }
    ]
```

    Configurazione precedente:

```js
    filters: FilterField[];
  
    let cvlConfig: FilterCvlConfig = FilterField.CreateFilterCVLConfig(null, [{ key: 1, value: "Value 1"}, { key: 2, value: "Value 2"}, { key: 3, value: "Value 3"}], "key", "value", false, true, true, null, true);
    let cvlFilter: FilterConfig = FilterField.CreateStandardFilterConfig("CVL_FILTER", "Cvl", "CvlValue", InputType.Cvl, WherePartType.Equal, null, cvlConfig);
    this.filters.push(cvlFilter);
```

CASE 9: Boolean CVL type filter configuration (this is the typical case of a non-mandatory Boolean)

```js
    this.filters = [
      {
        filterID: 'PROVA_CVL_BOOLEAN',
        label: "Boolean Cvl (Si/No/Tutti)",
        propertyName: "BooleanCvlValue",
        inputType: InputType.BooleanCvl,
        wherePartType: WherePartType.Equal,
        arrayData: [{ key: 1, value: "Valore 1" }, { key: 2, value: "Valore 2" }, { key: 3, value: "Valore 3" }],
        arrayKeyProperty: "key",
        arrayValueProperty: "value",
        isEnumMultiSelect: false,
        isEnumSearchable: true,
        //Example of validation
        validationProperties: { Valid: (property) => { return property != null }, HintLabel: "Campo obbligatorio"} 
      }
    ]
```

    Configurazione precedente:

```js
    filters: FilterField[];
  
    let booleanCvlConfig: FilterField= FilterCvlConfig.CreateFilterCVLConfig(null, [{ key: true, value: "Yes"}, { key: false, value: "No"}], "key", "value", false, true, true, null, false);
    let booleanCvlFilter: FilterField= FilterField.CreateStandardFilterConfig("CVL_BOOLEAN_FILTER", "Boolean Cvl", "BooleanCvlValue", InputType.BooleanCvl, WherePartType.Equal, null, booleanCvlConfig);
    this.filters.push(booleanCvlFilter);
```

CASE 10: Custom Template type filter configuration (this is the typical case of a non-mandatory Boolean)

```html
    <ng-template #externalFilter let-filter="filter">
        <mat-form-field>
            <mat-label>{{ filter.Label }}</mat-label>
            <input matInput [(ngModel)]="filter.PropertyObject">
      </mat-form-field>
    </ng-template>
```

```js
  
    //Define this ViewChild on ts
    @ViewChild('externalFilter', { static: true }) externalFilter: TemplateRef<any>;
  
    //Define this function on ts
    createCustomFilterValue(filterConfig, context) {
        let result = {};

        result[filterField.key] = filterField.value;
        return result;
    }
  
    //On the filter configuring method
    filters: FilterField[];
  
    let filterExternal: FilterField = FilterField.createStandardFilterConfig("PROVA_TEMPLATE_ESTERNO","Template esterno","Surname", InputType.CustomTemplate, WherePartType.Equal, FilterSizeClass.SMALL);
    filterExternal.externaltemplate = this.externalFilter;
    filterExternal.customWherePartFunction = (config, context) => this.createCustomFilterValue(config, this);

    this.filters.push(filterExternal);
  
```

CASE 11: eqp-filters with active save functionality

```html
    <eqp-dynamic-filters [filtersField]="filters" [saveFilter]="true" [saveFilterID]="'testFiltri'"                            [saveFilterID]="'provaFiltri'" (filtersSelected)="filtersSelected($event)"                     (customFiltersSavedValueLoaded)="customFiltersSavedValueLoaded($event)" [usingMode]="2" [resultType]="2" [applyOnInit]="true" ></eqp-dynamic-filters>
```

```js
  
    //On the filter configuring method
    filters: FilterField[];
  
    let textFilter: FilterField= FilterField.createStandardFilterConfig("PROVA_TEXT_ID", "Nome", "Name", InputType.Text, WherePartType.Equal);
    this.filters.push(textFilter);

  
    customFiltersSavedValueLoaded(filterField:FilterField) {
    if(!filterConfig)
      return;

    //If the current filter has an external template (with custom function defined) then 
    //here the value of the PropertyObject property of filterConfig must be forced with the value of the properties 
    //used inside the external template. In this way eqp-filters will be able to retrieve the value to be saved also 
    //for custom filters
    //For example: filterConfig.PropertyObject = context.customFilterPropertyValue;
  }
  
```

## Credits

This library has been developed by EqProject SRL, for more info contact: info@eqproject.it
