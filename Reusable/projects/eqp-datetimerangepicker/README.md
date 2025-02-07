# Table of contents

- [Getting started](#getting-started)
- [API](#api)
- [Use cases](#use-cases)
- [Credits](#credits)

## Required

- [x] Angular Material installed and imported
- [x] @angular-material-components/datetime-picker (^15.0.0)
- [x] @angular-material-components/moment-adapter (v9.0.0)
- [x] @angular/material-moment-adapter (15.2.9)
- [x] Moment.js
- [x] @ngx-translate/core

## Getting started

This package is based on angular material and momentjs and allows to create 4 kind of date/time picker: date only, time only, both and a date range.

##### Notes

By default returns the seletected date converted in UTC time zone.

### Step 1: Install `eqp-datetimerangepicker`:

#### NPM

```shell
npm i --save @eqproject/eqp-datetimerangepicker
```

If needed dependecies are not installed run this commands:

```shell
npm i @angular-material-components/datetime-picker@15.0.0
npm i --save  @angular-material-components/moment-adapter
npm i moment --save
npm i @ngx-translate/core --save
npm i @angular/material-moment-adapter --save
ng add @angular/material
```

### Step 2:

#### Import EqpDatetimerangepickerModule, NgxMatDatetimePickerModule and NgxMatTimepickerModule :

```js
import { EqpDatetimerangepickerModule } from "@eqproject/eqp-datetimerangepicker";
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from "@angular-material-components/datetime-picker";

@NgModule({
  declarations: [AppComponent],
  imports: [EqpDatetimerangepickerModule, NgxMatDatetimePickerModule, NgxMatTimepickerModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### Step 4: Invoke the loadTranslateService method

This step is mandatory as it allows eqp-datetimerangepicker to load an external TranslateService (which must reside in the project) and which will be used to change the language of the default presets in the DATE_RANGE picker.

```js
import { EqpDatetimerangepickerModule, EqpDatetimerangepickerService } from "@eqproject/eqp-datetimerangepicker";
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from "@angular/common/http";
import { LOCALE_ID, NgModule } from "@angular/core";
import { registerLocaleData } from "@angular/common";
import localeIt from "@angular/common/locales/it";
import { MAT_DATE_LOCALE } from "@angular/material/core";
registerLocaleData(localeIt, "it-IT");

@NgModule({
  declarations: [AppComponent],
  imports: [
    EqpDatetimerangepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: false
    })
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "it-IT" },
    { provide: LOCALE_ID, useValue: "it-IT" }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(
    private eqpDateTimeRangePickerservice: EqpDatetimerangepickerService,
    private translateService: TranslateService
  ) {
    this.eqpDateTimeRangePickerservice.loadTranslateService(this.translateService);
  }
}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
```

## API

### Inputs

| Input                       | Type                                                                                     | Default                                                                                               | Required | Description                                                                                                                                                                                                                         |
| --------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type]                      | `PickerModeEnum `                                                                        | `PickerModeEnum.DATE`                                                                                 | no       | Defines the view mode of the picker. DATETIME = 1 DATE = 2 TIME = 3 DATE_RANGE=4                                                                                                                                                    |
| [readonlyInput]             | `boolean`                                                                                | `false`                                                                                               | no       | Defines the input area as read only. if true the value can be changed only trougth the calendar.                                                                                                                                    |
| [minDate]                   | `Date, null`                                                                             | `null`                                                                                                | no       | Sets the lowest date that can be inserted.                                                                                                                                                                                          |
| [maxDate]                   | `Date, null`                                                                             | `null`                                                                                                | no       | Sets the highest date that can be inserted.                                                                                                                                                                                         |
| [isRequired]                | `boolean`                                                                                | `false`                                                                                               | no       | Marks the input as required. Needed only with NgModelInput (with FormControl Validators.Required is enough)                                                                                                                         |
| [formGroupInput]            | `FormGroup, null`                                                                        | `null`                                                                                                | no       | FormGroup in which the eqp-datetimerangepicker is used. If not null then `formControlNameInput` is required.                                                                                                                        |
| [formControlNameInput]      | `string, null`                                                                           | `null`                                                                                                | no       | Has effect only if `formGroupInput` is not null. FormControlName of the control used in the defined `formGroupInput`. (NOTE: use it without `ngModelInput`).                                                                        |
| [formControlNameInputStart] | `string, null`                                                                           | `null`                                                                                                | no       | FormControlName used for the start date of the DATE_RANGE picker. (NOTE: use it instead `formControlName` without `ngModelInput`, in order to work you also need to specify `formControlNameInputEnd` property).                    |
| [formControlNameInputEnd]   | `string, null`                                                                           | `null`                                                                                                | no       | FormControlName used for the end date of the DATE_RANGE picker. (NOTE: use it instead `formControlName` without `ngModelInput`, in order to work you also need to specify `formControlNameInputStart` property).                    |
| [ngModelInput]              | `Date, string, null`                                                                     | `null`                                                                                                | no       | ngModel to bind the inputfor all kind of picker. (NOTE: use it instead formGroup and formControl binding)                                                                                                                           |
| [placeholder]               | `string`                                                                                 | `DATE: "Seleziona una data", DATETIME: "Seleziona una data e un orario", TIME: "Seleziona un orario"` | no       | placeholder viewed in case of DATE, DATETIME or TIME picker.                                                                                                                                                                        |
| [startPlaceholeder]         | `string`                                                                                 | `DATE_RANGE: "Seleziona data inizio"`                                                                 | no       | placeholder viewed in case of DATE_RANGE picker forn the stat date. (NOTE: use it instead `placeholder` property, in order to work you also need to specify `endPlaceholeder` property).                                            |
| [endPlaceholeder]           | `string`                                                                                 | `DATE_RANGE: "fine"`                                                                                  | no       | placeholder viewed in case of DATE_RANGE picker forn the end date. (NOTE: use it instead `placeholder` property, in order to work you also need to specify `startPlaceholeder` property).                                           |
| [disabled]                  | `boolean`                                                                                | `false`                                                                                               | no       | If true, the picker is readonly and can't be modified.                                                                                                                                                                              |
| [showSpinners]              | `boolean`                                                                                | `true`                                                                                                | no       | If true, the spinners above and below input are visible                                                                                                                                                                             |
| [showSeconds]               | `boolean`                                                                                | `true`                                                                                                | no       | If true, it is not possible to select seconds                                                                                                                                                                                       |
| [disableMinute]             | `boolean`                                                                                | `false`                                                                                               | no       | If true, the minute is readonly.                                                                                                                                                                                                    |
| [stepSecond]                | `number`                                                                                 | `1`                                                                                                   | no       | The number of seconds to add/substract when clicking second spinners.                                                                                                                                                               |
| [stepHour]                  | `number`                                                                                 | `1`                                                                                                   | no       | The number of hours to add/substract when clicking hour spinners.                                                                                                                                                                   |
| [stepMinute]                | `number`                                                                                 | `1`                                                                                                   | no       | The number of minutes to add/substract when clicking minute spinners.                                                                                                                                                               |
| [color]                     | `ThemePalette`                                                                           | `undefined`                                                                                           | no       | Color palette to use on the datepicker's calendar.                                                                                                                                                                                  |
| [enableMeridian]            | `boolean`                                                                                | `false`                                                                                               | no       | Whether to display 12H or 24H mode.                                                                                                                                                                                                 |
| [touchUi]                   | `boolean`                                                                                | `false`                                                                                               | no       | Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather than a popup and elements have more padding to allow for bigger touch targets.                                                        |
| [showRangePreset]           | `boolean`                                                                                | `true`                                                                                                | no       | Whether to display the DATE_RANGE picker presets window. if true the `customRangePreset` is required                                                                                                                                |
| [customRangePreset]         | `Array<{label: string; orderPosition?: number; getRangeFunction?: () => [Date, Date];}>` | `[]`                                                                                                  | no       | Array of objects to define the range presets of DATE_RANGE picker. if `showRangePreset` is true, then the customRangePreset must be defined                                                                                         |
| [language]                  | `string`                                                                                 | `it`                                                                                                  | no       | `it` or `en` to specify the locale language of the application,                                                                                                                                                                     |
| [timeType]                  | `TimeTypeEnum`                                                                           | `TimeTypeEnum.STRING`                                                                                 | no       | The type of data returned in the case of TIME mode picker.                                                                                                                                                                          |
| [showButtons]               | `boolean`                                                                                | `false`                                                                                               | no       | show the buttons, inside modal window, to cancel and apply the selected data.                                                                                                                                                       |
| [cancelButtonText]          | `string`                                                                                 | `Cancella`                                                                                            | no       | cancel button text, inside modal window.                                                                                                                                                                                            |
| [applyButtonText]           | `string`                                                                                 | `Applica`                                                                                             | no       | apply button text, inside modal window.                                                                                                                                                                                             |
| [datepickerFilter]          | `(date: Date) => boolean`                                                                | `null`                                                                                                | no       | apply function called to filter all selectable days (if the function return true, the day is selectable). NOTE: day 0 is SUNDAY. This input is not used in TIME mode                                                                |
| [showTimePopover]           | `boolean`                                                                                | `true`                                                                                                | no       | Using the TIME picker via modal or keyboard input. false: the input can be inserted only by keyboard (using formControl the only output type ll'be string), true: keyboard input will be disabled and can only be entered via modal |

## customRangePreset definition

The DATE_RANGE preset window has some default preset that needs only the label property to be used. this default preset has poper orderPosition value and getRangeFunction.

| Property         | Type                              | Default   | Required | Description                                                                                                                          |
| ---------------- | --------------------------------- | --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| label            | `string`                          |           | yes      | text to show on the preset button                                                                                                    |
| orderPosition    | `number, undefined`               | undefined | no       | index to specify the position of the preset. To inset a custom preset between default preset, the ordetPosition must be between them |
| getRangeFunction | `(() => [Date, Date]), undefined` | undefined | no       | funcion to be executed from the picker to get the range on click of the preset                                                       |

### Default preset

| label       | orderPosition |
| ----------- | ------------- |
| Today       | 100           |
| Last 7 days | 200           |
| This week   | 300           |
| This month  | 400           |
| This year   | 500           |
| Last week   | 600           |
| Last month  | 700           |
| Last year   | 800           |

### Outputs

| Output               | Event Arguments     | Required | Description                                                                                                                  |
| -------------------- | ------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| (ngModelInputChange) | `EventEmitter<any>` | no       | Invoked when the selected value changes and `ngModelInput` is bound. The output type is the same as the `ngModelInput` type. |
| (formControlChange)  | `EventEmitter<any>` | no       | Invoked when the selected value changes and `formGroupInput` is bound.                                                       |

### Model, Interfaces and Enums used

#### Enums description

| EnumType         | Description                                                       | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ---------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `PickerModeEnum` | Define the view mode of the picker.                               | Has the following values: `DATETIME = 1` -> shows a picker to select date and time; `DATE = 2` -> shows a date only picker and the returned time of date is set to ("00:00:00"); `TIME = 3` -> shows a time only picker which returns the selected time; `DATE_RANGE = 4` -> shows a date only picker where can be selected the initial and the end date of a range, and returns the start and the end dates with time ("00:00:00"); |
| `TimeTypeEnum`   | Used to define the type of data returned in the case of TIME mode | `DATE = 1`; `STRING = 2`                                                                                                                                                                                                                                                                                                                                                                                                             |

```js
export enum PickerModeEnum {
  DATETIME = 1,
  DATE = 2,
  TIME = 3,
  DATE_RANGE = 4
}
```

```js
export enum TimeTypeEnum {
  DATE = 1,
  STRING = 2,
}
```

# Examples & Use cases

### It is highly recommended not to use ngModelInput together with formControl - formGroup

## Using ngModelInput (type = DATE)

```html
<eqp-datetimerangepicker
  [minDate]="minDate"
  [maxDate]="maxDate"
  [type]="PickerModeEnum.DATE"
  [disabled]="disable"
  [(ngModelInput)]="date"
  [isRequired]="isRequired"
  [placeholder]="''"></eqp-datetimerangepicker>
```

```js
PickerModeEnum = PickerModeEnum;
minDate: Date = new Date(); // minimum date selectable
maxDate: Date = null; // maximum date selectable (ex. last day of this year)
disable: boolean = false; // flag to set the input disabled
date: Date | null = null;
```

## Using ngModelInput (type = TIME)

```html
<eqp-datetimerangepicker
  [type]="PickerModeEnum.TIME"
  [timeType]="PickerModeEnum.DATE"
  [disabled]="disable"
  [(ngModelInput)]="timePickerInput"
  [placeholder]="''"
  [isRequired]="isRequired"
  [showSeconds]="showSeconds"></eqp-datetimerangepicker>
```

```js
PickerModeEnum = PickerModeEnum;
TimeTypeEnum = TimeTypeEnum;
timePickerInput: Date | string | null = null;
showSeconds: boolean = true; // flag to allow second selection from the picker
```

## Using ngModelInput (type = DATE_TIME)

```html
<eqp-datetimerangepicker
  [minDate]="minDate"
  [maxDate]="maxDate"
  [type]="PickerModeEnum.DATE_TIME"
  [disabled]="disable"
  [(ngModelInput)]="dateTimePickerWithTime"
  [placeholder]="''"
  [isRequired]="isRequired"
  [showSeconds]="showSeconds"></eqp-datetimerangepicker>
```

```js
PickerModeEnum = PickerModeEnum;
dateTimePickerWithTime: Date | null = null;
showSeconds: boolean = true; // flag to allow second selection from the picker
```

## Using ngModelInput (type = DATE_RANGE)

```html
<eqp-datetimerangepicker
  [customRangePreset]="customRangePreset"
  [minDate]="minDate"
  [maxDate]="maxDate"
  [type]="PickerModeEnum.DATE_RANGE"
  [disabled]="disable"
  [(ngModelInput)]="range"
  [startPlaceholeder]="''"
  [endPlaceholeder]="''"
  [isRequired]="isRequired"
  [showRangePreset]="showRangePreset"
  [language]="presetLanguage"></eqp-datetimerangepicker>
```

```js
PickerModeEnum = PickerModeEnum;
range: {from: Date | null, to: Date | null} = { from: null, to: null };
showRangePreset: boolean = true // flag to show the preset window
presetLanguage: string = "en"

getTwoDayAgoToNow: (() => [Date, Date]) | undefined = () => [
    new Date(new Date().setDate(new Date().getDate() - 2)),
    new Date()
  ];

customRangePreset = [
  {
    label: "Tow days ago",
    orderPosition: 150, // to show this preset between Today and Last year
    getRangeFunction: this.getTwoDayAgoToNow //function to be executed that rerun [Date, Date]
  }, // custom preset
  {
    label: "Today"
  }, // default presets to be used
  {
    label: "Last year"
  },
  {
    label: "This month"
  },
  {
    label: "Last week"
  },
  {
    label: "This week"
  }
];
```

## Using formControl (type = DATE)

```html
<eqp-datetimerangepicker
  [minDate]="minDate"
  [maxDate]="maxDate"
  [type]="PickerModeEnum.DATE"
  [disabled]="disable"
  [formGroupInput]="formGroup"
  formControlNameInput="dateControl"
  [isRequired]="isRequired"
  [placeholder]="''"></eqp-datetimerangepicker>
```

## Using formControl (type = TIME)

```html
<eqp-datetimerangepicker
  [type]="PickerModeEnum.TIME"
  [timeType]="TimeTypeEnum.STRING"
  [disabled]="disable"
  [formGroupInput]="formGroup"
  formControlNameInput="timePickerInputControl"
  [placeholder]="''"
  [isRequired]="isRequired"
  [showSeconds]="showSeconds"></eqp-datetimerangepicker>
```

## Using formControl (type = DATE_TIME)

```html
<eqp-datetimerangepicker
  [minDate]="minDate"
  [maxDate]="maxDate"
  [type]="PickerModeEnum.DATE_TIME"
  [disabled]="disable"
  [formGroupInput]="formGroup"
  formControlNameInput="dateTimePickerWithTimeControl"
  [placeholder]="''"
  [isRequired]="isRequired"
  [showSeconds]="showSeconds"></eqp-datetimerangepicker>
```

## Using formControl (type = DATE_RANGE)

```html
<eqp-datetimerangepicker
  [customRangePreset]="customRangePreset"
  [minDate]="minDate"
  [maxDate]="maxDate"
  [type]="PickerModeEnum.DATE_RANGE"
  [disabled]="disable"
  [formGroupInput]="formGroup"
  formControlNameInputStart="dateRangeControlStart"
  formControlNameInputEnd="dateRangeControlEnd"
  [startPlaceholeder]="''"
  [endPlaceholeder]="''"
  [isRequired]="isRequired"
  [showRangePreset]="showRangePreset"
  [language]="presetLanguage"></eqp-datetimerangepicker>
```

```js
//#region time picker fields
TimeTypeEnum = TimeTypeEnum;
timePickerInput: Date | string | null = null;
//#endregion

PickerModeEnum = PickerModeEnum;
formGroup = new FormGroup({
  timePickerInputControl: new FormControl(this.timePickerInput),
  dateTimePickerWithTimeControl: new FormControl(this.dateTimePickerWithTime),
  dateRangeControlStart: new FormControl(this.range?.from),
  dateRangeControlEnd: new FormControl(this.range?.to),
  dateControl: new FormControl(this.date)
});
```

## Credits

This library has been developed by EqProject SRL, for more info contact: info@eqproject.it
