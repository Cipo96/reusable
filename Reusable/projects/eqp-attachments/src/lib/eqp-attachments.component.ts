import { HttpClient } from "@angular/common/http";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { ConfigColumn, EqpTableComponent, TooltipPositionType, TypeColumn } from "@eqproject/eqp-table";
import imageCompression from "browser-image-compression";
import { base64ToFile, ImageCroppedEvent, ImageCropperComponent, ImageTransform } from "ngx-image-cropper";
import { AttachmentHelperService } from "./helpers/attachment.helper";
import { AttachmentType, CropOptionEnum, IAttachmentDTO } from "./interfaces/IAttachment";
import { IOptions } from "./interfaces/IOptions";
import { EqpAttachmentDialogService } from "./services/eqp-attachment-dialog.service";

declare var Dropbox: any;

import { concatMap, from, Observable } from "rxjs";
import { EqpAttachmentService } from "./services/eqp-attachment.service";

const toBase64 = (file) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.toString());
    reader.onerror = (error) => reject(error);
  });

@Component({
  selector: "eqp-attachments",
  templateUrl: "./eqp-attachments.component.html",
  styleUrls: ["./eqp-attachments.component.scss"]
})
export class EqpAttachmentsComponent implements OnInit {
  //#region @Input del componente

  /**
   * Se TRUE allora nasconde la colonna per le azioni sull'allegato (nel caso "multipleAttachment" è TRUE).
   */
  @Input("disableAction") disableAction: boolean = false;

  /**
   * Se TRUE mostra il titolo nell'header nel caso in cui "multipleAttachment" è TRUE ("Elenco allegati" di default).
   */
  @Input("showHeader") showHeader: boolean = true;

  /**
   * Titolo da visualizzare se il parametro "showHeader" è TRUE. Di devault viene visualizzato "Elenco allegati".
   */
  @Input("headerTitle") headerTitle: string = "Elenco allegati";

  /**
   * Sorgente dati da visualizzare. Nel caso si vuole gestire un singolo allegato va passato in ogni caso come Array.
   */
  @Input("attachmentsList") attachmentsList: Array<IAttachmentDTO> = null;

  /**
   * Se TRUE non mostra la MatCard (nel caso in cui "multipleAttachment" è TRUE).
   */
  @Input("showMatCard") showMatCard: boolean = true;

  /**
   * Se FALSE allora il componente mostra solo il pulsante di caricamento di un singolo file, una volta caricato il file invoca l'evento di output "localEditedAttachments".
   * Se TRUE allora il componente mostra l'elenco di tutti gli allegati ricevuto nel parametro "attachmentsList".
   */
  @Input("multipleAttachment") multipleAttachment: boolean = true;

  /**
   * Se assume il valore TRUE allora sarà possibile caricare più file per volta. Questa funzionalità è attiva
   * SOLO se si gestiscono allegati multipli, quindi se l'input 'multipleAttachment' assume il valore TRUE, altrimenti è sempre disabilitata.
   */
  @Input("loadMultipleFiles") loadMultipleFiles: boolean = false;

  /**
   * Configurazione delle colonne della eqp-table per la visualizzazione degli allegati (caso "multipleAttachment" è TRUE).
   */
  @Input("attachmentsColumns") attachmentsColumns: Array<ConfigColumn> = null;

  /**
   * Imposta il messaggio da visualizzare nel caso in cui la tabella degli allegati (nel caso in cui "multipleAttachment" è TRUE) è vuota.
   */
  @Input("emptyTableMessage") emptyTableMessage: string = "Nessun dato trovato";

  /**
   * Se TRUE allora permette di selezionare soltanto file di tipo immagine, avente uno dei mimetype
   * specificati dentro AttachmentHelperService.
   * Se FALSE permette di selezionare qualsiasi tipo di file
   */
  @Input("allowOnlyImages") allowOnlyImages: boolean = false;

  /**
   * Specifica i tipi di file che è possibile caricare
   */
  @Input("acceptedFileTypes") acceptedFileTypes: string;

  /**
   * Se TRUE disabilita il pulsante di Aggiunta allegato (a prescindere dal valore del parametro "multipleAttachment").
   */
  @Input("isDisabled") isDisabled: boolean = false;

  /**
   * Mostra/nasconde la colonna per visualizzare l'anteprima dei file nella tabella (caso multipleAtatchments = true).
   */
  @Input("showInlinePreview") showInlinePreview: boolean = false;

  /**
   * Endpoint da chiamare per recueprare l'IAttachmentDTO completo da vedere nell'anteprima. La chiamata sarà in POST e nel body
   * conterrà l'IAttachmentDTO selezionato dall'utente.
   * La chiamata viene eseguita solo per l'anteprima delle immagini essendo necessario il base64 completo dell'immagine a dimensione reale.
   * Per documenti/link basta che sia popolata la proprietà FilePath di IAttachmentDTO.
   */
  @Input("getAttachmentEndpoint") getAttachmentEndpoint: string = null;

  /**
   * Hostname dell'ambiente di produzione dell'applicativo. Necessario per visualizzare l'anteprima dei documenti
   * tramite il viewer di google.
   * NOTA: Per visualizzare l'anteprima è necessario che la prorietà FilePath dell'IAttachmentDTO sia popolata e che
   * sia abilitato l'accesso alla cartella sul server tramite hostname.
   */
  @Input("productionBaseUrl") productionBaseUrl: string = null;

  /**
   * Opzioni per la compressione delle immagini caricate.
   */
  @Input("compressionOptions") compressionOptions: IOptions = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  };

  /**
   * Array di AttachmentType che si possono aggiungere
   */
  @Input("allowedTypes") allowedTypes: Array<AttachmentType> = [AttachmentType.FILE, AttachmentType.LINK];

  /**
   * Permette di stabilire se la eqp-table contenente l'elenco degli allegati utilizza
   * il multilingua oppure no
   */
  @Input("isEqpTableMultiLanguage") isEqpTableMultiLanguage: boolean = false;

  /**
   * Permette di stabilire, in caso di gestione allegati multipli, se la tabella contenente l'elenco
   * degli allegati deve essere paginata oppure no
   */
  @Input("tablePaginatorVisible") tablePaginatorVisible: boolean = true;

  /**
   * Permette di stabilire, in caso di gestione allegati multipli, se la tabella contenente l'elenco
   * degli allegati deve contenere il campo di ricerca oppure no
   */
  @Input("isTableSearcheable") isTableSearcheable: boolean = true;

  /**
   * In caso di gestione allegati multipli, permette di stabilire la dimensione pagina di default
   * per la tabella contenente l'elenco degli allegati
   */
  @Input("tablePaginatorSize") tablePaginatorSize: number = null;

  /**
   * Permette di scegliere il modo in cui i file devono essere caricati
   */
  // @Input("uploadType") uploadType: UploadTypeEnum = UploadTypeEnum.FILE_AND_LINK;

  /**
   * Permette di stabilire se i pulsanti per il caricamento dei file sono separati o in un menù a tendina
   */
  @Input("separatedUploadButtons") separatedUploadButtons: boolean = false;

  /**
   * Permette di scegliere se dare la possibilità di vedere o no l'anteprima
   */
  @Input("showPreview") showPreview: boolean = true;

  /**
   * In caso di allegato singolo, permette di scegliere se aggiungere file tramite drag and drop
   */
  @Input("singleAttachmentDragAndDrop") singleAttachmentDragAndDrop: boolean = false;

  /**
   * Array di opzioni che si possono utilizzare per il crop
   */
  @Input("cropOptions") cropOptions: Array<CropOptionEnum> = [];

  /**
   * Classe custom da assegnare al dialog del crop immagini
   */
  @Input("cropDialogClass") cropDialogClass: string;

  /**
   * Input per definire le label da usare nel componente
   */
  @Input("downloadTooltipPosition") downloadTooltipPosition: TooltipPositionType = TooltipPositionType.Below;
  @Input("openLinkLabel") openLinkLabel: string = "Apri link";
  @Input("addButtonLabel") addButtonLabel: string = "Aggiungi";
  @Input("downloadLabel") downloadLabel: string = "Download";
  @Input("deleteLabel") deleteLabel: string = "Elimina";
  @Input("fileNameLabel") fileNameLabel: string = "Nome file";
  @Input("previewLabel") previewLabel: string = "Anteprima";
  @Input("uploadFileLabel") uploadFileLabel: string = "Carica file";
  @Input("confirmLabel") confirmLabel: string = "Conferma";
  @Input("abortLabel") abortLabel: string = "Annulla";
  @Input("saveLabel") saveLabel: string = "Salva";
  @Input("exitLabel") exitLabel: string = "Esci";
  @Input("uploadWithDropboxLabel") uploadWithDropboxLabel: string = "Carica con Dropbox";
  @Input("cropLabel") cropLabel: string = "Scegli le dimensioni dell'immagine";
  @Input("eqpTableSearchText") eqpTableSearchText: string = "Cerca";
  @Input("deleteDialogTitle") deleteDialogTitle: string = null;
  @Input("deleteDialogMessage") deleteDialogMessage: string = "Sei sicuro di voler cancellare quest'allegato?";
  @Input("noImageSelectedErrorMessage") noImageSelectedErrorMessage: string =
    "Non è possibile selezionare un file che non sia un'immagine.";
  @Input("wrongTypeSelectedErrorMessage") wrongTypeSelectedErrorMessage: string =
    "Non è possibile caricare il file selezionato.";
  @Input("videoPreviewErrorMessage") videoPreviewErrorMessage: string =
    "Impossibile aprire l'anteprima di un file video.";
  @Input("videoPreviewErrorMessage") audioPreviewErrorMessage: string =
    "Impossibile aprire l'anteprima di un file audio.";
  @Input("flipHorinzontalLabel") flipHorinzontalLabel: string = "Capovolgi orizzontalmente";
  @Input("flipVerticalLabel") flipVerticalLabel: string = "Capovolgi verticalmente";
  @Input("rotateRightLabel") rotateRightLabel: string = "Ruota a destra";
  @Input("rotateLeftLabel") rotateLeftLabel: string = "Ruota a sinistra";
  //#endregion

  //#region @Output del componente

  /**
   * Restituisce la lista aggiornata degli allegati.
   */
  @Output() localEditedAttachments: EventEmitter<Array<IAttachmentDTO>> = new EventEmitter<Array<IAttachmentDTO>>();

  /**
   * Evento scatenato alla pressione del pulsante ESCI della modale di caricamento file.
   */
  @Output() abortAddAttachment: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Evento di output che restituisce l'IAttachmentDTO selezionato per il download nel caso FileDataBase64, FileContentType o FileName non fossero specificati.
   */
  @Output("downloadAttachment") downloadAttachment: EventEmitter<IAttachmentDTO> = new EventEmitter<IAttachmentDTO>();

  /**
   * Evento di output che restituisce l'elemento eliminato prima che questo venga effettivamente rismosso dalla lista.
   */
  @Output("onDeleteAttachment") onDeleteAttachment: EventEmitter<IAttachmentDTO> = new EventEmitter<IAttachmentDTO>();

  //#endregion

  //#region Proprietà per gestione caricamento nuovo allegato
  newAttachment: IAttachmentDTO = {} as IAttachmentDTO;
  newMultipleAttachments: Array<IAttachmentDTO> = [];
  attachmentType = AttachmentType;
  // uploadTypeEnum = UploadTypeEnum;
  newAttachmentForm: FormGroup;
  selectedFile: File = null;
  selectedFiles: Array<File> = null;
  showCropImage: boolean = false;
  @ViewChild("dialogAddAttachment", { static: true }) dialogAddAttachment: TemplateRef<any>;
  dialogRefAddAttachment: MatDialogRef<TemplateRef<any>>;
  @ViewChild("dialogAddMultipleAttachment", { static: true }) dialogAddMultipleAttachment: TemplateRef<any>;
  dialogRefCropImage: MatDialogRef<TemplateRef<any>>;
  @ViewChild("dialogCropImage", { static: true }) dialogCropImage: TemplateRef<any>;
  //#endregion

  //#region Proprietà per gestione ridimensionamento file di tipo image
  imageChangedEvent: any = "";
  croppedImage: any = "";
  transform: ImageTransform = {};
  canvasRotation = 0;
  @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent;
  @ViewChild("imageInput") imageInput: any;
  //#endregion

  AttachmentType = AttachmentType;
  selectedAttachment: IAttachmentDTO;

  originalWidth: number;
  originalHeight: number;
  customWidth: number;
  customHeight: number;

  @ViewChild("attachmentTable", { static: false }) attachmentTable: EqpTableComponent;
  @ViewChild("inlinePreviewTemplate", { static: true }) inlinePreviewTemplate: TemplateRef<any>;
  @ViewChild("dialogPreview", { static: true }) dialogPreview: TemplateRef<any>;

  imageFile: File;

  addingLinkMode: boolean = false;

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private eqpAttachmentService: EqpAttachmentService
  ) {}

  async ngOnInit() {
    //Se è stata richiesta la gestione delle sole immagini allora imposta il filtro per le estensioni possibili da caricare
    if (!this.acceptedFileTypes)
      if (this.allowOnlyImages == true) this.acceptedFileTypes = "image/*";
      else this.acceptedFileTypes = "*";

    // Se non sono stati specificati i tipi da gestire ma è stato passato null o un array vuoto imposto i tipi di default.
    if (!this.allowedTypes || this.allowedTypes.length == 0)
      this.allowedTypes = [AttachmentType.FILE, AttachmentType.LINK, AttachmentType.DROPBOX];
    else if (
      this.allowedTypes.find((t) => t != AttachmentType.FILE && t != AttachmentType.LINK && t != AttachmentType.DROPBOX)
    ) {
      EqpAttachmentDialogService.Warning(
        'Almeno uno degli AttachmentType selezionati nel parametro "allowedTypes" non esiste.'
      );
      this.allowedTypes = [AttachmentType.FILE, AttachmentType.LINK, AttachmentType.DROPBOX];
    }

    //Se è stata richiesta la gestione multipla degli allegati allora configura l'eqp-table
    if (this.multipleAttachment == true && (!this.attachmentsColumns || this.attachmentsColumns.length == 0)) {
      this.configureColumns();
    }

    if (this.attachmentsList == null) this.attachmentsList = new Array<IAttachmentDTO>();

    this.checkAttachmentImage();

    if (this.allowedTypes.includes(3)) {
      this.eqpAttachmentService.loadDropboxScript();
    }
  }

  public reloadData() {
    if (this.attachmentTable) this.attachmentTable.reloadDatatable();
  }

  checkAttachmentImage() {
    this.attachmentsList.forEach((a) => {
      a.IsImage = AttachmentHelperService.checkImageFromMimeType(a.FileContentType);
    });
  }

  //#region Gestione elenco allegati

  /**
   * Configura le colonne per l'eqp-table nel caso in cui il parametro "multipleAttachments" è TRUE.
   */
  configureColumns() {
    this.attachmentsColumns = [];
    if (this.disableAction != true) {
      this.attachmentsColumns.push({
        key: "action",
        display: "",
        type: TypeColumn.MenuAction,
        buttonMenuIcon: "more_vert",
        styles: { flex: "0 0 6%" },
        actions: [
          { name: this.deleteLabel, icon: "delete", fn: (element, index, col) => this.deleteAttachment(element) }
        ]
      });
    }

    let downloadColumn = {
      key: "attachment",
      display: "",
      type: TypeColumn.SimpleAction,
      styles: { flex: "0 0 6%" },
      actions: [
        {
          name: "",
          fontawesome: true,
          icon: (element) => {
            return this.showInlinePreview
              ? element.AttachmentType == AttachmentType.FILE
                ? "fas fa-cloud-download-alt"
                : "fas fa-external-link-alt"
              : this.getAttachmentIcon(element);
          },
          fn: (element, col, elementIndex) => this.viewAttachment(element),
          tooltip: {
            tooltipText: (element) => {
              return element.AttachmentType == AttachmentType.FILE ? this.downloadLabel : this.openLinkLabel;
            },
            tooltipPosition: this.downloadTooltipPosition
          }
        }
      ]
    };

    let inlinePreviewColumn = {
      key: "InlinePreview",
      display: this.previewLabel,
      type: TypeColumn.ExternalTemplate,
      externalTemplate: this.inlinePreviewTemplate,
      styles: { flex: "0 0 10%" }
    };

    let fileNameColumn = { key: "FileName", display: this.fileNameLabel };

    if (this.showInlinePreview) {
      this.attachmentsColumns.push(inlinePreviewColumn);
      this.attachmentsColumns.push(fileNameColumn);
      this.attachmentsColumns.push(downloadColumn);
    } else {
      this.attachmentsColumns.push(downloadColumn);
      this.attachmentsColumns.push(fileNameColumn);
    }
  }

  /**
   * Elimina un allegato eliminando anche il file presente nello storage di archiviazione utilizzato (AWS o cartella progetto)
   * @param element IAttachmentDTO da cancellare
   */
  deleteAttachment(element: IAttachmentDTO) {
    EqpAttachmentDialogService.Confirm(
      this.deleteDialogMessage,
      () => {
        this.removeAttachmentFromList(this.attachmentsList.indexOf(element));
      },
      true,
      this.deleteDialogTitle
    );
  }

  /**
   * Rimuove l'allegato selezionato dalla lista "attachmentsList" e invoca l'evento di output che restituisce la lista aggiornata.
   * @param attachmentIndex Indice dell'attachment da rimuovere
   */
  removeAttachmentFromList(attachmentIndex: number) {
    this.onDeleteAttachment.emit(this.attachmentsList[attachmentIndex]);

    this.attachmentsList.splice(attachmentIndex, 1);
    if (this.attachmentTable) this.attachmentTable.reloadDatatable();
    this.localEditedAttachments.emit(this.attachmentsList);
  }

  /**
   * Scarica l'allegato o apre il link
   * @param element Allegato da mostrare
   */
  viewAttachment(attachment: IAttachmentDTO) {
    if (attachment.AttachmentType == AttachmentType.LINK) {
      window.open(attachment.FilePath, "_blank");
      return;
    }

    if (attachment.FileDataBase64 && attachment.FileContentType && attachment.FileName) {
      let source = `data:${attachment.FileContentType};base64,${attachment.FileDataBase64}`;
      const link = document.createElement("a");
      link.href = source;
      link.download = `${attachment.FileName}`;
      link.click();
    } else {
      this.downloadAttachment.emit(attachment);
    }
  }

  /**
   * Ridefinisce l'icona da mostrare nella colonna dell'eqp-table per ogni file.
   * L'icona varia in base all'estensione del file
   * @param attachment
   */
  getAttachmentIcon(attachment: IAttachmentDTO) {
    if (attachment.AttachmentType == AttachmentType.LINK) return "fas fa-link";
    else return AttachmentHelperService.getIconFromFileExtensione(attachment.FileExtension);
  }

  //#endregion

  /**
   * In caso di allegato singolo, sceglie quale metodo richiamare in base al tipo di allegato
   */
  addFile(attachmentType: AttachmentType, imageInput = null) {
    if (attachmentType == AttachmentType.LINK) {
      this.switchToAddingLinkMode();
    } else if (attachmentType == AttachmentType.FILE) {
      imageInput.click();
    } else {
      this.chooseDropboxFile();
    }
  }

  createAttachmentForm() {
    //Crea la form per la validazione dei campi
    this.newAttachmentForm = this.formBuilder.group({
      type: [this.newAttachment.AttachmentType, Validators.required],
      name: [this.newAttachment.FileName],
      path: [this.newAttachment.FilePath],
      customHeight: [this.customHeight],
      customWidth: [this.customWidth]
    });
  }

  close(emitCloseEvent = true) {
    this.newAttachment = {} as IAttachmentDTO;
    this.newMultipleAttachments = new Array<IAttachmentDTO>();
    this.abortFile();
    if (this.newAttachmentForm) this.newAttachmentForm.reset();

    this.dialogRefCropImage.close();
    this.restoreOriginalDimensions();

    if (emitCloseEvent == true && this.abortAddAttachment) this.abortAddAttachment.emit();
  }

  /**
   * In base al tipo di allegato controlla se disabilitare o meno il pulsante per salvare.
   * Funzione usata nel [disable] del pulsante "Salva" del dialog per l'aggiunta di un allegato.
   * @returns
   */
  disableSave() {
    if (this.loadMultipleFiles != true) {
      if (this.newAttachment.AttachmentType == AttachmentType.FILE) {
        return !this.newAttachment.FileDataBase64;
      } else {
        return !this.newAttachment.FilePath;
      }
    } else {
      return (
        this.newMultipleAttachments.filter(
          (p) =>
            (p.AttachmentType == AttachmentType.FILE && !p.FileDataBase64) ||
            (p.AttachmentType == AttachmentType.LINK && !p.FilePath)
        ).length > 0
      );
    }
  }

  confirmAddAttachment() {
    if (this.newAttachment.IsImage) {
      this.newAttachment.FileDataBase64 = this.imageCropper.crop().base64.split(";base64,")[1];
    }

    if (this.loadMultipleFiles != true) {
      if (this.newAttachment.AttachmentType == AttachmentType.LINK && !this.newAttachment.FileName)
        this.newAttachment.FileName = this.newAttachment.FilePath;

      if (this.attachmentsList == null) this.attachmentsList = new Array<IAttachmentDTO>();

      this.attachmentsList.push(this.newAttachment);
    } else {
      if (this.newMultipleAttachments == null || this.newMultipleAttachments.length == 0) return;

      if (this.attachmentsList == null) this.attachmentsList = new Array<IAttachmentDTO>();

      this.attachmentsList = this.attachmentsList.concat(this.newMultipleAttachments);
    }

    if (this.attachmentTable) this.attachmentTable.reloadDatatable();

    this.localEditedAttachments.emit(this.attachmentsList);

    if (this.newAttachment.IsImage) {
      this.dialogRefCropImage.close();
      this.restoreOriginalDimensions();
    }
  }

  /**
   * Apre il dialog per l'anteprima dell'allegato selezionato.
   * @param row
   * @returns
   */
  async openPreviewDialog(row: IAttachmentDTO) {
    this.selectedAttachment = JSON.parse(JSON.stringify(row));

    if (this.selectedAttachment.AttachmentType == AttachmentType.FILE) {
      if (this.selectedAttachment.FileContentType.startsWith("video")) {
        EqpAttachmentDialogService.Warning(this.videoPreviewErrorMessage);
        return;
      } else if (this.selectedAttachment.FileContentType.startsWith("audio")) {
        EqpAttachmentDialogService.Warning(this.audioPreviewErrorMessage);
        return;
      }
    }

    if (this.getAttachmentEndpoint && this.selectedAttachment.IsImage && !this.selectedAttachment.FileDataBase64) {
      await this.getAttachmentByID()
        .then((res) => {
          this.selectedAttachment.FileDataBase64 = res.FileDataBase64;
        })
        .catch((err) => {
          EqpAttachmentDialogService.Error(err);
        });
    }

    if (this.selectedAttachment.AttachmentType == AttachmentType.LINK) {
      this.selectedAttachment.TrustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.selectedAttachment.FilePath
      );
    } else if (
      this.selectedAttachment.IsImage &&
      !this.selectedAttachment.FileDataBase64 &&
      !this.selectedAttachment.FileThumbnailBase64
    ) {
      EqpAttachmentDialogService.Info("Impossibile aprire l'anteprima dell'allegato, file mancante.");
      return;
    } else if (!this.selectedAttachment.IsImage) {
      if (this.selectedAttachment.FilePath && this.productionBaseUrl) {
        this.selectedAttachment.TrustedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          "https://docs.google.com/gview?url=" +
            this.productionBaseUrl +
            "/" +
            this.selectedAttachment.FilePath +
            "&embedded=true"
        );
      } else {
        EqpAttachmentDialogService.Info("Impossibile aprire l'anteprima del documento!");
        return;
      }
    }

    this.dialog.open(this.dialogPreview, {
      disableClose: true,
      hasBackdrop: true
    });
  }

  async getAttachmentByID() {
    return this.http.post<IAttachmentDTO>(this.getAttachmentEndpoint, this.selectedAttachment).toPromise();
  }

  //#region Gestione caricamento file

  /**
   * Evento scatenato alla selezione del file (o dei file).
   * Se il caricamento è SINGOLO o se comunque è stato selezionato un solo file allora si occupa di controllare se si tratta di un immagine in modo da
   * mostrare le funzionalità del croppie (per ritagliare l'immagine) oppure no.
   * Se il file caricato non è un immagine allora genera direttamente il base64 e lo associa all'allegato da salvare.
   * Se invece il caricamento dei file è MULTIPLO e sono presenti più file allora esegue le stesse operazioni ignorando però il contrllo
   * immagine per il croppie (in caso di caricamento multiplo le funzionalità del croppie sono disabilitate).
   */
  async onFileAdded(event, isFileDropped: boolean = false) {
    this.showCropImage = false;
    let filesOnInput = isFileDropped ? event : event.target.files;

    //Se è stato richiesto il caricamento SINGOLO oppure se il caricamento è MULTIPLO ma è stato selezionato un solo file
    //allora verifica se il file è un immagine (per mostrare il CROPPIE)
    if ([...filesOnInput].length == 1 || this.loadMultipleFiles != true) {
      this.selectedFile = filesOnInput[0];
      this.selectedFiles = filesOnInput;
      if (!this.selectedFile) return;

      //Memorizza i dati per l'allegato
      this.newAttachment = await this.createAttachmentFromUploadedFile(this.selectedFile, false);
      this.newMultipleAttachments = new Array<IAttachmentDTO>();
      this.newMultipleAttachments.push(this.newAttachment);

      //Se è stata richiesta la gestione delle sole immagini ma per errore è stato selezionato un file che non è un immagine
      let checkOnlyImage = this.checkAllowOnlyImageFile(this.newAttachment);
      if (checkOnlyImage == false) return;

      this.createAttachmentForm();

      //Verifica se il file caricato è un'immagine oppure no. Se è un immagine, prima di caricarla mostra il croppie per il resize.
      //Se non è un immagine allora genera il Base64
      if (this.newAttachment.IsImage == true) {
        this.getImageDimensions(filesOnInput[0]);

        //Mostra il croppie e disabilita la form finchè non termina la modifica dell'immagine
        this.newAttachmentForm.disable();
        this.newAttachmentForm.controls["customWidth"].enable();
        this.newAttachmentForm.controls["customHeight"].enable();
        this.showCropImage = true;
        this.imageFile = event;

        this.dialogRefCropImage = this.dialog.open(this.dialogCropImage, {
          disableClose: true,
          hasBackdrop: true,
          width: "60%",
          maxHeight: "80%",
          maxWidth: "70vh"
        });
      } else {
        this.showCropImage = false;
        let base64Result = await this.getBase64FromFile(this.selectedFile);
        this.newAttachment.FileDataBase64 = base64Result.Base64File;
        this.newAttachment.FileContentType = base64Result.ContentType;
        this.confirmAddAttachment();
      }
    } else {
      this.selectedFiles = filesOnInput;
      if (!this.selectedFiles || this.selectedFiles.length == 0) return;

      this.newMultipleAttachments = new Array<IAttachmentDTO>();
      for (let i = 0; i < this.selectedFiles.length; i++) {
        let newAttachment: IAttachmentDTO = await this.createAttachmentFromUploadedFile(
          this.selectedFiles[i],
          true,
          true
        );
        //Se è stata richiesta la gestione delle sole immagini ma per errore è stato selezionato un file che non è un immagine
        let checkOnlyImage = this.checkAllowOnlyImageFile(newAttachment);
        if (checkOnlyImage == false) return;

        this.newMultipleAttachments.push(newAttachment);
      }
      this.confirmAddAttachment();
    }

    //Resetto il valore del file input in modo da scatenare il change anche se si dovesse caricare lo stesso file
    if (!isFileDropped) event.target.value = "";
  }

  /**
   * A partire dal FILE ricevuto in input ricostruisce l'oggetto IAttachmentDTO e lo restituisce.
   * Se il parametro getBase64 viene passato a TRUE allora, sempre a partire dal file,genera il base64 e
   * ricava il ContentType da associare all'oggetto IAttachmentDTO da restituire
   * @param currentFile Oggetto FILE da processare
   * @param getBase64 Se TRUE allora calcola base64 e ContentType del file passato in input
   * @returns Restituisce un oggetto di tipo IAttachmentDTO
   */
  private async createAttachmentFromUploadedFile(
    currentFile: File,
    getBase64: boolean = true,
    cropFile: boolean = false
  ): Promise<IAttachmentDTO> {
    let newAttachment: IAttachmentDTO = {} as IAttachmentDTO;
    //Memorizza i dati per l'allegato
    newAttachment.AttachmentType = AttachmentType.FILE;
    newAttachment.FileContentType = currentFile.type;
    newAttachment.FileName = currentFile.name;
    newAttachment.FileExtension = currentFile.name.substr(currentFile.name.lastIndexOf(".") + 1);
    newAttachment.IsImage = AttachmentHelperService.checkImageFromMimeType(currentFile.type);

    if (getBase64 == true) {
      let base64Result = await this.getBase64FromFile(currentFile);
      newAttachment.FileDataBase64 = base64Result.Base64File;
      newAttachment.FileContentType = base64Result.ContentType;

      if (newAttachment.IsImage && newAttachment.FileDataBase64 && cropFile) {
        this.getCroppedAndUpload(`data:${base64Result.ContentType};base64,${base64Result.Base64File}`, newAttachment);
      }
    }

    return newAttachment;
  }

  /**
   * A partire dal file passato in input restituisce un oggetto
   * contenente il base64 del file e il suo contentType
   * @param currentFile Oggetto File da cui estrapolare base64 e contentType
   * @returns Restituisce un oggetto avente le proprietà Base64File e ContentType
   */
  private async getBase64FromFile(currentFile: File): Promise<any> {
    let base64File = await toBase64(currentFile);
    let contentType: string = null;
    if (base64File) {
      // Loris 20/01/2022: PROBLEMA - Quando eseguo l'upload di un file .sql non viene salvato/scaricato correttamente.
      //                   Questo succede perchè non viene popolato il FileContentType. Per risolvere il problema
      //                   faccio un controllo e se non esiste il FileContentType allora lo recupero dal base64 ottenuto.
      contentType = base64File.split(",")[0].split(":")[1].split(";")[0];
      // Un altro metodo per leggere il ccontent type del file è tramite una regular expression:
      base64File = base64File.split(",")[1];
    }

    let result = {
      Base64File: base64File,
      ContentType: contentType
    };

    return result;
  }

  /**
   * Controlla se il file che si sta caricando è supportato dal sistema.
   * @returns
   */
  private checkAcceptedFiles(): boolean {
    if (
      (this.loadMultipleFiles != true && this.selectedFile.type.startsWith("video")) ||
      (this.loadMultipleFiles == true && [...this.selectedFiles].filter((p) => p.type.startsWith("video")).length > 0)
    )
      return false;

    if (this.acceptedFileTypes == "*") return true;

    //Verifica che i tipi del file (o dei file) caricati siano coerenti con quelli accettati dalla direttiva
    let accepted: boolean = true;
    if (this.loadMultipleFiles != true) accepted = this.acceptedFileTypes.includes(this.selectedFile.type);
    else {
      let uploadedFileTypes: string[] = [...this.selectedFiles].map((p) => p.type);
      uploadedFileTypes.forEach((type) => {
        if (!this.acceptedFileTypes.includes(type)) accepted = false;
      });
    }

    //Questo controllo permette di gestire le casistiche per cui vengono indicati come tipi validi, ad esempio, 'image/*'
    if (!accepted && this.loadMultipleFiles != true) {
      for (let t of this.acceptedFileTypes.split(",").filter((t) => t.includes("*"))) {
        accepted = this.selectedFile.type.startsWith(t.split("*")[0]);
        if (accepted) break;
      }
    }
    return accepted;
  }

  /**
   * Se eqp-attachments è stata configurata per il caricamento delle sole immagini allora verifica che il file passato in
   * input sia effettivamente un immagine o no.
   * Se il controllo va a buon fine restituisce TRUE altrimenti mostra un messaggio d'errore e restituisce FALSE
   */
  private checkAllowOnlyImageFile(newAttachment): boolean {
    if (this.allowOnlyImages == true && newAttachment.IsImage != true) {
      EqpAttachmentDialogService.Error(this.noImageSelectedErrorMessage);
      this.abortFile();
      return false;
    } else if (!this.checkAcceptedFiles()) {
      EqpAttachmentDialogService.Error(this.wrongTypeSelectedErrorMessage);
      this.abortFile();
      return false;
    }

    return true;
  }

  //#region Gestione crop file

  getImageDimensions(img: any) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const image = new Image();
      image.src = e.target.result;
      image.onload = (rs) => {
        this.originalHeight = rs.currentTarget["height"];
        this.originalWidth = rs.currentTarget["width"];

        if (this.originalWidth > 1280) {
          this.customWidth = 1280;
          this.customHeight = Math.round((1280 * this.originalHeight) / this.originalWidth);
        } else {
          this.customHeight = rs.currentTarget["height"];
          this.customWidth = rs.currentTarget["width"];
        }
      };
    };
    reader.readAsDataURL(img);
  }

  restoreOriginalDimensions() {
    this.customWidth = this.originalWidth;
    this.customHeight = this.originalHeight;
    this.canvasRotation = 0;
    this.transform = {};
  }

  onDimensionsChange(dimension: string) {
    if (dimension == "H") {
      this.customWidth = Math.round((this.customHeight * this.originalWidth) / this.originalHeight);
    } else if (dimension == "W") {
      this.customHeight = Math.round((this.customWidth * this.originalHeight) / this.originalWidth);
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.getCroppedAndUpload(this.croppedImage, this.newAttachment);
  }

  getCroppedAndUpload(file, newAttachment: IAttachmentDTO) {
    var self = this;

    var file: any = base64ToFile(file);

    const options = this.compressionOptions;

    /**
     * Comprime l'immagine passando come parametri le options create nell'oggetto sopra, e il file dal reader principale
     */
    imageCompression(file, options).then((fileCompressed) => {
      let fileReader = new FileReader();

      //Faccio la push di ogni file all'interno dell'array di file dell'item da mandare al server
      fileReader.onload = function () {
        let resultReader = <string>fileReader.result;
        var marker = ";base64,";
        newAttachment.FileDataBase64 = resultReader.substring(resultReader.indexOf(marker) + marker.length);
        self.showCropImage = false;
        if (self.newAttachmentForm) {
          self.newAttachmentForm.enable();
        }
      };

      fileReader.readAsDataURL(fileCompressed);
    });
  }

  // confirmCrop() {
  //   this.imageCropper.crop();
  //   this.dialogRefCropImage.close();
  //   this.restoreOriginalDimensions();
  // }

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
  }

  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV
    };
  }

  //#endregion

  /**
   * Annulla la selezione del file, svuotando l'input e resettando tutte le proprietà dell'IAttachmentDTO
   */
  abortFile() {
    if (this.imageInput) this.imageInput.nativeElement.value = "";

    this.selectedFile = null;
    this.selectedFiles = null;
    this.showCropImage = false;

    this.newAttachment.IsImage = false;
    this.newAttachment.FileDataBase64 = null;
    this.newAttachment.FileName = null;
    this.newAttachment.FileExtension = null;
    this.newAttachment.FileContentType = null;

    this.newMultipleAttachments = new Array<IAttachmentDTO>();

    this.customHeight = null;
    this.customWidth = null;
    this.originalHeight = null;
    this.originalWidth = null;

    this.dialogRefCropImage.close();
    this.restoreOriginalDimensions();
  }

  //#endregion

  // Viene creato un'array observables per memorizzare tutti gli observable creati dalle chiamate a fileEntry.file().
  // Dopo che tutti gli observables sono stati completati, viene utilizzato il metodo subscribe() per eseguire la funzione onFileAdded().
  fileDropped(files) {
    let filesDropped = [];

    const observables: Observable<any>[] = [];
    for (let i = 0; i < files.length; i++) {
      if (files[i].fileEntry.isFile) {
        const fileEntry = files[i].fileEntry as FileSystemFileEntry;
        const observable = new Observable((observer) => {
          fileEntry.file((file: File) => {
            filesDropped.push(file);

            observer.next();
            observer.complete();
          });
        });
        observables.push(observable);
      } else {
        const fileEntry = files[i].fileEntry as FileSystemDirectoryEntry;
        console.log(files[i].relativePath, fileEntry);
      }
    }

    from(observables)
      .pipe(concatMap((observable) => observable))
      .subscribe({
        complete: () => {
          this.onFileAdded(filesDropped, true);
        }
      });
  }

  // Se il caricamento del file dropbox va a buon fine, la funzione di callback restituisce un array di oggetti.
  // Viene poi fatta una XMLHttpRequest con responseType 'blob' per convertire il primo elemento della response in un Blob.
  chooseDropboxFile() {
    var options = {
      success: (files: any[]) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", files[0].link);
        xhr.setRequestHeader("Authorization", `Bearer ${AttachmentHelperService.dropboxCredentials.accessToken}`);
        xhr.responseType = "blob";

        xhr.onload = () => {
          const blob = xhr.response;
          const file = new File([blob], files[0].name, { type: blob.type });
          let filesAdded = [file];
          this.onFileAdded(filesAdded, true);
        };

        xhr.send();
      },
      linkType: "direct",
      multiselect: false,
      extensions: [".jpg", ".png", ".pdf", ".doc", ".docx", ".txt"]
    };
    Dropbox.choose(options);
  }

  // Workaround dropzone: disabilito il click degli elementi inclusi nella dropzone per evitare di cliccare due volte
  onSelectFile(event, fileInput) {
    if (
      (event.target as HTMLButtonElement).tagName === "BUTTON" ||
      (event.target as HTMLButtonElement).tagName === "INPUT" ||
      this.addingLinkMode == true
    ) {
      return;
    }
    fileInput.click();
  }

  // Metodo per visualizzare la form di aggiunta di un link
  switchToAddingLinkMode() {
    this.addingLinkMode = true;
    this.newAttachment = {} as IAttachmentDTO;
    this.newAttachment.IsImage = false;
    this.newAttachment.AttachmentType = this.attachmentType.LINK;
    this.newMultipleAttachments = new Array<IAttachmentDTO>();
    this.newMultipleAttachments.push(this.newAttachment);

    this.createAttachmentForm();
  }
}
