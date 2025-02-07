Table of contents
=================

  * [Getting started](#getting-started)
  * [Use Cases](#use)
  * [MultiLanguage](#multilanguage)
  * [API](#api)
  * [Credits](#credits)

## Required
- [x] Angular Material installed and imported

## Getting started
### Step 1: Install `eqp-table`:

#### NPM
```shell
npm install --save @eqproject/eqp-table
```
### Step 2: Import the EqpTableModule and install :
```js
import { EqpTableModule } from '@eqproject/eqp-table';

@NgModule({
  declarations: [AppComponent],
  imports: [EqpTableModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### Step 2: Use in your component

Define selector in html
```html
<eqp-table [headerTitle]="'Title'" [columns]="columns" [data]="DATA"></eqp-table>
```

Define the datasource for the table
```js
  @ViewChild(EqpTableComponent) eqpTable: EqpTableComponent; //To access directly the directive
  columns: Array<ConfigColumn>;

 DATA: any[] = [
    { ID: 0, Name: 'Mario', Surname: 'Rossi', BirthDate: new Date(), Gender: 1, Boolean: true},
    { ID: 1, Name: 'Luigi', Surname: 'Bianchi', BirthDate: new Date(), Gender: 2, Boolean: false}
  ];

 genderEnum = GenderEnum; // For enumerators, need only to create variable and assign to enumerator
```

Define the column configurations
```js
  this.columns = [
    {
        key: "Name",
        display: "Name"
      },
      {
        key: "Surname",
        display: "Surname",
      },
      {
        key: "BirthDate",
        display: "Birth Date",
        type: TypeColumn.Date,
        styles: { flex: "0 0 8%" }
      },
      {
        key: "Gender",
        display: "Gender",
        type: TypeColumn.Enum,
        enumModel: GenderEnum,
        styles: { flex: "0 0 8%" }
      }
  ];
```

### Step 3: Use Example to reload the table :

On onInit, you can call a reload method, that will only refresh the table using viewchild we previously created

```js
this.eqpTable.reloadDatatable(data);
```


## Multilanguage
### Step 4(not required): Use Multilanguage :

To use multilanguage, set to true the input boolean variable
```html
    <eqp-table [isMultiLanguage]="true"></eqp-table>
```

Then, where you set the language to use, like on login page or in navbar to switch language

```js
    this.translateHelper.loadJsonLanguage("en", jsonObject);
```

Where translateHelper is a service that need to be imported in constructor component as public.

loadJsonLanguage need to set current language, first parameter check the language to use, in the second we need to pass the entire Json for selected language

## Convert BaseFieldModel to TableColumnField

To convert, in your component, you can use static EqpCommonService (eqp-common package required)
```js
        this.tableColumnFields = EqpCommonService.convertAs<TableColumnField>(this.baseFields, TableColumnField, ["firstName", "lastName", "hired"], this.createComplexTableColumnField())

```


baseFields is the base array, ["firstName"]... are the fields I want to be returned and createComplexTableColumnField is the method that contains the transposition logic.

```js
    
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

```

additional complexity logics for the selected properties are defined in the method.

## API
### Inputs for basic table configuration
| Input  | Type | Default | Required | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| [headerTitle] | `string` | `-` | no | Set the table title. |
| [data] | `Array<any>` |  `-` | yes | Array of generic objects with properties. |
| [columns] | `Array<ConfigColumn>` |  `-` | yes | Array with ConfigColumn as type, need to initialize and import in component |
| [createMatCard] | `boolean` |  `false` | no | If true, a mat-card will be created as a container for the table |
| [createMatCardHeader] | `boolean` |  `false` | no | Se true, verrà creato una mat-card-header come contenitore del titolo della tabella |
| [tableName] | `string` |  `-` | no | It allows you to define the table name, currently used to save the pagination of the specific table that you want to modify. If omitted, a unique name is automatically assigned to each eqp-table |
| [emptyTableMessage] | `string` |  `Nessun dato trovato` | no | Text to show if the table is empty |
| [disableRow] | `string|Function|boolean` |  `-` | no | Visually disable the row. It accepts a string containing the name of a property that must be contained in the table and that MUST return Boolean values, otherwise it accepts a Function with the same behavior or a Booelan value |
| [isMultiLanguage] | `boolean` |  `false` | no | If true, see section and examples about use, if not interested in use, set to false or don't write it |
| [cultureInfo] | `string` |  `it-IT` | no | Definition of the cultureInfo to use for the data filter format in the table |
| [showFunctionButtons] | `boolean` |  `false` | no | If true, the 'Confirm' and 'Cancel' buttons are shown in the footer. It will be possible to pass functions to be invoked by pressing the buttons |
| [functionButtonConfirmText] | `string` |  `Conferma` | no | Confirm button text, by default it will return 'Confirm' |
| [functionButtonExitText] | `string` |  `Esci` | no | Exit button text, by default it will return 'Exit' |
| [tableColor] | `string (RGB o HEX)` |  `white` | no | Allows you to define the background color of the table |
| [exportEqpTable] | `ExportEqpTable` |  `null` | no | Allows you to configure the export functionality of the data shown in the table (refer to the configuration of the ExportEqpTable model) |
| [currencyFilterToReplace] | `string` |  `null` | no | N.D. |
| [currencyFilterToUse] | `string` |  `null` | no | N.D. |
| [showFirstLastButtons] | `boolean` |  `false` | no | Allows you to show first and last page button in paginator |
| [showFirstLastButtons] | `boolean` |  `false` | no | Allows you to show first and last page button in paginator |
| [disablePageStorageSave] | `boolean` |  `false` | no | Allows you to disable pagination storage save on localstorage |
| [disableRowColor] | `string (RGB o HEX)` |  `#8080808c` | no | Allows you to define color of the disabled rows |
| [autoResizeColumns] | `boolean` |  `false` | no | BETA - the table will become adaptive, the columns that do not fit on the screen will go into the expandable table detailing each row.You can use flex, minWidth or maxWidth for each column otherwise a default value will be set for each column |
| [chooseColumnsToShow] | `boolean` |  `false` | no | User can select the columns he wants to see in the table |
| [chooseColumnsToShowText] | `string` |  `Visualizza colonne` | no | Text on dialog title for the columns to show |
| [rowCssClass] | `Function|string` |  `null` | no | Classes that will be applied to mat-row, the function MUST return a string |
| [cellCssClass] | `Function|string` |  `null` | no | Classes that will be applied to mat-cell, the function MUST return a string |
| [headerCellCssClass] | `Function|string` |  `null` | no | Classes that will be applied to mat-header, the function MUST return a string |
| [isStickyHeader] | `boolean` |  `false` | no | Header will be sticky |
| [customButtons] | `CustomButton` |  `false` | no |  Allows you to configure the custom buttons at the top of table (refer to the configuration of the CustomButton model) |
### Inputs for table lookup functionality (searching)
| Input  | Type | Default | Required | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| [isTableSearcheable] | `boolean` |  `true` | no | Manages the visibility of the search field above the table, default true. If False then the search field is hidden |
| [searchText] | `string` |  `Cerca` | no | Label to be applied to the text search field |
| [isSingleColumnFilter] | `boolean` |  `false` | no | It defines if the search is done by single column or if global |
| [switchFilterType] | `boolean` |  `false` | no | It allows you to configure the switch functionality between the global search and the single column search. |
| [singleFilterColumnVisible] | `boolean` |  `true` | no | It allows you to manage the expand / collapse status of the accordion relating to the search fields on a single column |
| [showSingleFilterButton] | `boolean` |  `true` | no | If the use of filters on a single column has been requested, through this input it will be possible to open / close the agreement between the header and the body of the table containing the filters on a single column |
| [switchFilterToGenericText] | `string` |  `Usa filtro generico` | no | Tooltip text of the switch button in case generic filters are to be shown |
| [switchFilterToSingleText] | `string` |  `Usa filtro per singola colonna` | no | Toggle button tooltip text in case single column filters are to be shown |
| [showFilterText] | `string` |  `Mostra filtri` | no | Text of the button to open the accordion of the search fields on a single column |
| [hideFilterText] | `string` |  `Nascondi filtri` | no | Text of the button to close the accordion of the search fields on a single column |

### Inputs for table pagination
| Input  | Type | Default | Required | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| [paginatorVisible] | `boolean` |  `true` | no | Allows you to show / hide the pagination under the table, default true. If it is set to FALSE then the table will have no paging |
| [matPaginatorLength] | `Array<number>` |  `[5,10,25,100]` | no | It allows to define an array of numbers to indicate the possible pagination dimensions of the table, default: [5, 10, 25, 100] |
| [matPaginatorSize] | `number` |  `5` | no | Allows you to define the default number to be used for the elements to be displayed on each page |
| [matPaginatorIndex] | `number` |  `-` | no | Allows you to define the index of the page size array to use to be set by default. |
| [matPaginatorCount] | `number` |  `-` | no | N.D. |
| [paginatorColor] | `string (HEX o RGB)` |  `-` | no | Allows you to define the paginator background color (HEX or RGB) |

### Inputs for table selection
| Input  | Type | Default | Required | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| [selection] | `boolean` |  `false` | no | If true, single select functionality is added on the table (default: false) |
| [isMultipleSelection] | `boolean` |  `false` | no | If it assumes the value true and if the input 'selection' takes the value true then it adds the functionality of multiple selection of the table rows |
| [isHighlight] | `boolean` |  `false` | no | Defines whether the table highlights the selected row (passing an output event for the row) |
| [highlightColor] | `string` |  `#E4E5E6` | no | Definition of the highlight color, default is #E4E5E6 (gray), N.B. it must be RGB |
| [isSelectedPropertyName] | `string` |  `isSelected` | no | Allows you to define property name for checkbox function |

### Inputs for filter table
| Input  | Type | Default | Required | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| [enableFilters] | `boolean` |  `false` | no | If true, the table will automatically integrate the filters, this management will change if the FilterObject is added  |
| [filterObject] | `FilterObject` |  {} | no | Object that manages the filters integrated into the table in a more complex way  |

### Table Outputs
| Output  | Event Arguments | Required | Description |
| ------------- | ------------- | ------------- | ------------- |
| (checkboxInfo) | `EventEmitter<any` | no | Invoked only if the selection is active on the eqp-table. It is invoked every time the selection on the rows changes and passes as a parameter the array of the rows that are selected |
| (pageChange) | `EventEmitter<any>` | no | Invoked whenever the pagination of the table changes. Exposes an object containing the following properties: previousSize, pageIndex, pageSize |
| (sortChange) | `EventEmitter<any>` | no | Event triggered when the ordering on a column is changed, an object containing the name of the column and the direction of the ordering is passed as a parameter |
| (highlightSelected) | `EventEmitter<any>` | no | Event active only if the selection on the table is active. It is invoked at each selection made and passes the selected line as a parameter |
| (highlightDeselected) | `EventEmitter<any>` | no | Event active only if the selection on the table is active. It is invoked at each deselection made and passes the deselected line as a parameter |
| (functionButtonConfirm) | `EventEmitter<any>` | no | Event active only if the 'showFunctionButtons' input takes on the value TRUE. It is invoked when the 'Confirm' button is pressed and passes as a parameter the array of rows selected on the table (if present) |
| (functionButtonExit) | `EventEmitter<any>` | no | Event active only if the 'showFunctionButtons' input takes on the value TRUE. It is invoked when the 'Exit' button is pressed and passes the value NULL as a parameter |
| (eqpExportStarted) | `EventEmitter<any>` | no | Event triggered when the table export function starts. It is active only if the 'exportEqpTable' input is configured. |
| (eqpExportCompleted) | `EventEmitter<any>` | no | Event triggered at the end of the table export function. It is active only if the 'exportEqpTable' input is configured. |
| [filtersSelected] | `EventEmitter<any>` | yes | Invoked when buttons are pressed to apply or reset filters. Returns as a parameter the object (in case of resultType = BASIC) or the array of complex objects (if resultType = ADVANCED) with the results of the applied filters. |
| [customFiltersSavedValueLoaded] | `EventEmitter<any>` | yes | Output event fired when filters are reloaded from localstorage and the current filter expects an external template. This event is invoked only if the filter has an external template and only if the storage of the filters has been requested for eqp-filters. The complete filter configuration is passed as an event parameter. |

## Models used

###  BaseFieldModel

| Property  | Description | Examples | Type |
| ------------- | ------------- | ------------- | ------------- |
| key | Unique name to be assigned to the column (may coincide with the name of the property to be displayed)  | - | `string` |
| display | Displayed value | - | `string` |
| value | If the specified key does not coincide with the name of the property then this node must contain the name of the property to be displayed or, possibly, the function to be called to return the value to be shown in the column. | - | `string|Function` |
| currencyPipeCode | Allows you to define the pipe to be used for columns containing a currency. It can be a static value (a string) or a function (if for example there are different currencies on the lines) | - | `string|Function` |
| actions | Allows you to define the actions for the SIMPLE_ACTION or MENU_ACTION type column | - | `Array<ConfigAction>` |
| booleanValues | Can define display value for 'true' and 'false' cases | true: 'Si' false: 'No' | `BooleanValues` |
| enumModel | Passed enum type, automatically retrieve the value | - | `any` |
| buttonMenuIcon | Define the button icon in menu cases | - | `string` |
| styles | N.D. | - | `-` |
| disabled | Allows you to enable / disable the column based on a value or the result of a function | - | `boolean|Function` |
| multilanguagePrefixKey | If the multilingual is active for the table and the current column contains, for example, an enumerator to be translated, in this field it is possible to indicate the possible prefix to search for the translated value in the translation dictionary passed as input. | - | `string` |
| tooltip | N.D. | - | `-` |
| baseType | - | Text = 1, Number = 2, Date = 3, Enum = 4, Boolean = 5 | BaseType |


### ConfigAction Model

| Property  | Description | Type | Required |
| ------------- | ------------- | ------------- | ------------- |
| name | Action name |  `string` | no |
| icon | Mat Icon for menu icon | `string|Function` | no |
| disabled | Mat Icon for menu icon | `boolean|Function` | no |
| fn | Used to define function | - | `any|Function` |
| hidden | Used to define function | `boolean|Function` | no |
| fontawesome | Used to define function | `boolean` | no |
| tooltip | Used to define function | `EqpMatTooltip` | no |
| color | Used to define function | `string` | no |

###  TableColumnField Model

| Property  | Description | Examples | Type |
| ------------- | ------------- | ------------- | ------------- |
| type | TypeColumn - define with enumerator the column type | Date = 1, Boolean = 2, SimpleAction = 3, MenuAction = 4, Enum = 5, Icon = 6, Checkbox = 7, Hyperlink = 8, Image = 9, Color = 10, ExternalTemplate = 11 | `TypeColumn Enum` 
| actions | Allows you to define the actions for the SIMPLE_ACTION or MENU_ACTION type column | - | `Array<ConfigAction>` |
| booleanValues | Can define display value for 'true' and 'false' cases | true: 'Si' false: 'No' | `BooleanValues` |
| enumModel | Passed enum type, automatically retrieve the value | - | `any` |
| buttonMenuIcon | Define the button icon in menu cases | - | `string` |
| icons | N.D. | - | `-` |
| containerStyle | N.D. | - | `-` |
| isSearchable | Allows you to activate / deactivate the search for the current column | - | `boolean` |
| disabled | Allows you to enable / disable the column based on a value or the result of a function | - | `boolean|Function` |
| multilanguagePrefixKey | If the multilingual is active for the table and the current column contains, for example, an enumerator to be translated, in this field it is possible to indicate the possible prefix to search for the translated value in the translation dictionary passed as input. | - | `string` |
| tooltip | N.D. | - | `-` |
| hyperlink | N.D. | - | `-` |
| image | N.D. | - | `-` |
| additionalValue | It allows you to define a static text that will always be displayed as a suffix of the text shown in the cell | - | `string` |
| externalTemplate | Allows you to define the external template to be used as the content of the column | - | `TemplateRef<any>` |
| externalTemplateSearchFunction | Allows you to define the value for which template will be searched. It can be a static value (a string) or a function | - | `string|Function` |
| isSortable | Allows you to activate / deactivate the sorting on the current column | - | `boolean` |
| isFilterable | Allows you to activate / deactivate filter on the current column when using eqp-filters | - | `boolean` |
| isHidden | Allows you to hide current column, when using 'chooseColumnsToShow', deselected columns will be automatically set to true | - | `boolean` |
| isSticky | Allows you to stick current column to the left of the table (when scrolled after its position) NOTE: Flex is not fully compatible, it is recommended to use MinWidth | - | `boolean` |
| isStickyEnd | Allows you to stick current column to the right of the table making it always visible | - | `boolean` |


### ExportEqpTable Model

| Property  | Description | Type | Required |
| ------------- | ------------- | ------------- | ------------- |
| exportFileType | N.D. |  `ExportType | Array<ExportType> | CustomExportType | Array<CustomExportType>` | no |
| exportFileName | N.D. |  `string` | no |
| hiddenColumns | N.D. |  `Array<number>` | no |
| buttonText | N.D. |  `string` | no |
| buttonTextTranslateKey | N.D. |  `string` | no |
| buttonIcon | N.D. |  `string` | no |
| tooltipText | N.D. |  `string` | no |
| tooltipTextTranslateKey | N.D. |  `string` | no |
| tooltipPosition | N.D. |  `TooltipPositionType` | no |
| showButtonBorder | N.D. |  `boolean` | no |
| customExportFunction | N.D. |  `Array<Function>` | no |

### CustomButton Model

| Property  | Description | Type | Required |
| ------------- | ------------- | ------------- | ------------- |
| buttonText | N.D. |  `string` | no |
| buttonTextTranslateKey | Need translate to be defined on the table |  `string` | no |
| icon | N.D. |  `string` | no |
| color | N.D. |  `string` | no |
| order | Left to right |  `number` | no |
| tooltipText | N.D. |  `string` | no |
| tooltipTextTranslateKey | Need translate to be defined on the table |  `string` | no |
| tooltipPosition | Default 'below' |  `TooltipPositionType` | no |
| customButtonFunction | N.D. |  `Function` | no |

### fn Model

| Property  | Description |
| ------------- | ------------- |
| element | Entire row data |
| col | row index |
| elementIndex | Information about the action name and type |

## Credits
This library has been developed by EqProject SRL, for more info contact: info@eqproject.it
