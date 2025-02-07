
## Table of contents

- [About](#about)
- [Installation](#installation)
- [Development](#development)
- [License](#license)

## About

## Getting Started

### Installing and Importing

Install the package by command:

```sh
    npm install @eqproject/eqp-numeric --save
```

Import the module

```ts
import { EqpNumericModule } from "@eqproject/eqp-numeric";

@NgModule({
    imports: [
        ...
        EqpNumericModule
    ],
    declarations: [...],
    providers: [...]
})
export class AppModule {}
```

### Using 

```html
<input eqpNumericMask formControlName="value" />
```

 * `ngModel` An attribute of type number. If is displayed `'$ 25.63'`, the attribute will be `'25.63'`.

### Options 

You can set options...

```html
<!-- example for numeric currency -->
<input eqpNumericMask formControlName="value" [options]="{ prefix: '€ ', thousands: '.', decimal: ',' }"/>
```  

Available options: 

 * `align` - Text alignment in input. (default: `right`)
 * `allowNegative` - If `true` can input negative values.  (default: `true`)
 * `decimal` -  Separator of decimals (default: `'.'`)
 * `precision` - Number of decimal places (default: `2`)
 * `prefix` - Money prefix (default: `'$ '`)
 * `suffix` - Money suffix (default: `''`)
 * `thousands` - Separator of thousands (default: `','`)
 * `nullable` - when true, the value of the clean field will be `null`, when false the value will be `0`
 * `min` - The minimum value (default: `undefined`)
 * `max` - The maximum value (default: `undefined`)
 * `inputMode` - Determines how to handle numbers as the user types them (default: `NATURAL`)

Input Modes:

 * `FINANCIAL` - Numbers start at the highest precision decimal. Typing a number shifts numbers left.
                 The decimal character is ignored. Most cash registers work this way. For example:
   * Typing `'12'` results in `'0.12'`
   * Typing `'1234'` results in `'12.34'`
   * Typing `'1.234'` results in `'12.34'`
 * `NATURAL` - Numbers start to the left of the decimal. Typing a number to the left of the decimal shifts
               numbers left; typing to the right of the decimal replaces the next number. Most text inputs
               and spreadsheets work this way. For example:
   * Typing `'1234'` results in `'1234'`
   * Typing `'1.234'` results in `'1.23'`
   * Typing `'12.34'` results in `'12.34'`
   * Typing `'123.4'` results in `'123.40'`

You can also set options globally...

```ts
import { EqpNumericInputMode, EqpNumericModule } from "@eqproject/eqp-numeric";

export const customNumericMaskConfig = {
    align: "right",
    allowNegative: true,
    allowZero: true,
    decimal: ",",
    precision: 2,
    prefix: "R$ ",
    suffix: "",
    thousands: ".",
    nullable: true,
    min: null,
    max: null,
    inputMode: EqpNumericInputMode.FINANCIAL
};

@NgModule({
    imports: [
        ...
        EqpNumericModule.forRoot(customNumericMaskConfig)
    ],
    declarations: [...],
    providers: [...],
    bootstrap: [AppComponent]
})
export class AppModule {}
```

## Quick fixes

### Ionic 2-3

Input not working on mobile keyboard

```html
<!-- Change the type to 'tel' -->
    <input eqpNumericMask type="tel" formControlName="value" />
```

Input focus get hide by the mobile keyboard

on HTML
```html
<!-- Change the type to 'tel' -->
    <input eqpNumericMask type="tel" formControlName="value" [id]="'yourInputId' + index" (focus)="scrollTo(index)" />
```

on .ts
```ts
import { Content } from 'ionic-angular';

export class...

    @ViewChild(Content) content: Content;
  
    scrollTo(index) {
        let yOffset = document.getElementById('yourInputId' + index).offsetTop;
        this.content.scrollTo(0, yOffset + 20);
    }
```

## Development

### Prepare your environment
* Install [Node.js](http://nodejs.org/) and NPM
* Install local dev dependencies: `npm install` while current directory is this repo

### Development server
Run `npm start` or `npm run demo` to start a development server on port 8000 with auto reload + tests.

### Testing
* Run `npm test` to run tests once
* Run `npm run test:watch` to continually run tests in headless mode
* Run `npm run test:watch-browser` to continually run tests in the Chrome browser

When running in the Chrome browser, you can set code breakpoints to debug tests using these instructions:
* From the main Karma browser page, click the `Debug` button to open the debug window
* Press `ctrl + shift + i` to open Chrome developer tools
* Press `ctrl + p` to search for a file to debug
* Enter a file name like `input.handler.ts` and click the file
* Within the file, click on a row number to set a breakpoint
* Refresh the browser window to re-run tests and stop on the breakpoint

## License

MIT @ EqProject
