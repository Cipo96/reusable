import { EqpEditorService } from './eqp-editor.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { ToolbarService, EditorService, SelectionService, EditorHistoryService, SfdtExportService, ContextMenuService, DocumentEditorContainerComponent, CustomToolbarItemModel, WordExportService, DocumentEditor } from '@syncfusion/ej2-angular-documenteditor';
import { setCulture, setCurrencyCode, L10n } from '@syncfusion/ej2-base';
import { IPlaceholderDTO, DocumentSaveType } from './models/document.model';
import { ClickEventArgs } from '@syncfusion/ej2-navigations'
import { NestedTreeControl } from '@angular/cdk/tree';
import { TranslateService } from '@ngx-translate/core';
import * as i18n_it from "../lib/i18n/i18n_it.json";
import * as i18n_en from "../lib/i18n/i18n_en.json";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

const localeIT: any = {
  'it': {
    'documenteditorcontainer': {
      'Save': 'Salva',
      'New': 'Nuovo',
      'Open': 'Apri',
      'Undo': 'Annulla',
      'Redo': 'Ripristina',
      'Image': 'Immagine',
      'Table': 'Tabella',
      'Hyperlink': 'Link',
      'Bookmark': 'Segnalibro',
      'Table of Contents': 'Tabella dei contenuti',
      'Header': 'Intestazione',
      'Footer': 'Piè di pagina',
      'Page Setup': 'Impostazione pagina',
      'Page Number': 'Numero pagina',
      'Break': 'Interruzione di pagina',
      'Find': 'Cerca',
      'Paragraph': 'Paragrafo',
      'Text format': 'Formato testo',
      'Text': 'Testo',
      'Font': 'Carattere',
      'Font Size': 'Dimensione',
      'Create a new document': 'Crea un nuovo documento',
      'Open a document': 'Carica un documento esistente',
      'Undo Tooltip': 'Annulla ultima operazione (Ctrl + Z)',
      'Redo Tooltip': 'Ripristina ultima operazione (Ctrl + Y)',
      'Insert a table into the document': 'Inserisci una tabella nel documento',
      'Create Hyperlink': 'Crea un collegamento nel documento per un rapido accesso a pagine Web e file (Ctrl+K).',
      'Insert a bookmark in a specific place in this document': 'Inserisci un segnalibro in una posizione specifica in questo documento',
      'Provide an overview of your document by adding a table of contents': 'Fornisci una panoramica del tuo documento aggiungendo un sommario',
      'Add or edit the header': 'Aggiungi o modifica l\'intestazione del documento',
      'Add or edit the footer': 'Aggiungi o modifica il footer del documento',
      'Open the page setup dialog': 'Apri la finestra di impostazioni della pagina',
      'Add page numbers': 'Aggiungi numeri di pagina',
      'Find Text': 'Trova il testo nel documento (Ctrl+F).',
      'Bold Tooltip': 'Grassetto (Ctrl+B)',
      'Italic Tooltip': 'Corsivo (Ctrl+I)',
      'Underline Tooltip': 'Sottolineato (Ctrl+U)',
      'Strikethrough': 'Barrato ',
      'Superscript Tooltip': 'Apice (Ctrl+Shift++)',
      'Subscript Tooltip': 'Pedice (Ctrl+=)',
      'Font color': 'Colore del testo',
      'Text highlight color': 'Colore di evidenziazione del testo',
      'Clear all formatting': 'Elimina tutte le formattazioni',
      'Styles': 'Stili',
      'Align left Tooltip': 'Allinea a sinistra (Ctrl+L)',
      'Center Tooltip': 'Allinea al centro (Ctrl+E)',
      'Align right Tooltip': 'Allinea a destra (Ctrl+R)',
      'Justify Tooltip': 'Giustificato (Ctrl+J)',
      'Decrease indent': 'Diminuisci indentazione',
      'Increase indent': 'Incrementa indentazione',
      'Line spacing': 'Interlinea',
      'Bullets': 'Elenco puntato',
      'Numbering': 'Elenco numerato',
      'Print layout': 'Visualizzazione di stampa',
      'Web layout': 'Visualizzazione web',
      'Current Page Number': 'Il numero di pagina corrente nel documento. Fare clic o toccare per navigare in una pagina specifica.',
      'Page': 'Pagina',
      'of': 'di',
      'Upload from computer': 'Carica dal computer',
      'Number of heading or outline levels to be shown in table of contents': 'Numero di livelli di intestazione o struttura da mostrare nell\'indice',
      'Show page numbers': 'Mostra numeri di pagina',
      'Show page numbers in table of contents': 'Mostra i numeri di pagina nel sommario',
      'Right align page numbers': 'Allinea a destra i numeri di pagina',
      'Right align page numbers in table of contents': 'Allinea a destra i numeri di pagina nel sommario',
      'Use hyperlinks': 'Usa i collegamenti ipertestuali',
      'Use hyperlinks instead of page numbers': 'Usa i collegamenti ipertestuali invece dei numeri di pagina',
      'Insert': 'Inserisci',
      'Cancel': 'Annulla',
      'Options': 'Opzioni',
      'Levels': 'Livelli',
      'Header from Top': 'Intestazione',
      'Footer from Bottom': 'Piè di pagina',
      'Header And Footer': 'Intestazione & Piè di pagina',
      'Different First Page': 'Prima pagina diversa',
      'Different header and footer for odd and even pages': 'Intestazione e piè di pagina diversi per le pagine pari e dispari',
      'Different Odd And Even Pages': 'Diverse pagine pari e dispari',
      'Different header and footer for first page': 'Intestazione e piè di pagina diversi per la prima pagina',
      'Position': 'Posizione',
      'Page Break': 'Interruzione di pagina',
      'Section Break': 'Interruzione di sezione',
      'Normal': 'Normale',
      'Heading 1': 'Titolo 1',
      'Heading 2': 'Titolo 2',
      'Heading 3': 'Titolo 3',
      'Heading 4': 'Titolo 4',
      'Heading 5': 'Titolo 5',
      'Heading 6': 'Titolo 6',
      'Manage Styles': 'Gestisci stili intestazione'
    },
    'documenteditor': {
      'Insert Table': 'Inserisci tabella',
      'Number of columns': 'Numero di colonne',
      'Number of rows': 'Numero di righe',
      'Ok': 'Conferma',
      'Cancel': 'Annulla',
      'Close': 'Chiudi',
      'Insert Hyperlink': 'Inserisci link',
      'Text to display': 'Testo da visualizzare',
      'Address': 'Indirizzo',
      'Use bookmarks': 'Usa segnalibro',
      'Header': 'Intestazione',
      'Footer': 'Piè di pagina',
      'Page Setup': 'Impostazioni pagina',
      'Margin': 'Margini',
      'Top': 'Sopra',
      'Bottom': 'Sotto',
      'Left': 'Sinistra',
      'Right': 'Destra',
      'Orientation': 'Orientamento',
      'Portrait': 'Verticale',
      'Landscape': 'Orizzontale',
      'Paper': 'Pagina',
      'Width': 'Larghezza',
      'Height': 'Altezza',
      'Letter': 'Lettere',
      'Different odd and even': 'Diversi pari e dispari',
      'Different first page': 'Prima pagina diversa',
      'From edge': 'Dal bordo',
      'Navigation': 'Navigazione',
      'Find': 'Cerca',
      'Search for': 'Ricerca',
      'Match case': 'Maiuscole/minuscole',
      'Whole words': 'Parola intera',
      'Replace': 'Sostituisci',
      'Replace with': 'Sostituisci con',
      'Replace All': 'Sostituisci tutto',
      'Normal': 'Normale',
      'Heading 1': 'Titolo 1',
      'Heading 2': 'Titolo 2',
      'Heading 3': 'Titolo 3',
      'Heading 4': 'Titolo 4',
      'Heading 5': 'Titolo 5',
      'Heading 6': 'Titolo 6',
      'Manage Styles': 'Gestisci stili intestazione',
      'Styles': 'Stili',
      'New': 'Nuovo',
      'Modify': 'Modifica',
      'Create New Style': 'Crea nuovo stile',
      'Properties': 'Proprietà',
      'Name': 'Nome',
      'Style type': 'Tipo di stile',
      'Paragraph': 'Paragrafo',
      'Character': 'Carattere',
      'Linked Style': 'Collegato (paragrafo e carattere)',
      'Style based on': 'Stile basato su',
      'Style for following paragraph': 'Stile per il paragrafo corrente',
      'Formatting': 'Formattazione',
      'Format': 'Formato',
      'Font': 'Font',
      'Numbering': 'Numerazione'
    }
  }
}



@Component({
  selector: 'eqp-editor',
  templateUrl: './eqp-editor.component.html',
  styleUrls: ['./eqp-editor.component.scss'],
  providers: [ToolbarService, EditorService, SelectionService, EditorHistoryService, SfdtExportService, ContextMenuService, WordExportService],
  encapsulation: ViewEncapsulation.None
})

export class EqpEditorComponent implements OnInit {


  /**
  * Istanza del documento in lettura, può essere di tipo SFDT o un path
  */
  @Input("documentInstance") documentInstance: any;

  /**
    * Enumeratore per la metodologia di salvataggio (output) del documento
    */
  @Input("documentSaveType") documentSaveType: DocumentSaveType;

  /**
  * Indica il path COMPLETO al quale verrà fatta la chiamata http per recuperare l'IPlaceholderDTO
  */
  @Input("placeholderEndpoint") placeholderEndpoint: string;

  /**
* Indica il path COMPLETO al quale verrà passato l'endpoint per passare il blob del documento
* ATTUALMENTE NON E' UTILIZZATO (non è referenziato da nessuna parte)
*/
  @Input("blobEndpoint") blobEndpoint: string;

  /**
   * Permette di ridefinire l'etichetta della colonna con l'elenco dei placeholders.
   * Se non viene passata allora viene mostrata sempre l'etichetta 'Tag'
   */
  @Input("label") label: string;

  /**
    *
    */
  @Input("customButtons") customButtons: Array<CustomToolbarItemModel>;

  /**
  * Permette di ridefinire l'altezza dell'editor.
  * Di default è impostato col valore 800px
  */
  @Input("editorHeight") editorHeight: string;

  /**
   * Se TRUE allora visualizza anche il tag per la gestione delle condizioni di visibilità.
   * Le condizioni di visibilità permettono di creare blocchi IF-ENDIF all'interno del documento per fare in modo di
   * stampare blocchi di documento qualsiasi solo al verificarsi di opporune condizioni calcolate sui tag
   */
  @Input("useConditionPlaceholder") useConditionPlaceholder: boolean = true;

  /**
   * Permette di definire l'etichetta del segnaposto per la gestione delle condizioni
   */
  @Input("conditionTagName") conditionTagName: string = "Condizione";

  /**
   * Permette di definire l'etichetta del placeholder per la gestione della condizione di visibilità (default: "Visibilità")
   */
  @Input("visibilityConditionTagName") visibilityConditionTagName: string = "Visibilità";

  /**
  * Permette di definire l'etichetta del placeholder per la gestione della condizione di stile (default: "Stile")
  */
  @Input("styleConditionTagName") styleConditionTagName: string = "Stile";

  /**
   * Permette di definire la lingua in cui localizzare il sistema (default: IT)
   */
  @Input("language") language: string = "it";

  /**
  * Comunica che il file è stato salvato
  * BLOB: restituisce nell'event il BLOB del file appena salvato
  * LOCAL: restituisce nell'event NULL
  * PATH: restituisce nell'event il path del file appena salvato (questa terza modalità attualmente non è stata implementata)
  */
  @Output() documentSaved = new EventEmitter();

  @Output() editorInit = new EventEmitter();


  /**
   * Button aggiuntivi a quelli esistenti definiti non dall'utente che sta gestendo la libreria, ma gestiti dalla libreria stessa
   */
  defaultCustomButtons: Array<CustomToolbarItemModel>;

  //API di syncfusion con le funzionalità dell'editor "standalone" (es: download docx dall'editor)
  public hostUrl: string = "https://externaleqpapi.eqproject.it/api/DocumentHelper/";

  //Variabile contenente tutti i placeholder recuperati dall'endpoint passato in input
  public allPlaceholders: Array<IPlaceholderDTO> = new Array<IPlaceholderDTO>();

  public field: Object;

  isInRootList: boolean = false;

  //Istanza HTML del box contenente i placeholder
  private placeholderBoxInstance: any;

  public items = [];

  treeControl = new NestedTreeControl<IPlaceholderDTO>(node => node.Children);

  @ViewChild('documenteditor', { static: true }) documenteditor: DocumentEditorContainerComponent;

  //#region Proprietà per gestione condizioni

  public VISIBILITY_CONDITION_TAG: string = "{{IF }}   {{ENDIF}}";
  public STYLE_CONDITION_TAG: string = "{{IF_STYLE }}    {{ENDIF_STYLE}}";

  //#endregion

  //#region Proprietà per documentazione

  public simpleVisibilityConditionStart: string = "{{IF @@DENOMINATION = Company s.r.l. }}";
  public visibilityConditionEnd: string = "{{ENDIF}}";

  public complexVisibilityConditionStart: string = "{{IF @@DENOMINATION = Company s.r.l. AND @@VAT_NUMBER = 123456 }} ";

  public existsVisibilityConditionStart: string = "{{IF @@CHILDREN Exists }}";
  public notExistsVisibilityConditionStart: string = "{{IF @@CHILDREN NotExists }}";

  public styleConditionExample1: string = "{{IF_STYLE @@IS_VALID = 1 THEN CustomStyle1 }}";
  public styleConditionExample2: string = "{{IF_STYLE @@IS_VALID = 1 THEN Background:#FF0000;Bold:1;TextColor:255,255,255 }}";
  public styleConditionEnd: string = "{{ENDIF_STYLE}}";
  //#endregion

  @ViewChild('dialogDocumentation', { static: false }) dialogDocumentation: TemplateRef<any>;
  dialogDocumentationRef: MatDialogRef<TemplateRef<any>>;

  public translateService: TranslateService;
  constructor(private eqpEditorService: EqpEditorService,
    private dialog: MatDialog) {

    this.translateService = eqpEditorService.translateService;
  }

  ngOnInit(): void {
    this.InitializeTranslations();
    this.InitializeEditor();
  }

  InitializeTranslations() {
    if (!this.language || this.language == "" || (this.language.toLowerCase() != "it" && this.language.toLowerCase() != "en")) {
      this.language = "it";
    }

    //Carica il json di traduzione in base alla lingua selezionata (di default viene usata sempre la lingua italiana)
    if (this.language.toLowerCase() == "it") {
      let currentIT_Json = i18n_it["default"];
      this.normalizeJsonTranslations(currentIT_Json, this.language.toLowerCase());
      // this.translate.setTranslation(this.language.toLowerCase(), currentIT_Json, true);
      // this.translate.use(this.language.toLowerCase());
      L10n.load(localeIT);
    }
    else if (this.language.toLowerCase() == "en") {
      let currentEN_Json = i18n_en["default"];
      this.normalizeJsonTranslations(currentEN_Json, this.language.toLowerCase());
      // this.translate.setTranslation(this.language.toLowerCase(), currentEN_Json, true);
      // this.translate.use(this.language.toLowerCase());
    }
  }

  /**
   * Funzione che si occupa di verificare se esiste già un TranslateService istanziato e con un traduzione nella lingua richiesta.
   * Se esiste allora accoda il json locale (usato per la documentazione dell'editor) a quello esistente
   * altrimenti definisce il translate service in modo da fargli usare solo la traduzione locale
   * @param localJsonToUse Json contenente la traduzione locale
   */
  private normalizeJsonTranslations(localJsonToUse, language) {
    if (this.translateService && this.translateService.store && this.translateService.store.translations && this.translateService.store.translations[language]) {
      this.translateService.store.translations[language]["EQP_EDITOR"] = localJsonToUse["EQP_EDITOR"];
      return;
    }
    if (this.translateService) {
      this.translateService.setTranslation(this.language.toLowerCase(), localJsonToUse, true);
      this.translateService.use(this.language.toLowerCase());
    }
  }

  /**
   * Funzione che si occupa di tradurre la chiave ricevuta in input, cercandola nel dizionario di traduzione definito dentro
   * il TranslateService.
   * E' stato fatto un metodo perchè dal momento che il TranslateModule è iniettato senza forRoot (perchè siamo in una libreria esterna)
   * in tal caso il pipe translate non è possibile usarlo. Quindi come soluzione si è adottata quella di dichiaralo senza forRoot (in eqp.editorModule)
   * e poi di esporre funzioni per fare in modo, dall'esterno, di poter passare l'istanza del TranslateService
   * @param key Chiave da tradurre
   * @param params Eventuali parametri per la StringInterpolation all'interno del valore tradotto
   * @returns Restituisce una stringa relativa alla traduzione riportata per la chiave
   */
  getTranslatedValue(key, params: any = null) {
    return this.translateService ? this.translateService.instant(key, params) : key;
  }

  //Viene istanziato l'editor e vengono fatte le operazioni aggiuntive iniziali
  InitializeEditor() {
    this.editorInit.emit(null);

    if (this.editorHeight == null)
      this.editorHeight = "800px";

    //Imposto il codice di valuta(attualmente EUR di default)
    setCurrencyCode('EUR');

    this.items = ['New', 'Open', 'Separator', 'Undo', 'Redo', 'Separator', 'Image', 'Table', 'Hyperlink', 'Bookmark', 'TableOfContents', 'Separator', 'Header', 'Footer', 'PageSetup', 'PageNumber', 'Break', 'Separator', 'Find'];

    //Aggiungo i pulsanti custom di default a quelli già presenti (Items)
    this.setDefaultCustomButtons();

    //Gestione custom buttons, per ogni custom button passato in input lo aggiungo alla lista degli item di default già presenti
    if (this.customButtons != null && this.customButtons.length > 0) {
      this.customButtons.forEach(button => {
        this.items.push(button);
      });
    }

    //Gestione custom buttons, per ogni custom button passato in input lo aggiungo alla lista degli item di default già presenti
    if (this.customButtons != null && this.customButtons.length > 0) {
      this.customButtons.forEach(button => {
        this.items.push(button);
      });
    }


    if (this.placeholderEndpoint)
      this.getPlaceholderList();

    if (this.documentInstance) {
      setTimeout(() => {
        this.documenteditor.documentEditor.open(this.documentInstance);
      }, 500);
    }
  }

  findNode(element, array) {
    for (const node of array) {
      if (node.Tag === element.target.dataset.uid.toString()) return node.Tag;
      if (node.Children) {
        const child = this.findNode(element, node.Children);
        if (child) return child;
      }
    }
  }


  onCreate() {
    var self = this;
    this.placeholderBoxInstance = document.getElementById('listbox');

    // DragStart event binding
    if (this.placeholderBoxInstance) {
      this.placeholderBoxInstance.addEventListener("dragstart", function (e) {
        let tagValue = self.findNode(e, self.allPlaceholders);
        e.dataTransfer.setData("Text", tagValue);
      });

      // Prevent default drag over for document editor element
      document.getElementById("containerDocument").addEventListener("dragover", function (event) {
        event.preventDefault();
      });

      // Drop Event for document editor element
      document.getElementById("containerDocument").addEventListener("drop", function (e) {
        var text = " " + e.dataTransfer.getData('Text').replace(/\n/g, '').replace(/\r/g, '').replace(/\r\n/g, '') + " ";
        self.documenteditor.documentEditor.selection.select({ x: e.offsetX, y: e.offsetY, extend: false });
        self.documenteditor.documentEditor.editor.insertText(text);
      });

    }

  }

  //Andranno riportate tutte le azioni dei pulsanti custom (es: save)
  onToolbarClick(args: ClickEventArgs): void {
    switch (args.item.id) {
      case 'Save':
        this.saveAs()
        break;
    }

  }

  //Esporta il file come DocX, a seconda della configurazione degli input restituisce un tipo di file
  saveAs(): void {
    switch (this.documentSaveType) {
      case DocumentSaveType.LOCAL:
        this.documenteditor.documentEditor.save('document', 'Docx');
        //Il timeout è necessario per far prima scaricare il documento e poi rimandare l'evento di output con l'emit
        setTimeout(() => {
          this.documentSaved.emit(null);
        }, 100);
        break;

      case DocumentSaveType.BLOB:
        this.documenteditor.documentEditor.saveAsBlob('Docx').then((exportedDocument: Blob) => {
          this.documentSaved.emit(exportedDocument);
        });
        break;

      // case DocumentSaveType.PATH:

      //   break;

      default:
        this.documenteditor.documentEditor.save('document', 'Docx');
        //Nel caso in cui non è stato definito il metodo di salvataggio, di default faccio il download del file localmente
        setTimeout(() => {
          this.documentSaved.emit(null);
        }, 100);
        break;
    }
  }

  // Metodo dove verranno popolati tutti i custom button di default da integrare a quelli già dati dalla libreria
  setDefaultCustomButtons() {

    this.defaultCustomButtons = new Array<CustomToolbarItemModel>();

    this.defaultCustomButtons.push(
      //Pulsante salvataggio
      {
        prefixIcon: "e-icons e-save",
        tooltipText: this.language.toLowerCase() == "it" ? "Salva il documento" : "Save the current document",
        text: this.language.toLowerCase() == "it" ? "Salva" : "Save",
        id: "Save"
      }
    );


    //Vengono aggiunti tutti i custom buttons definiti in defaultCustomButtons
    this.defaultCustomButtons.forEach((customButton) => {
      this.items.unshift(customButton);
    });

  }

  //#region Gestione placeholders e mat tree

  async getPlaceholderList() {

    await this.eqpEditorService.getDocumentPlaceholders(this.placeholderEndpoint).then((res) => {

      if (res == null || res == undefined)
        res = [];

      //Se è stato richiesto l'utilizzo dei placeholder per la gestione delle condizioni allora crea un nodo parent
      //con due sottonodi per le due condizioni di VISIBILITA' e STILE
      if (this.useConditionPlaceholder == true) {
        let parentConditionNode: IPlaceholderDTO = {
          ID: -1,
          Name: this.conditionTagName,
          Tag: "@@PARENT_CONDITION_NODE",
          FK_Parent: null,
          IsListOfElements: false,
          Children: [
            { ID: -2, Name: this.visibilityConditionTagName, Tag: this.VISIBILITY_CONDITION_TAG, FK_Parent: -1, Children: null, htmlAttributes: null, IsListOfElements: false },
            { ID: -3, Name: this.styleConditionTagName, Tag: this.STYLE_CONDITION_TAG, FK_Parent: -1, Children: null, htmlAttributes: null, IsListOfElements: false }
          ],
          htmlAttributes: null
        }
        res.unshift(parentConditionNode);
      }

      // Per scendere di N livelli, chiamo ricorsivamente la funzione per impostare il draggable
      res.forEach(element => {
        this.setDraggableRecursive(element);
      });

      this.allPlaceholders = res;

      this.field = {
        dataSource: this.allPlaceholders, id: 'Tag', parentID: "FK_Parent",
        text: 'Name', child: 'Children', selected: 'isSelected'
      };

    }).catch((err) => {
      throw new Error("Errore nel recupero dei Placeholder: " + err.message);
    });

    return this.allPlaceholders;
  }

  setDraggableRecursive(element: any) {
    if (element.Children != null && element.Children.length > 0) {
      element["htmlAttributes"] = { draggable: !this.useConditionPlaceholder || element.IsListOfElements === true };

      element.Children.forEach(child => {
        this.setDraggableRecursive(child);
      });
    } else {
      element["htmlAttributes"] = { draggable: true };
    }
  }

  //#endregion

  //#region Gestione funzioni per visualizzazione documentazione

  showInfo() {
    this.dialogDocumentationRef = this.dialog.open(this.dialogDocumentation, {
      autoFocus: true,
      maxWidth: '70%'
    });
  }

  //#endregion
}
