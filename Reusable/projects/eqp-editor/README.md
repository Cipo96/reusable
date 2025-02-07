Table of contents
=================
 * [Getting started](#getting-started)
 * [API](#api)
 * [Use cases](#use-cases)
 * [Credits](#credits)

## Required
- [x] Angular Material installed and imported

## Dependencies (automatically installed)
- [x] @syncfusion/ej2-angular-documenteditor: 18.4.35
- [x] @syncfusion/ej2-angular-dropdowns: 18.4.35
- [x] @syncfusion/ej2-angular-navigations: 18.4.35
- [x] @syncfusion/ej2-locale: 18.4.30
- [x] @ngx-translate/core: 13.0.0
- [x] @ngx-translate/http-loader: 6.0.0

## Getting started
This package allows you to use a word editor for creating documents in docx format. In addition to the text formatting features, it allows you to define a list of tags that can be inserted into the document by drag & drop


### Step 1: Install `eqp-editor`:

#### NPM
```shell
npm install --save @eqproject/eqp-editor
```

### Step 2: Import the EqpEditorModule :
```js
import { EqpEditorModule } from '@eqproject/eqp-editor';

@NgModule({
  declarations: [AppComponent],
  imports: [EqpEditorModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### Step 3: Add these scss files in your scss file :
```scss
@import "~@syncfusion/ej2-base/styles/material.css";
@import "~@syncfusion/ej2-buttons/styles/material.css";
@import "~@syncfusion/ej2-inputs/styles/material.css";
@import "~@syncfusion/ej2-popups/styles/material.css";
@import "~@syncfusion/ej2-lists/styles/material.css";
@import "~@syncfusion/ej2-navigations/styles/material.css";
@import "~@syncfusion/ej2-splitbuttons/styles/material.css";
@import "~@syncfusion/ej2-dropdowns/styles/material.css";
@import "~@syncfusion/ej2-calendars/styles/material.css";
@import "~@syncfusion/ej2-angular-documenteditor/styles/material.css";
```

### Step 4: Invoke the loadTranslateService method
This step is mandatory as it allows eqp-editor to load an external TranslateService (which must reside in the project) and which will be used to change the language of the documentation. If a project does not use the TranslateModule module it is still necessary to configure it and pass an empty TranslateService to eqp-editor
```js
@NgModule({
  declarations: [ AppComponent ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    EqpEditorModule,
    FormsModule,
    MaterialModule,
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
    { provide: MAT_DATE_LOCALE, useValue: 'it-IT' },
    { provide: LOCALE_ID, useValue: 'it-IT' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(private eqpEditorService: EqpEditorService) {
    this.eqpEditorService.loadTranslateService(this.translate);
  }
}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
```

## API
### Inputs
| Input | Type | Default | Required | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| [documentInstance] | `any` | `-` | no | Sfdt file (syncfusion extension) that you want to display in the editor window. It is used when you want to pass a document to be edited, otherwise it can be passed with a NULL value |
| [documentSaveType] | `DocumentSaveType` | `null` | no | Defines the behavior of the component when the 'Save' button is pressed in the editor. It can take one of the values: LOCAL, BLOB. With the LOCAL option, when the 'Save' button is pressed, the windows file explorer is opened to choose where to save the file; alternatively, the BLOB option invokes the documentSaved output event, passing the blob of the document to be saved as a parameter |
| [placeholderEndpoint] | `string` | `null` | no | Allows you to define the endpoint to call to retrieve the list of tags to be shown in the left column of the editor window. The recovered tags can be dragged into the document area by drag & drop. If not passed, the tagged column is hidden. The endpoint must always be called with a GET verb and must be public. |
| [label] | `string` | Tag | no | Allows you to redefine the label to be used as the title for the tag list. |
| [customButtons] | `Array<CustomToolbarItemModel>` | `null` | no | Allows you to add new custom buttons to those already present by default. For each button you can define different properties, as indicated in the section [Models used](#models-used). By default, the buttons shown in the editor are: 'New', 'Open', 'Separator', 'Undo', 'Redo', 'Separator', 'Image', 'Table', 'Hyperlink', 'Bookmark', 'TableOfContents', 'Separator', 'Header', 'Footer', 'PageSetup', 'PageNumber', 'Break', 'Separator', 'Find'. All other possible actions, according to those exposed by syncfusion, can be configured through this property |
| [editorHeight] | `string` | `800px` | no | Allows you to redefine the height of the editor area. |
| [useConditionPlaceholder] | `boolean` | true | no | If TRUE then it also displays the tag for managing the visibility conditions. The visibility conditions allow you to create IF-ENDIF blocks within the document to do so print any document blocks only upon the occurrence of appropriate conditions calculated on the tags |
| [conditionTagName] | `string` | `Condizione` | no | Allows you to define the placeholder label for managing conditions |
| [visibilityConditionTagName] | `string` | `Visibilità` | no | Allows you to define the placeholder label for managing the visibility condition (default: "Visibility") |
| [styleConditionTagName] | `string` | `Stile` | no | Allows you to define the placeholder label for managing the style condition (default: "Style") |
| [language] | `string` | `it (only it and en values ​​are allowed)` | yes | Allows you to define the language in which to localize the system (default: IT) |


### Outputs
| Output  | Event Arguments | Required | Description |
| ------------- | ------------- | ------------- | ------------- |
| [documentSaved] | `EventEmitter<Blob>` | no | This output event is invoked each time the 'Save' button is pressed. If the input parameter 'documentSaveType' is set to BLOB then the blob of the docx file is sent as the event parameter |
| [editorInit] | `EventEmitter<any>` | no | Output event called when the editor area is initialized. It allows you to intercept the initialization event, to do some operations inside the component that uses eqp-editor |

### Models used

####  CustomToolbarItemModel: syncfusion interface used to show all the additional features, not included among the default ones of eqp-editor
By default, the buttons shown in the editor are: 'New', 'Open', 'Separator', 'Undo', 'Redo', 'Separator', 'Image', 'Table', 'Hyperlink', 'Bookmark', 'TableOfContents', 'Separator', 'Header', 'Footer', 'PageSetup', 'PageNumber', 'Break', 'Separator', 'Find'.
All other possible actions, according to those exposed by syncfusion, can be configured through this class

| Property  | Description | Type | Required | Examples |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| prefixIcon | - | `string` | no | Defines single/multiple classes separated by space used to specify an icon for the button. The icon will be positioned before the text content if text is available, otherwise the icon alone will be rendered. |
| tooltipText | - | `string` | no | Specifies the text to be displayed on the Toolbar button. |
| id | - | `string` | no | Specifies the unique ID to be used with button or input element of Toolbar items. |
| text | - | `string` | no | Specifies the text to be displayed on the Toolbar button. |
| cssClass | - | `string` | no | Defines single/multiple classes (separated by space) to be used for customization of commands. |

####  IPlaceholderDTO: class for configure each individual filter

| Property  | Type | Examples |
| ------------- | ------------- | ------------- | ------------- |
| ID | `number` | Tag unique identifier |
| Name | `string` | Name of the tag to be shown in the tag column |
| Tag | `string` | Value of the tag to be written in the editor area when the element is dropped. |
| FK_Parent | `number` | Identifier of the parent of the tag. The tag list can be hierarchical |
| Children | `Array<IPlaceholderDTO>` | List of child tags |
| IsListOfElements | `boolean` | When it assumes the value TRUE, it allows you to drag and drop also on parent nodes |




## Use cases
### Use Example in class :

Define selector in html
```html
<eqp-editor (documentSaved)="documentSaved($event)" 
            [placeholderEndpoint]="placeholderEndPointVariable" 
            [documentSaveType]="DocumentSaveType.BLOB"></eqp-editor>
```

Define component variable for placeholders endpoint
```js   
    public placeholderEndPointVariable: string;
```

Initialize component variable for placeholders endpoint
```js   
    this.placeholderEndPointVariable = environment.apiFullUrl + "/Placeholder/GetPlaceholders";
```

Write the method to invoke when the documentSaved output event is fired
```js   
    documentSaved(blobFile) {
        //DO SOMETHING
        console.log(blobFile);
  }
```



## Credits
This library has been developed by EqProject SRL, for more info contact: info@eqproject.it