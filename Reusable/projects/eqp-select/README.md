Table of contents
=================

  * [Getting started](#getting-started)
  * [API](#api)
  * [Reload data](#reload-data)
  * [Use Cases](#use-cases)
  * [Multi-language](#multi-language)
  * [Credits](#credits)

## Required
- [x] Angular Material installed and imported

## Getting started
### Step 1: Install `eqp-select`:

#### NPM
```shell
npm install --save @eqproject/eqp-select
```
### Step 2: Import the EqpSelectModule and install :
```js
import { EqpSelectModule } from '@eqproject/eqp-select';

@NgModule({
  declarations: [AppComponent],
  imports: [EqpSelectModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

## API
### Inputs
| Input  | Type | Default | Required | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| [placeholder] | `string` | `-` | no | Label shown as placeholder inside select. |
| [enumData] | `any` | `-` | no | Enum property to use in order to create a key-value array. |
| [enumDataToExclude] | `Array<any>` | `-` | no | Array of elements to exclude among those included inside the given Enum. |
| [arrayData] | `Array<any>` |  `-` | no | Array of objects that select will show. The structure can be {keyProperty: '', valueProperty: ''} or an array of primitive elements. In the second case, `arrayKeyProperty` must be `ID` and `arrayValueProperty` must be `Label`. |
| [arrayKeyProperty] | `string` |  `-` | no | string that will be the key property. It must be `ID` if `arrayData` is an array of primitive elements |
| [arrayValueProperty] | `string` |  `-` | no | string that will be the value property. It must be `Label` if `arrayData` is an array of primitive elements |
| [ngModelOptions] | `any` | `-` | no | Options to pass to ngModel. |
| [ngModelInput] | `any` | `-` | no | Binded property of object. |
| [formGroupInput] | `any` |  `-` | no | FormGroup name, in case of formControlNameInput, that property need to be repeated for EVERY eqp-select used |
| [formControlNameInput] | `any` |  `-` | no | formControlName defined in ts formGroup control |
| [isRequired] | `boolean` | `false` | no | Set select as required. |
| [isDisabled] | `boolean` | `false` | no | Disable the select. |
| [isMultiLanguage] | `boolean` |  `false` | no | If true, see section and examples about use, if not interested in use, set to false or don't write it |
| [multilanguagePrefixKey] | `string` | `-` | no | Prefix of the key used to translate the property. |
| [isAlphabeticalOrderable] | `boolean` | `false` | no | Define if the datasource will be ordered. |
| [suffixIcon] | `string` | `-` | no | String containing the icon (mat-icon) that will appear after the label of the selected object(s). |
| [prefixIcon] | `string` | `-` | no | String containing the icon (mat-icon) that will appear before the label of the selected object(s). |
| [isMultiSelect] | `boolean` |  `false` | no | Define if the Select allows multiple selection. |
| [showCancelButton] | `boolean` |  `true` | no | Property to define if the button to clear the selection is visible. |
| [isSearchable] | `boolean` |  `false` | no | Defines if it's possible to type inside select and search among items. |
| [noResultSearchText] | `string` |  `'Nessun elemento trovato'` | no | Custom text when filter returns empty result. |
| [isReadonly] | `boolean` |  `false` | no | Set select as readonly. |
| [isSearchWhileComposing] | `boolean` |  `true` | no | Whether items should be filtered while composition started. |
| [appendToInput] | `string` |  `-` | no | Input used when the select is contained inside a dialog or tab and there are visualization problems. Useful value: `'body'`. |
| [dropdownPosition] | `auto \| top \| bottom \| auto` | `-` | no | Specifies the position of the dropdown. |
| [selectOnTab] | `boolean` | `true` | no | Select marked dropdown item using tab. |
| [selectAll] | `boolean` | `false` | no | Add an option inside the dropdown that allows the user to select all the elements. |
| [selectAllText] | `string` | `'Seleziona tutto'` | no | Text displayed in the select all option. |
| [selectableGroupAsModel] | `boolean` | `false` | no | Indicates whether to select all children or group itself. |
| [clearAllText] | `string` | `'Elimina'` | no | Text displayed as tooltip when hovering the clear button. |
| [customOption] | `TemplateRef<any>` | `-` | no | Custom template for the option inside the dropdown panel. |
| [customLabel] | `TemplateRef<any>` | `-` | no | Custom template for the selected item's label. |
| [class] | `string` |  `-` | no | Class useful to wrap Select. |


N.B. One of EnumData or ArrayData is required

### Outputs
| Output| Event arguments | Required | Description |
| ------------- | ------------- | ------------- | ------------- |
| (ngModelInputChange) | `any` | `-` | Invoked when the value changes and the ngModelInput is binded. When items are grouped (selectAll) it returns the group 'exploded'. |
| (formControlChange) | `any` | `-` | Invoked when the value changes and a form control is binded. When items are grouped (selectAll) it returns the group 'exploded'. |


## Reload data

When your datasource changes, you can update the datasource inside the select calling the function "reloadData", as follows:

```js
  reload() {
    this.selectToReload.reloadData();
  }
```
It will work for both arrayData and enumData changes.

## Use cases
### Case 1: Select with arrayData and ngModelInput

Define selector in html for normal use
```html
  <eqp-select 
    [arrayData]="dataSource" 
    [isSearchable]="true" 
    [(ngModelInput)]="selectWithArrayData" 
    placeholder="Seleziona elemento" 
    (ngModelInputChange)="selectChange($event)"
    [includeFullObject]="false" 
    [arrayKeyProperty]="'Key'"
    [arrayValueProperty]="'Description'">
  </eqp-select>
```

Define variables and functions in ts file
```ts

  dataSource : Array<{Key: string, Description: string}>;
  selectWithArrayData: any;
  
  ...

  selectChange(event) {
    // Body
  }
```

### Case 2: Multi-select with enumData and form control
Define selector in HTML
```html
    <eqp-select 
        [enumData]="testEnum" 
        [isMultiSelect]="true"
        placeholder="Seleziona elemento" 
        (formControlChange)="selectChange($event)"
        [formGroupInput]="formGroup"
        [formControlNameInput]="'selectWithEnumData'">
    </eqp-select>
```

Define variables and functions in ts file
```ts

  testEnum = TestEnum;
  formGroup: FormGroup;
  
  ...

  createForm() {
    this.formGroup = this.formBuilder.group({
      selectWithEnumData: []
    })
  }

  ...

  selectChange(event) {
    // Body
  }
```

### Case 3: Multi-select with select all
Define selector in HTML
```html
    <eqp-select 
        [enumData]="testEnum" 
        (formControlChange)="selectChange($event)"
        [formGroupInput]="formGroup"
        [formControlNameInput="'selectWithEnumDataAndSelectAll'"
        [isMultiSelect]="true"
        [selectAll]="true"
        [selectableGroupAsModel]="true"
        placeholder="Seleziona elemento"> 
    </eqp-select>
```

Define variables and functions in ts file
```ts

  testEnum = TestEnum;
  formGroup: FormGroup;
  
  ...

  createForm() {
    this.formGroup = this.formBuilder.group({
      selectWithEnumDataAndSelectAll: []
    })
  }

  ...

  selectChange(event) {
    // Body
  }
```

## Multi-language

To use multilanguage, set to true the input boolean variable and pass a string that can be used to find the element inside the translation JSON
```html
    <eqp-select 
        [enumData]="testEnum" 
        [isMultiSelect]="true"
        placeholder="Seleziona elemento" 
        (formControlChange)="selectChange($event)"
        [formGroupInput]="formGroup"
        [formControlNameInput]="'selectWithEnumData'"
        [isMultiLanguage]="true"
        [multilanguagePrefixKey]="'ENUMS.TEST.'">
    </eqp-select>
```

Then, where you set the language to use, like on login page or in navbar to switch language

```js
    this.translateHelper.loadJsonLanguage("en", jsonObject);
```


## Credits
This library has been developed by EqProject SRL, for more info contact: info@eqproject.it
