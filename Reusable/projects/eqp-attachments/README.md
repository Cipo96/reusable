Table of contents
=================
 * [Getting started](#getting-started)
 * [API](#api)
 * [Use cases](#use-cases)
 * [Credits](#credits)

## Required
- [x] Angular Material installed and imported
- [x] Sweetalert2 (v9)


## Getting started
This package allows the upload/download of one or multiple attachments (one at a time).
The attachments can be files or links (except video files, this feature will be added later).
Has the possibility to render a preview for image files inside the eqp-table (an inline preview).
Can open a dialog containing a preview of the uploaded IAttachmentDTO (whatever it is - a document, an image or a link).

##### Notes
The directive does not comunicate with the backend of any application to save the attachments, all uploaded files are locally managed.

### Step 1: Install `eqp-attachments`:

#### NPM
```shell
npm install --save @eqproject/eqp-attachments
```

### Step 2: 
#### Import the EqpAttachmentsModule:
```js
import { EqpAttachmentsModule } from '@eqproject/eqp-attachments';

@NgModule({
  declarations: [AppComponent],
  imports: [EqpAttachmentsModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
```
#### Include the following stylesheet from fontawesome in your global scss file:
```js
@import "~@fortawesome/fontawesome-free/css/all.min.css";
```


  
## API
### Inputs
| Input  | Type | Default | Required | Description |
| - | - | - | - | - |
| [disableAction] | `boolean` | `false` | no | Has effect only if `[multipleAttachment]="true"`. If TRUE then the eqp-table containing the list of attachments does not show the action column.
| [showHeader] | `boolean` | `true` | no | Has effect only if `[multipleAttachment]="true"`. If TRUE then shows the header of the mat-card. |
| [headerTitle] | `string` | `"Elenco allegati"` | no | Has effect only if `[multipleAttachment]="true"` and `[showHeader]="true"`. It defines the title of the mat-card . |
| [attachmentsList] | `Array<IAttachmentDTO>` | `null` | no | Defines the initial array of attachments. If not passed it is instantiated as an empty array. Even in case `multipleAttachment` is set to FALSE you need to pass the eventual attachment as an Array. |
| [showMatCard] | `boolean` | `true` | no | If TRUE applies the `box-shadow` style of the mat-card |
| [multipleAttachment] | `boolean` | `true` | no | Defines how many attachments the directive needs to handle. If TRUE shows an eqp-table containing the values of `attachmentsList` with the possibility to download/open or delete any row. With any other value it shows only a button to upload one IAttachmentDTO (link or file).  |
| [loadMultipleFiles] | `boolean` | `false` | no | If it assumes the value TRUE then it will be possible to load multiple files at the same time. This feature is active ONLY if you manage multiple attachments, so if the `multipleAttachment` input takes on the value TRUE, otherwise it is always disabled. |
| [attachmentsColumns] | `Array<ConfigColumn>` | `null` | no | Has effect only if `[multipleAttachment]="true"`. Columns configuration for the eqp-table showing the list of IAttachmentDTO. 
| [emptyTableMessage] | `string` | `"Nessun dato trovato"` | no | Has effect only if `[multipleAttachment]="true"`. Sets the message to show if the eqp-table contains no elements. |
| [allowOnlyImages] | `boolean` | `false` | no | If TRUE allows the user to upload only image files of the following types: `["image/bmp", "image/gif", "image/jpeg", "image/tiff", "image/png"]`. If FALSE the user can upload a file of any type. |
| [acceptedFileTypes] | `string` | `*` | no | Sets the `accept` input attribute describing which file type to allow. |
| [isDisabled] | `boolean` | `false` | no | If TRUE it disables the buttons to add a new IAttachmentDTO. |
| [showInlinePreview] | `boolean` | `true`| no | Has effect only if `[multipleAttachment]="true"` and `attachmentsColumns` are not defined. Adds a column to the eqp-table to show a small preview of the IAttachmentDTO (if it is an image, otherwise an icon based on the content type of the file). With a click on it opens a dialog to view the selected attachment. |
| [getAttachmentEndpoint] | `string` | null | no | Sets the endpoint to call to get the complete IAttachmentDTO to be displayed inside the preview dialog. Used only for images with the `FileDataBase64` property missing (in any other case the `FilePath` property is used to render the preview). The directive makes a POST request without any token and with the selected IAttachmentDTO in the body. |
| [productionBaseUrl] | `string` | `null` | no | Hostname of the production environment. Needed to display in the preview dialog any document using the google viewer (example: `"https://eqproject.it"` - without any "/" at the end). Combined with the `FilePath` property sets the access path to the selected file. Make sure the forlder is accessible. |
| [compressionOptions] | `IOptions` | `{ maxSizeMB: 0.5, maxWidthOrHeight: 1920, useWebWorker: true }` | no | Sets the compression options for the uploaded images. |
| [downloadTooltipPosition] | `string` | `"below"` | no | Defines the position of the tooltip used by the eqp-table in the download column. The possible values are the following: `"below", "above", "left", "right"`.
| [openLinkLabel] | `string` | `"Apri link` | no | Sets the open a link button label. |
| [addButtonLabel] | `string` | `"Aggiungi"` | no | Sets the add button label. |
| [downloadLabel] | `string` | `"Download"` | no | Sets the download button label. |
| [deleteLabel] | `string` | `"Elimina"` | no | Sets the delete button label. |
| [fileNameLabel] | `string` | `"Nome file"` | no | Sets the file name feld label. |
| [previewLabel] | `string` | `"Anteprima"` | no | Sets the preview label. |
| [uploadFileLabel] | `string` | `"Carica file"` | no | Sets the upload file button label. |
| [confirmLabel] | `string` | `"Conferma"` | no | Sets the confirm button label. |
| [abortLabel] | `string` | `"Annulla"` | no | Sets the abort button label. |
| [saveLabel] | `string` | `"Salva"` | no | Sets the save button label. |
| [exitLabel] | `string` | `"Esci"` | no | Sets the exit button label. |
| [uploadWithDropboxLabel] | `string` | `"Carica con Dropbox"` | no | Sets the dropbox button label.";
| [cropLabel] | `string` | `"Scegli le dimensioni dell'immagine"` | no | Sets the crop label.";
| [flipHorinzontalLabel] | `string` | `"Capovolgi orizzontalmente"` | no | Sets the horizontal flip button label.";
| [flipVerticalLabel] | `string` | `"Capovolgi verticalmente"` | no | Sets the vertical flip button label.";
| [rotateRightLabel] | `string` | `"Ruota a destra"` | no | Sets the rotation left button label.";
| [rotateLeftLabel] | `string` | `"Ruota a sinistra"` | no | Sets the rotation right button label.";
| [eqpTableSearchText] | `string` | `"Cerca"` | no | Sets the eqp-table search input placeholder. |
| [isTableSearcheable] | `boolean` | `true` | no | It allows you to establish, in the case of multiple attachments management, whether the table is searchable or not (default: true) |
| [deleteDialogTitle] | `string` | `"Sei sicuro di voler procedere?"` | no | Sets the confirm dialog title when deleting an IAttachmentDTO. |
| [deleteDialogMessage] | `string` | `"Sei sicuro di voler cancellare quest'allegato?"` | no | Sets the confirm dialog message when deleting an IAttachmentDTO. |
| [noImageSelectedErrorMessage] | `string` | `"Non è possibile selezionare un file che non sia un'immagine"` | no | Has effect only if `[allowOnlyImages]="true"`. Sets the error dialog message when the user tries to upload a file which is not an image. |
| [wrongTypeSelectedErrorMessage] | `string` | `"Non è possibile caricare il file selezionato."` | no | Sets the error dialog message when user tries to upload a not allowed file . | 
| [videoPreviewErrorMessage] | `string` | `Impossibile aprire l'anteprima di un file video.` | no | Sets the warning dialog merrage when the user tries to open the preview of a video file. |
| [audioPreviewErrorMessage] | `string` | `Impossibile aprire l'anteprima di un file audio.` | no | Sets the warning dialog merrage when the user tries to open the preview of an audio file. |
| [isEqpTableMultiLanguage] | `boolean` | `false` | no | It allows you to establish whether the eqp-table containing the list of attachments uses multilanguage or not |
| [tablePaginatorVisible] | `boolean` | `true` | no | It allows you to establish, in the case of multiple attachments management, whether the table containing the list of attachments must be paged or not (default: true) |
| [tablePaginatorSize] | `number` | `null` | no | In case of managing multiple attachments, it allows you to establish the default page size for the table containing the list of attachments (default: null) |
| [showPreview] | `boolean` | `true` | no | It allows you to establish if there is the possibility to view the preview (default: true) |
| [separatedUploadButtons] | `boolean` | `false` | no | It allows you to establish, if the uploading buttons are separated or included in a menu (default: false) |
| [singleAttachmentDragAndDrop] | `boolean` | `false` | no | In the case of single attachment management, it allows you to establish if the drag and drop is included for the upload of the file (default: false) |
| [cropOptions] | `Array<CropOptionEnum>` | `[]` | no | Array of options to include during the crop of a file |
| [allowedTypes] | `Array<AttachmentType>` | `[ AttachmentType.FILE, AttachmentType.LINK ]` | no | Array to establish what type of attachments can be loaded |
| [cropDialogClass] | `string` |  no | It allows you to establish the css class of the image cropper (It needs the ::ng-deep pseudo-class) |

 

### Outputs
| Output  | Event Arguments | Required | Description |
| ------------- | ------------- | ------------- | ------------- |
| (localEditedAttachments) | `EventEmitter<Array<IAttachmentDTO>>` | no | Invoked when an IAttachmentDTO is created and added to `attachmentsList` or is deleted. It always return an Array of IAttachmentDTO, even if `[multipleAttachment]="true"`. |
| (abortAddAttachment) | `EventEmitter<any>` | no | Event triggered by pressing the EXIT button of the file upload modal. |
| (downloadAttachment) | EventEmitter<IAttachmentDTO> | no | Invoked when the user tries to download an IAttachmentDTO with at least one of the following properties not defined: `"FileDataBase64", "FileContentType", "FileName"`. It returns the user selected object. |
| (onDeleteAttachment) | `EventEmitter<IAttachmentDTO>` | no | Invoked when an IAttachmentDTO is deleted from `attachmentsList`. It returns the deleted element. |


### Model, Interfaces and Enums used

####  IAttachmentDTO Interface

| Property  | Description | Type | Examples |
| ------------- | ------------- | ------------- | ------------- |
| ID | ID of the record |` number | string` | - |
| FileName | Sets the name of the uploaded file or link  | `string` | - |
| FileContentType | Contains the content type of the uploaded file | `string` | "image/bmp", "image/gif", "image/jpeg", ... |
| FileExtension | Contains the extension of the uploaded file | `string` | "pdf", "jpg", "docx",... |
| FilePath | Contains the path where the uploaded file gets physically saved or contains the actual link uploaded by the user | `string` | "C:\\Users\\EQProject\\Desktop\\"  or "https://eqproject.it/".
| AttachmentType | It is an enum defining the type of the IAttachmentDTO | `AttachmentType` | Possible values: `FILE = 1`, `LINK = 2` and `DROPBOX = 3`. |
| FileDataBase64 | Contains the base64 string of the uploaded file | `string` | - | 
| IsImage | It is set to TRUE if the uploaded file is an image.  | `boolean` | - | 
| FileThumbnailBase64 | Contains the base64 string of a thumbnail of the uploaded image. When uploading an attachment it is always null. Usefull to display the inline preview of a previously uploaded image if the full image base64 is too havy (specially loading a long list of IAttachmentDTO). | `string` | - |

#### IOptions Interface
| Property  | Description | Type | Examples |
| ------------- | ------------- | ------------- | ------------- |
| maxSizeMB | Max size of compressed file expressed in MB. | `number` | - |
| maxWidthOrHeight | CompressedFile will scale down by ratio to a point that width or height is smaller than maxWidthOrHeight but, automatically reduce the size to smaller than the maximum Canvas size supported by each browser. | `number` | - |
| useWebWorker | Use multi-thread web worker, fallback to run in main-thread. | `boolean` | - |

#### Enums description

| EnumType  | Description | Notes | 
| ------------- | ------------- | ------------- |
| AttachmentType | Define the type of the IAttachmentDTO | FILE = 1: the user uploaded a file; LINK = 2: the user uploaded a link; DROPBOX = 3: the user uploaded a file using Dropbox |



## Use cases
### Use Example in class :

##### Notes
To make this examples work you need to replace the FileDataBase64 property value with a complete base64 string.

##### Breaking changes from the 2.0.3 version
File upload modal has been removed. So when using ViewChild, use addFile() function instead of openModalAddAttachment().


CASE 1: Single attachment
```html
<eqp-attachments 
    [multipleAttachment]="false" [attachmentsList]="[singleAttachment]"
    [allowOnlyImages]="false"
    [isDisabled]="false" [allowedTypes]="[1,2,3]"
    (downloadAttachment)="viewAttachment($event)"
    (localEditedAttachments)="catchAttachmentList($event)"
    (onDeleteAttachment)="onDeleteAttachment($event)"
    [showPreview]="false" [cropOptions]="[1,2]">
</eqp-attachments>
```

```js   
    singleAttachment: IAttachmentDTO = {
        ID: 0,
        IsImage: true,
        AttachmentType: 1,
        FileContentType: "image/png",
        FileName: "logo_eqp.png",
        FileExtension: "png",
        FileDataBase64: "iVBORw0KGgoAAAANSUhEUgAAAK[...]XSNgP0pGR02YAAAAASUVORK5CYII="
    }
  
    catchAttachmentList(event) {
        // TODO
    }
  
    viewAttachment(event) {
        // TODO
    }

    onDeleteAttachment(event) {
        // TODO
    }
```

CASE 2: Multiple attachments
```html
<eqp-attachments [multipleAttachment]="true" [attachmentsList]="attachmentsList"
    [allowOnlyImages]="false" [downloadTooltipPosition]="'below'" (downloadAttachment)="viewAttachment($event)"
    (localEditedAttachments)="catchAttachmentList($event)" [isTableSearcheable]="false"
    [tablePaginatorVisible]="false" [allowedTypes]="[1,2,3]" [cropOptions]="[1,2]">
</eqp-attachments>
```

```js   
    attachmentsList: Array<IAttachmentDTO> = [
    {
        ID: 0,
        IsImage: true,
        AttachmentType: 1,
        FileContentType: "image/png",
        FileName: "logo_eqp.png",
        FileExtension: "png",
        FileDataBase64: "iVBORw0KGgoAAAANSUhEUgAAAK[...]XSNgP0pGR02YAAAAASUVORK5CYII="
    },
    {
        ID: 0,
        IsImage: false,
        AttachmentType: 2,
        FileName: "EqProject",
        FilePath: "https://www.eqproject.it/",
    },
    ];
    
    catchAttachmentList(event) {
        // TODO
    }
  
    viewAttachment(event) {
        // TODO
    }
```

## Credits
This library has been developed by EqProject SRL, for more info contact: info@eqproject.it
