Table of contents
=================
 * [Getting started](#getting-started)
 * [API](#api)
 * [Use cases](#use-cases)
 * [Credits](#credits)

## Getting started
This component allows to draw on pictures and export the result as a Blob. Is is based on the use of fabric.js.

### Step 1: Install `eqp-attachments` and `fabric`:

```shell
npm install --save @eqproject/eqp-img-drawing
npm install fabric@3.6.2
```

### Step 2: 
#### Import the EqpImgDrawingModule:

```js
import { EqpImgDrawingModule } from '@eqproject/eqp-img-drawing';

@NgModule({
  declarations: [AppComponent],
  imports: [EqpImgDrawingModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

## API
### Inputs

| Input  | Type | Default | Required | Description |
| - | - | - | - | - |
| [src] | `string`| `null` | yes | Image url or base64 string |
| [i18n] | `I18nInterface?` | `'I18nEn'` | no | Text labels to use |
| [outputMimeType] | `string?` | `null` | no | Mime type of the output image |
| [outputQuality] | `number?` | `null` | no | Number between 0 and 1 to determine the quality of the ouput image |
| [loadingTemplate] | `TemplateRef<any>?` | `null` | no | Template shown while loading |
| [errorTemplate] | `TemplateRef<any>?` | `null` | no | Template shown in case of error |
| [enableTooltip] | `boolean?` | `false` | no | Enable/disable tooltip for toolbar buttons/actions |
| [tooltipLanguage] | `string?` | `'en'` | no | Language of tooltip (`en` or `fr`) |
| [width] | `number?` | `null` | Yes if no `src` provided | Width of the canvas |
| [height] | `number?` | `null` | Yes if no `src` provided | Height of the canvas |
| [forceSizeCanvas] | `boolean`| `true` | no | Force the canvas to width and height of image or with those specified |
| [forceSizeExport] | `boolean`| `false` | no | Force the exported image to width and height with those specified |
| [borderCss] | `string?` | `'none'` | no | Add a border to the canvas in CSS (example: `1px solib black`) |
| [enableRemoveImage] | `boolean`| `false` | no | Enable the option to remove the image loaded |
| [enableLoadAnotherImage] | `boolean`| `false` | no | Enable the option to load another image |
| [showCancelButton] | `boolean`| `true` | no | Enable the cancel button |
| [colors] | `{ [name: string]: string }` | `{ black: '#000', white: '#fff', yellow: '#ffeb3b', red: '#f44336', blue: '#2196f3', green: '#4caf50', purple: '#7a08af' }` | no | Colors available for users |
| [drawingSizes] | `{ [key: string]: number }?` | `{ small: 5, medium: 10, large: 25 }` | no | Sizes available for users |

### Outputs
| Output  | Event Arguments | Required | Description |
| ------------- | ------------- | ------------- | ------------- |
| (save) | `EventEmitter<Blob>` | no | Invoked on save button click, use `$event` to get the Blob of the new edited image |
| (cancel) | `EventEmitter<void>` | no | Invoked on cancel button click |

## Use cases
```html
<eqp-img-drawing [showCancelButton]="false" [enableLoadAnotherImage]="true" [enableRemoveImage]="true"
    [src]="src" (save)="saveBtn($event)" [i18n]="i18n" [locale]="locale" 
    [drawingSizes]="{ small: 5, medium: 10, large: 25, extra: 50 }">
</eqp-img-drawing>
```
```js   
    import { I18nInterface } from 'projects/eqp-img-drawing/src/public-api';
    
    ...
    
    i18n: I18nInterface = {
        saveBtn: 'Salva immagine',
        sizes: {
            extra: 'Extra'
        }
    };
    src: string = 'https://images.unsplash.com/photo-1565199953730-2ea3b119ae22?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80';
   
   ...
   
    saveBtn(event) {
        console.log(event)
    }
```


## Credits
This library has been developed by EqProject SRL, for more info contact: info@eqproject.it