import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfigColumn, CustomButton, ExportEqpTable } from '@eqproject/eqp-common';
import { FilterObject } from '../filter-component/filter.model';
import { BaseFieldModel } from '@eqproject/eqp-common';
import { TableColumnField } from '@eqproject/eqp-common';

@Component({ template: '' })
/**
 * Componente base che conterrà tutti gli input e gli output in modo da rendere più leggibile il codice di EqpTableComponent
 */
export class EqpTableBaseComponent implements OnInit {

  //#region Definizione INPUT del componente

  /**
    * Titolo della testata (opzionale)
    */
  @Input("headerTitle") headerTitle: any;

  /**
   * Array generico di dati da dare in input alla tabella
   */
  @Input("data") data = [];

  /**
  * Configurazione delle colonne da dare alla tabella, Tipo: Array<ConfigColumn>
  * DEPRECATO
  */
  @Input("columns") tableColumns: Array<ConfigColumn>;

  /**
  * Configurazione delle colonne da dare alla tabella, Tipo: Array<TableColumnField>
  */
  @Input("tableColumnFields") tableColumnFields: Array<TableColumnField>;

  /**
   * Se true, verrà creata una mat-card come contenitore della tabella
   */
  @Input("createMatCard") createMatCard: boolean = false;

  /**
  * Se true, verrà creato una mat-card-header come contenitore della tabella
  */
  @Input("createMatCardHeader") createMatCardHeader: boolean = false;

  /**
    * Opzionale => può essere definito il nome della tabella, attualmente utilizzato per salvare la paginazione della tabella specifica che si vuole modificare
    */
  @Input("tableName") tableName: string;

  /**
    * Permette di definire un'array di numeri per indicare le possibili dimensioni di paginazione della tabella, default: [5, 10, 25, 100]
    */
  @Input("matPaginatorLength") matPaginatorLength: Array<number> = [5, 10, 25, 100];

  /**
   * Permette di definire il numero di default da usare per gli elementi da visualizzare in ogni pagina
   */
  @Input("matPaginatorSize") matPaginatorSize: number;

  /**
   * Permette di definire l'indice dell'array delle dimensione di pagina da usare da impostare di default.
   */
  @Input("matPaginatorIndex") matPaginatorIndex: number;

  /**
   *
   */
  @Input("matPaginatorCount") matPaginatorCount: number;

  /**
   * Permette di mostrare/nascondere la paginazione sotto la tabella, default true.
   * Se viene impostato a FALSE allora la tabella non avrà paginazione
   */
  @Input("paginatorVisible") paginatorVisible: boolean = true;

  /**
   * Se true, viene aggiunta la funzionalità di selezione singola sulla tabella (default: false)
   */
  @Input("selection") selection: boolean = false;

  /**
   * Se assume il valore true e se l'input 'selection' assume il valore true allora aggiunge la funzionalità di selezione multipla
   * delle righe della tabella
   */
  @Input("isMultipleSelection") isMultipleSelection: boolean = false;

  /**
  * Testo da mostrare nel caso in cui la tabella sia vuota (opzionale)
  */
  @Input("emptyTableMessage") emptyTableMessage: any;

  /**
  * Visibilità del campo ricerca sopra la tabella, default true.
  * Se False allora il campo di ricerca viene nascosto
  */
  @Input("isTableSearcheable") isTableSearcheable: boolean = true;

  /**
   * Disabilita visivamente la riga. Accetta una stringa contentente il nome di una proprietà che deve essere contenuta nella tabella
   * e che DEVE restituire valori booleani, altrimenti accetta una Function con lo stesso funzionamento oppure un valore booelano
   */
  @Input("disableRow") disableRow: string | Function | boolean;

  /**
   * Se true, allora verrà utilizzato un emitter all'interno del translateHelper per gestire la sincronia delle chiamate con l'enumhelper
   * che si dovrà occupare di ritornare (nel caso di enumeratore) l'elenco tradotto (default: false)
   */
  @Input("isMultiLanguage") isMultiLanguage: boolean = false;

  /**
   * Definizione delle cultureInfo da utilizzare per il formato del filtro dati nella tabella (default: it-IT)
   */
  @Input("cultureInfo") cultureInfo: string = "it-IT";

  /**
  * Se true, vengono mostrati 2 bottoni nel fondo della card a cui saranno passate delle funzioni dall'utente
  */
  @Input("showFunctionButtons") showFunctionButtons: boolean = false;

  /**
   * Testo del pulsante Conferma, di default restituirà 'Conferma'
   */
  @Input("functionButtonConfirmText") functionButtonConfirmText: string;

  /**
   * Testo del pulsante Esci, di default restituirà 'Esci'
   */
  @Input("functionButtonExitText") functionButtonExitText: string;


  /**
 * Definisce se la tabella evidenzia la riga selezionata (passando un'evento di output per la riga)
 */
  @Input("isHighlight") isHighlight: boolean = false;

  /**
 * Definizione del colore dell'highlight, di default è #E4E5E6(grigio), N.B. deve essere RGB
 */
  @Input("highlightColor") highlightColor: string = "#E4E5E6";

  /**
 * Definizione della colore della tabella
 */
  @Input("tableColor") tableColor;

  /**
 * Definizione del colore del paginator
 */
  @Input("paginatorColor") paginatorColor;

  /**
   * Indica il nome del file che si sta esportando, se non definito verrà attribuito il nome "New"
   */
  @Input("exportEqpTable") exportEqpTable: ExportEqpTable;

  /**
   * Vengono passati i pulsanti custom all'header dell'eqp-table (di fianco al cerca)
   */
  @Input("customButtons") customButtons: Array<CustomButton>;

  /**
   * Etichetta da applicare al campo di ricerca testuale
   */
  @Input("searchText") searchText: string;

  /**
   * Gestione dell'espansione del menù a tendina dei filtri singoli
   */
  @Input("singleFilterColumnVisible") singleFilterColumnVisible: boolean = true;

  /**
   * Testo del pulsante in caso devono essere mostrati i filtri singolo
   */
  @Input("showFilterText") showFilterText: string = 'Mostra filtri';

  /**
   * Testo del pulsante in caso devono essere nascosti i filtri singolo
   */
  @Input("hideFilterText") hideFilterText: string = 'Nascondi filtri';

  /**
   * Se è stato richiesto l'utilizzo dei filtri su singola colonna, attraverso quest'input sarà possibile
   * aprire/chiudere l'accordion tra l'header e il body della tabella in cui sono contenuti i filtri su singola colonna
   */
  @Input("showSingleFilterButton") showSingleFilterButton: boolean = true;

  /**
 * Testo del tooltip del pulsante di switch in caso devono essere mostrati i filtri generici
 */
  @Input("switchFilterToGenericText") switchFilterToGenericText: string = 'Usa filtro generico';

  /**
* Testo del tooltip del pulsante di switch in caso devono essere mostrati i filtri a singola colonna
*/
  @Input("switchFilterToSingleText") switchFilterToSingleText: string = 'Usa filtro per singola colonna';

  /**
   * Possibilità di utilizzare lo switch dei filtri (singolo o generico)
   */
  @Input("switchFilterType") switchFilterType: boolean = false;

  /**
 * Definisce se il filtro è per colonna singola
 */
  @Input("isSingleColumnFilter") isSingleColumnFilter: boolean = false;

  /**
   *
   */
  @Input("currencyFilterToReplace") currencyFilterToReplace: string;

  /**
   *
   */
  @Input("currencyFilterToUse") currencyFilterToUse: string;

  /**
   * Visualizzazione tasto "Vai a prima-ultima pagina"
   */
  @Input("showFirstLastButtons") showFirstLastButtons: boolean = false;

  /**
   * Se richiesto, disabilito il salvataggio delle informazioni della pagina nel localstorage
   */
  @Input("disablePageStorageSave") disablePageStorageSave: boolean = false;

  @Input("disableRowColor") disableRowColor: string = "#8080808c";

  /**
   * Se true, gestisce dinamicamente le colonne della tabella e al resize le mette in una riga di detail espandibile
   */
  @Input("autoResizeColumns") autoResizeColumns: boolean = false;

  /**
   * Se true, l'utente può scegliere quali colonne mostrare/nascondere dinamicamente
   */
  @Input("chooseColumnsToShow") chooseColumnsToShow: boolean = false;

  @Input("chooseColumnsToShowText") chooseColumnsToShowText: string = 'Visualizza colonne';

  /**
   * Stringa contenente tutte le classi che verrano applicate alla mat-row
   */
  @Input("rowCssClass") rowCssClass: Function | string;

  /**
 * Stringa contenente tutte le classi che verrano applicate alla mat-cell
 */
  @Input("cellCssClass") cellCssClass: Function | string;

  /**
  * Stringa contenente tutte le classi che verrano applicate alla mat-header
  */
  @Input("headerCellCssClass") headerCellCssClass: Function | string;

  /**
   * Se true, l'header della tabella sarà sticky verticalmente
   */
  @Input("isStickyHeader") isStickyHeader: boolean = false;

  /**
   * Nome della proprietà che sarà assegnata alla selezione di un valore nella checkbox, di default
   * verrà chiamata isSelected
   */
  @Input("isSelectedPropertyName") isSelectedPropertyName: string = 'isSelected';

  /**
   * Se true, i filtri vengono generati automaticamente dall'oggetto ConfigColumn
   */
  @Input("enableFilters") enableFilters: boolean = false;

  @Input("filterObject") filterObject: FilterObject;

  @Output() filtersSelected = new EventEmitter();

  @Output() customFiltersSavedValueLoaded = new EventEmitter();

  //#endregion

  //#region Defizione OUTPUT del componente

  /**
  * Espone tutti gli elementi selezionati con la checkbox
  */
  @Output() checkboxInfo = new EventEmitter();

  /**
  * Espone l'elemento appena selezionato/deselezionato
  */
  @Output() checkboxJustSelectedInfo = new EventEmitter();

  /**
  * Espone in caso di paginazione lato server l'emitter contente: previousSize, pageIndex, pageSize
  */
  @Output() pageChange = new EventEmitter();

  /**
   * Evento scatenato al change del sort, all'interno dell'evento viene passato il nome della colonna e il verso
   */
  @Output() sortChange = new EventEmitter();

  /**
   * Espone la riga selezionata con l'highlight
   */
  @Output() highlightSelected = new EventEmitter();

  /**
  * Viene scatenato alla deselezione dell'highlight
  */
  @Output() highlightDeselected = new EventEmitter();

  /**
   * Evento di conferma scatenato al click del tasto, se abbinato con l'evento di checkbox restituirà gli elementi selezionati
   */
  @Output() functionButtonConfirm = new EventEmitter();

  /**
   * Evento di uscita scatenato al click del tasto
   */
  @Output() functionButtonExit = new EventEmitter();

  /**
   * Evento scatenato all'avvio della funzione di esportazione della tabella
   */
  @Output() eqpExportStarted = new EventEmitter();

  /**
   * Evento scatenato al termine della funzione di esportazione della tabella
   */
  @Output() eqpExportCompleted = new EventEmitter();

  //#endregion


  constructor() {
  }

  ngOnInit() {
  }
}
