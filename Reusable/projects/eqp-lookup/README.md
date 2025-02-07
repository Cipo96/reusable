
Table of contents
=================

* [Getting started](#getting-started)
* [API](#api)
* [Use Cases](#use-cases)
* [Credits](#credits)


## Required

- [x] Angular Material installed and imported
- [x] ng-select installed and imported (v. 10.0.4)
  

## Getting started

### Step 1: Install `eqp-lookup`:

  

#### NPM

```shell

npm install  --save  @eqproject/eqp-lookup

```

### Step 2: Import the EqpLookupModule:

```js

import { EqpLookupModule } from  '@eqproject/eqp-lookup';

  

@NgModule({
    declarations: [AppComponent],
    imports: [EqpLookupModule],
    bootstrap: [AppComponent]
})

export class AppModule {}

```

### Step 3: Import ng-select styling:

  

#### Style.scss

```js

@import  "~@ng-select/ng-select/themes/material.theme.css";

```
 

## API

### Inputs

| Input | Type | Default | Required | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| [placeholder] | `string` | `-` | no | Text displayed as placeholder when no item is selected. |
| [bindLabel] | `string` | `'Label'` | no | Object property to use for label. |
| [bindKey] | `string` | `'ID'` | no | Object property to use for key. |
| [items] | `Array<objects>` | `-` | no | Array of objects that lookup will show. |
| [notFoundText] | `string` | `'Nessun risultato trovato'` | no | Custom text when filter returns empty result. |
| [genericAddComponent] | `DynamicLoaderDirectiveData` | `-` | no | Object containing the templateRef, inputParams and other configuration parameters to add elements into the datasource. |
| [isMultiple] | `boolean` | `false` | no | Defines if the lookup can accept more values, managed like an object array. |
| [isSearchable] | `boolean` | `true` | no | Defines if it's possible to type inside lookup and search among items. |
| [isClearable] | `boolean` | `true` | no | Defines if the cancel button is shown. |
| [isVirtualScroll] | `boolean` | `false` | no | Dynamic render of the items contained in the lookup. Useful in case of huge amount of data. |
| [isReadonly] | `boolean` | `false` | no | Set lookup as readonly. |
| [isRequired] | `boolean` | `false` | no | Set lookup as required. |
| [isDisabled] | `boolean` | `false` | no | Disable the lookup. |
| [entityType] | `string` | `-` | yes | Entity name to be searched on the server when the mode chosen isn't the one with `initialItems`. |
| [formGroupInput] | `any` | `-` | no | FormGroup that contains the specific FormControl of the lookup (to use if you're not using ngModelInput). |
| [formControlNameInput] | `any` | `-` | no | FormControl to use inside the FormGroup passed (to use if you're not using ngModelInput). |
| [ngModelInput] | `any` | `-` | no | ngModel binded to lookup. (to use if you're not using FormControl) |
| [isSearchWhileComposing] | `boolean` | `false` | no | Whether items should be filtered while composition started. |
| [bindCompleteObject] | `boolean` | `true` | no | Whether the binded object must be ID or the full object. |
| [appendToInput] | `string` | `-` | no | Input used when the lookup is contained inside a dialog or tab and there are visualization problems. Useful value: `body`. |
| [disableReloadOnLookupAddingCompleteParent] | `boolean` | `false` | no | Whether data must be reloaded after adding is complete. |
| [showOptionTooltip] | `boolean` | `false` | no | Defines if a tooltip must be shown on option hover. |
| [sortList] | `boolean` | `false` | no | Items sorting based on Label. |
| [dataFilter] | `Array<LinqPredicateDTO>` | `-` | no | It allows you to pass some simple filters to the server (used when `fullUrlHttpCall` is also passed) |
| [customConfig] | `LookupCustomConfig` | `-` | no | Configuration related to properties that compose the label and to full object inclusion (used when `fullUrlHttpCall` is also passed). |
| [complexDataFilter] | `Array<ComplexLinqPredicateDTO>` | `-` | no | It allows you to pass some complex filters to the server (used when `fullUrlHttpCall` is also passed) |
| [initialItems] | `Array<any>` | `false` | no | Initial datasource used if you want to bypass the server call. |
| [ngModelOptions] | `any` | `-` | no | Options related to ngModel. |
| [isEditable] | `boolean` | `false` | no | Defines if the selected item can be edited. |
| [isMultiline] | `boolean` | `false` | no | Defines if the item selected's label can be shown inside a multiple line input. |
| [dropdownPosition] | `auto \| top \| bottom` | `auto` | no | Specifies the position of the dropdown. |
| [selectOnTab] | `boolean` | `false` | no | Select marked dropdown item using tab. |
| [fullUrlHttpCall] | `string` | `-` | no | Full HTTP url for the server call. |
| [addButtonText] | `string` | `false` | no | Text displayed as tooltip when hovering on the add button. |
| [editButtonText] | `string` | `false` | no | Text displayed as tooltip when hovering on the edit button. |
| [selectAll] | `boolean` | `false` | no | Add an option inside the dropdown that allows the user to select all the elements. |
| [selectAllText] | `string` | `'Seleziona tutto'` | no | Text displayed in the select all option. |
| [groupBy] | `string \| Function` | `-` | no | Allow to group items by key or function expression. |
| [groupValue] | `(groupKey: string, children: any[]) => Object` | `-` | no | Function expression to provide group value. |
| [groupByProperty] | `string` | `-` | no | Property name used to group items. |
| [selectableGroup] | `boolean` | `false` | no | Allow to select group when groupBy is used. |
| [selectableGroupAsModel] | `boolean` | `false` | no | Indicates whether to select all children or group itself. |
| [clearAllText] | `string` | `-` | no | Text displayed as tooltip when hovering the clear button. |
| [customOption] | `TemplateRef` | `-` | no | Custom template for the option inside the dropdown panel. |
| [customLabel] | `TemplateRef` | `-` | no | Custom template for the selected item's label. |
| [manipulateDataFn] | `(items: any) =>  LookupDTO[]` | `-` | no | Function to manipulate data after the HTTP call used to retrieve items.  |
| [compareFunction] | `(iteratedObject: any, bindedObject: any) => boolean` | `-` | no | Function to compare the option values with the selected values. A boolean should be returned. |


### Outputs
| Output| Event arguments | Required | Description |
| ------------- | ------------- | ------------- | ------------- |
| (ngModelInputChange) | `any` | `-` | Invoked when the value changes and the ngModelInput is binded. When items are grouped it return the group 'exploded'. |
| (formControlChange) | `any` | `-` | Invoked when the value changes and a form control is binded. When items are grouped it return the group 'exploded'. |
| (lookupAddingCompleteParent) | `any` | `-` | Event emitted when the add process is completed and disableReloadOnLookupAddingCompleteParent is not true. |
| (searchChange) | `any` | `-` | Invoked when user searches among lookup items. It return the term typed and items filtered. |
| (keydown) | `any` | `-` | Invoked on keydown. |
| (clear) | `any` | `-` | Event emitted on select clear. |
| (valueSelected) | `any` | `-` | Event emitted when a value is selected. |
  



## Use cases

### Case 1: Lookup with initial items :

```html
<eqp-lookup
	placeholder="Lookup with initial items"
	[entityType]="'Question'"
	[initialItems]="questionInitialItems"
	[formGroupInput]="lookupFormGroup"
	[formControlNameInput]="'lookupWithInitialItems'"
	(formControlChange)="lookupChange($event)"
></eqp-lookup>
```

Define properties and functions in Typescript (or Javascript) file
```ts
lookupFormGroup : FormGroup | undefined;

...

createForm() {
	this.lookupFormGroup = this.formBuilder.group({
		lookupWithInitialItems: [null, Validators.required],
	})
}

...

this.http.post<LookupDTO[]>(url, config).subscribe(res  => {
	this.questionInitialItems = res;
})

...

lookupChange(event: any) {
	// body
}
```


### Case 2: Lookup with HTTP call and ngModelInput :

Define component selector in HTML
```html
<eqp-lookup
	placeholder="Lookup with HTTP call"
	[entityType]="'Question'"
	[fullUrlHttpCall]="fullUrlHttpCall"
	[(ngModelInput)]="lookupWithHttpCall"
	(ngModelInputChange)="lookupChange($event)"
	[isMultiline]="true"
></eqp-lookup>
```

Define properties and functions in Typescript (or Javascript) file
```ts
fullUrlHttpCall = environment.apiFullUrl + '/lookup/GetLookupEntities';
lookupWithHttpCall: LookupDTO | undefined;

...

lookupChange(event: any) {
	// body
}
```

### Case 3: Lookup with HTTP call and Form :

Define component selector in HTML
```html
<eqp-lookup
	placeholder="Lookup with aform"
	[entityType]="'Question'"
	[fullUrlHttpCall]="fullUrlHttpCall"
	[formGroupInput]="lookupFormGroup"
	[formControlNameInput]="'lookupWithForm'"
	(formControlChange)="lookupChange($event)"
	[isMultiline]="true"
></eqp-lookup>
```

Define properties and functions in Typescript (or Javascript) file
```ts
fullUrlHttpCall = environment.apiFullUrl + '/lookup/GetLookupEntities';
lookupFormGroup : FormGroup | undefined;
...

createForm() {
	this.lookupFormGroup = this.formBuilder.group({
		lookupWithForm: [null, Validators.required],
	})
}

...

lookupChange(event: any) {
	// body
}
```

### Case 4: Lookup with HTTP call and extra configs :

Define component selector in HTML
```html
<eqp-lookup
	[entityType]="'City'"
	placeholder="Città"
	[fullUrlHttpCall]="fullUrlHttpCall"
	[formGroupInput]="lookupFormGroup"
	[formControlNameInput]="'lookupWithExtraConfigs'"
	(formControlChange)="lookupChange($event)"
	[dataFilter]="[{PropertyFilters: [{PropertyName: 'FK_Province', PropertyValue: 10, RelationType: 1}]}]"
	[customConfig]="{LabelProperties: ['Name', 'Code', 'ID'], IncludeFullObject: true}"
></eqp-lookup>
```

Define properties and functions in Typescript (or Javascript) file
```ts
fullUrlHttpCall = environment.apiFullUrl + '/lookup/GetLookupEntities';
lookupFormGroup : FormGroup | undefined;

...

createForm() {
	this.lookupFormGroup = this.formBuilder.group({
		lookupWithExtraConfigs: [null, Validators.required],
	})
}

...

lookupChange(event: any) {
	// body
}
```

### Case 5: Editable Lookup :

Define component selector in HTML
```html
<eqp-lookup
	placeholder="Editable lookup"
	[entityType]="'Question'"
	[fullUrlHttpCall]="fullUrlHttpCall"
	[genericAddComponent]="{componentSelector: addQuestionComponent, idLookupEntity: getNumber(getFormControls('editableLookup').value), isEditable: true, disableRedirectAfterSave: true}"
	[isVirtualScroll]="true"
	[formGroupInput]="lookupFormGroup"
	[formControlNameInput]="'editableLookup'"
	(formControlChange)="lookupChange($event)"
	[isMultiline]="true"
	[isEditable]="true"
></eqp-lookup>
```

Define properties and functions in Typescript (or Javascript) file
```ts
fullUrlHttpCall = environment.apiFullUrl + '/lookup/GetLookupEntities';
lookupFormGroup : FormGroup | undefined;
addQuestionComponent = AddQuestionComponent;
...

createForm() {
	this.lookupFormGroup = this.formBuilder.group({
		editableLookup: [null, Validators.required],
	})
}

...

getNumber(element: number | string | undefined | null): number | null {
	if (element != null)
		return  Number(element);
	else
		return  <null><unknown>  element;
}

...

getFormControls(control: string) {
	return  this.lookupFormGroup.controls[control];
}

...

lookupChange(event: any) {
	// body
}
```

### Case 6: Lookup with select all :

Define component selector in HTML
```html
<eqp-lookup
	placeholder="Lookup with select all"
	[entityType]="'Question'"
	[fullUrlHttpCall]="fullUrlHttpCall"
	[isVirtualScroll]="true"
	(formControlChange)="lookupChange($event)"
	[formGroupInput]="lookupFormGroup"
	[formControlNameInput]="'lookupWithSelectAll'"
	[isMultiline]="true"
	[isEditable]="true"
	[selectAll]="true"
	[isMultiple]="true"
	[selectableGroupAsModel]="true"
></eqp-lookup>
```

Define properties and functions in Typescript (or Javascript) file
```ts
fullUrlHttpCall = environment.apiFullUrl + '/lookup/GetLookupEntities';
lookupFormGroup : FormGroup | undefined;
...

createForm() {
	this.lookupFormGroup = this.formBuilder.group({
		lookupWithSelectAll: [null, Validators.required],
	})
}

...

lookupChange(event: any) {
	// body
}
```

### Case 7: Lookup with groups :

Define component selector in HTML
```html
<eqp-lookup
	placeholder="Lookup with groups"
	[entityType]="'Question'"
	[fullUrlHttpCall]="fullUrlHttpCall"
	[isVirtualScroll]="true"
	[formGroupInput]="lookupFormGroup"
	[formControlNameInput]="'lookupWithGroups'"
	(formControlChange)="lookupChange($event)"
	[isMultiline]="true"
	[groupBy]="groupByFn"
	[groupValue]="groupValueFn"
	[groupByProperty]="'FullObject.FK_QuestionCategory'"
	[isMultiple]="true"
	[selectableGroup]="true"
	[selectableGroupAsModel]="true"
></eqp-lookup>
```

Define properties and functions in Typescript (or Javascript) file
```ts
fullUrlHttpCall = environment.apiFullUrl + '/lookup/GetLookupEntities';
lookupFormGroup : FormGroup | undefined;
groupByFn = (item: any) =>  item.FullObject.FK_QuestionCategory
groupValueFn = (groupKey: string, children: any[]) => ({Key:  groupKey, Label:  groupKey, Total:  children.length});
...

createForm() {
	this.lookupFormGroup = this.formBuilder.group({
		lookupWithGroups: [null, Validators.required],
	})
}

...

lookupChange(event: any) {
	// body
}
```
NB: It's possible to change the Label displayed for groups passing some values or using the `groupKey` to access the selected properties inside an array. 

### Case 8: Lookup with data manipulation and custom templates :

Define component selector in HTML
```html
<eqp-lookup
	placeholder="Lookup with function and custom templates"
	[entityType]="'Question'"
	[fullUrlHttpCall]="fullUrlHttpCall"
	[formGroupInput]="lookupFormGroup"
	[formControlNameInput]="'lookupWithFunctionAndCustomTemplates'"
	(formControlChange)="lookupChange($event)"
	[isMultiline]="true"
	[selectAll]="true"
	[customOption]="customOptionTemplate"
	[customLabel]="customLabelTemplate"
	[manipulateDataFn]="manipulateData"
></eqp-lookup>
```

Define custom templates in HTML
```html
<!-- Template for option inside the dropdown panel -->
<ng-template  #customOptionTemplate  ng-option-tmp  let-item="item"  let-index="index"  let-search="searchTerm">
	<div class="card">
		<div  class="card-body">
			<h5  class="card-title">{{item.Label}}</h5>
			<h6  class="card-subtitle mb-2 text-muted">Card subtitle</h6>
			<p  class="card-text">
				Some quick example text to build
			</p>
			<div>
				<a  href="#"  class="card-link">Card link</a>
				<a  href="#"  class="card-link">Another link</a>
			</div>
		</div>
	</div>
</ng-template>

<!-- Selected items' Label template -->
<ng-template  #customLabelTemplate  ng-label-tmp  let-item="item"  let-clear="clear">
	<span  title="{{item.Label}}">Custom template:  {{item.Label}}</span>
	<span  *ngIf="item.Total"  class="ml-1 badge badge-secondary"  style="color: black !important">{{item.Total}}</span>
	<span  class="ng-value-icon right"  (click)="clear(item)"  aria-hidden="true"> x </span>
</ng-template>
```

Define properties and functions in Typescript (or Javascript) file
```ts
fullUrlHttpCall = environment.apiFullUrl + '/lookup/GetLookupEntities';
lookupFormGroup : FormGroup | undefined;
@ViewChild("customOptionTemplate") customOptionTemplate: TemplateRef<any>;
@ViewChild("customLabelTemplate") customLabelTemplate: TemplateRef<any>;
...

createForm() {
	this.lookupFormGroup = this.formBuilder.group({
		lookupWithFunctionAndCustomTemplates: [null, Validators.required],
	})
}

manipulateData(items: any) : LookupDTO[] {
	let  res: LookupDTO[] = [];
	for(let  item  of  items) {
		item.Label += " added later";
		res.push(item)
	}
	return  res;
}

...

lookupChange(event: any) {
	// body
}
```
  

## Credits

This library has been developed by EqProject SRL, for more info contact: info@eqproject.it