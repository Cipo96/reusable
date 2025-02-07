// import { Component, OnInit, Input, ViewChild, SimpleChanges, Output, EventEmitter, ChangeDetectorRef, Inject } from '@angular/core';
// import { ConfigColumn, TypeColumn, ExportEqpTable, HeaderFilter, NumberColumnPipe, CellAlignmentEnum } from './models/config-column.model';
// import { MatTable, MatTableDataSource } from '@angular/material/table';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';
// import { EnumHelper } from './helpers/enum.helper';
// import { animate, state, style, transition, trigger } from '@angular/animations';
// import { EqpTableService } from './eqp-table.service';
// import { DatePipe, DOCUMENT } from '@angular/common';
// import { SelectionModel } from '@angular/cdk/collections';
// import { ExportType } from 'cdk-table-exporter';
// import 'jspdf-autotable';
// import jsPDF from 'jspdf';
// import { TranslateTableHelper } from './helpers/translateTable.helper';
// import { MatTableExporterDirective } from 'mat-table-exporter';
// import { ColumnStyleHelper } from './helpers/columnStyle.helper';
// import { ColumnValueHelper } from './helpers/columnValue.helper';
// import { ColumnAccessibilityHelper } from './helpers/columnAccessibility.helper';

// @Component({
//   selector: 'eqp-table',
//   templateUrl: 'eqp-table.component_old.html',
//   styleUrls: ['eqp-table.component.scss', 'eqp-table-mobile.scss'],
//   animations: [
//     trigger('detailExpand', [
//       state('collapsed', style({ height: '0px', minHeight: '0' })),
//       state('expanded', style({ height: '*' })),
//       transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
//     ]),
//   ],
//   providers: [DatePipe]
// })
// export class EqpTableComponentOld implements OnInit {

//   /**
//    * Espone tutti gli elementi selezionati con la checkbox
//    */
//   @Output() checkboxInfo = new EventEmitter();

//   /**
//   * Espone in caso di paginazione lato server l'emitter contente: previousSize, pageIndex, pageSize
//   */
//   @Output() pageChange = new EventEmitter();

//   /**
//    * Evento scatenato al change del sort, all'interno dell'evento viene passato il nome della colonna e il verso
//    */
//   @Output() sortChange = new EventEmitter();

//   /**
//  * Espone la riga selezionata con l'highlight
//  */
//   @Output() highlightSelected = new EventEmitter();

//   /**
// * Viene scatenato alla deselezione dell'highlight
// */
//   @Output() highlightDeselected = new EventEmitter();

//   /**
//  * Se true, saranno ammesse le selezioni multiple delle checkbox nella tabella
//  */
//   @Input("isMultipleSelection") isMultipleSelection: boolean = false;

//   /**
//    * Se true, viene aggiunta la colonna delle checkbox
//    */
//   @Input("selection") selection: boolean = false;

//   /**
//   * Se true, vengono mostrati 2 bottoni nel fondo della card a cui saranno passate delle funzioni dall'utente
//   */
//   @Input("showFunctionButtons") showFunctionButtons: boolean = false;

//   /**
//    * Testo del pulsante Conferma, di default restituirà 'Conferma'
//    */
//   @Input("functionButtonConfirmText") functionButtonConfirmText: string;

//   /**
//    * Testo del pulsante Esci, di default restituirà 'Esci'
//    */
//   @Input("functionButtonExitText") functionButtonExitText: string;

//   /**
//    * Evento di conferma scatenato al click del tasto, se abbinato con l'evento di checkbox restituirà gli elementi selezionati
//    */
//   @Output() functionButtonConfirm = new EventEmitter();

//   /**
//    * Evento di uscita scatenato al click del tasto
//    */
//   @Output() functionButtonExit = new EventEmitter();

//   /**
//   * Array generico di dati da dare in input alla tabella
//   */
//   @Input("data") data = [];
//   /**
//   * Configurazione delle colonne da dare alla tabella, Tipo: Array<ConfigColumn>
//   */
//   @Input("columns") tableColumns: Array<ConfigColumn> = new Array<ConfigColumn>();

//   /**
//   * Titolo della testata (opzionale)
//   */
//   @Input("headerTitle") headerTitle: any;

//   /**
//   * Messaggio nel caso in cui la tabella sia vuota (opzionale)
//   */
//   @Input("emptyTableMessage") emptyTableMessage: any;

//   /**
//    * Se true, allora verrà utilizzato un emitter all'interno del translateHelper per gestire la sincronia delle chiamate con l'enumhelper
//    * che si dovrà occupare di ritornare (nel caso di enumeratore) l'elenco tradotto
//    */
//   @Input("isMultiLanguage") isMultiLanguage: boolean = false;

//   /**
//    * Se true, verrà creata una mat-card come contenitore della tabella
//    */
//   @Input("createMatCard") createMatCard: boolean = false;

//   /**
//    * Se true, verrà creato una mat-card-header come contenitore della tabella
//    */
//   @Input("createMatCardHeader") createMatCardHeader: boolean = true;

//   /**
//   * input di tipo stringa dove sarà contenuto il prefisso della key
//   * NB. è necessario inserire tutto il prefisso come scritto nel json(compresi gli eventuali separatori)
//   */
//   // @Input("multilanguagePrefixKey") multilanguagePrefixKey: string = null;

//   /**
//    * Definizione delle cultureInfo da utilizzare per il formato del filtro dati nella tabella
//    */
//   @Input("cultureInfo") cultureInfo: string = "it-IT";

//   /**
//  * Visibilità della paginazione sotto la tabella, default true
//  */
//   @Input("paginatorVisible") paginatorVisible: boolean = true;

//   /**
//  * Visibilità del campo ricerca sopra la tabella, default true
//  */
//   @Input("isTableSearcheable") isTableSearcheable: boolean = true;

//   /**
// * Definisce se la tabella ha TUTTE le righe espandibili (DA COMPLETARE, NON UTILIZZARE)
// */
//   @Input("isExpandable") isExpandable: boolean = false;

//   /**
// * Definisce se la tabella evidenzia la riga selezionata (passando un'evento di output per la riga)
// */
//   @Input("isHighlight") isHighlight: boolean = false;

//   /**
//  * Definizione del colore dell'highlight, di default è #E4E5E6(grigio), N.B. deve essere RGB
//  */
//   @Input("highlightColor") highlightColor: string = "#E4E5E6";

//   /**
// * Definizione della colore della tabella
// */
//   @Input("tableColor") tableColor;

//   /**
// * Definizione del colore del paginator
// */
//   @Input("paginatorColor") paginatorColor;

//   /**
//    * Disabilita visivamente la riga
//    * Accetta una stringa contentente il nome di una proprietà che deve essere contenuta nella tabella
//    * e che DEVE restituire valori booleani, altrimenti accetta una Function con lo stesso funzionamento
//    * oppure un valore booelano
//    */
//   @Input("disableRow") disableRow: string | Function | boolean;

//   /**
//    * Indica il nome del file che si sta esportando, se non definito verrà attribuito il nome "New"
//    */
//   @Input("exportEqpTable") exportEqpTable: ExportEqpTable;

//   /**
//    * Opzionale => può essere definito il nome della tabella, attualmente utilizzato per salvare la paginazione della tabella specifica che si vuole modificare
//    */
//   @Input("tableName") tableName: string;


//   @Output() eqpExportStarted = new EventEmitter();

//   @Output() eqpExportCompleted = new EventEmitter();

//   @Input("searchText") searchText: string;

//   /**
//    * Stringa con i caratteri speciali possibili da utilizzare come separatore nel formato data
//    */
//   splChars: string = "*|/,:;.-";

//   expandedElement: any | null;

//   greyDisabledColor: string = "#8080808c";

//   currentCultureSelected: string;
//   currentLocaleSelected: string;

//   /**
//    * Conterrà ogni volta il nome della colonna nel quale si sta facendo il filtro singolo
//    */
//   selectedColumnToSearch: string;

//   /**
//    * Gestione dell'espansione del menù a tendina dei filtri singoli
//    */
//   @Input("singleFilterColumnVisible") singleFilterColumnVisible: boolean = true;

//   /**
//    * Testo del pulsante in caso devono essere mostrati i filtri singolo
//    */
//   @Input("showFilterText") showFilterText: string = 'Mostra filtri';

//   /**
//    * Testo del pulsante in caso devono essere nascosti i filtri singolo
//    */
//   @Input("hideFilterText") hideFilterText: string = 'Nascondi filtri';

//   @Input("showSingleFilterButton") showSingleFilterButton: boolean = true;

//   /**
//  * Testo del tooltip del pulsante di switch in caso devono essere mostrati i filtri generici
//  */
//   @Input("switchFilterToGenericText") switchFilterToGenericText: string = 'Usa filtro generico';

//   /**
// * Testo del tooltip del pulsante di switch in caso devono essere mostrati i filtri a singola colonna
// */
//   @Input("switchFilterToSingleText") switchFilterToSingleText: string = 'Usa filtro per singola colonna';

//   /**
//    * Possibilità di utilizzare lo switch dei filtri (singolo o generico)
//    */
//   @Input("switchFilterType") switchFilterType: boolean = false;

//   /**
//  * Definisce se il filtro è per colonna singola
//  */
//   @Input("isSingleColumnFilter") isSingleColumnFilter: boolean = false;

//   //Array usato per memorizzare i formati possibili da usare per l'esportazione.
//   //Se l'utente passa uno specifico type o N specifici type allora verranno usati solo quelli
//   //altrimenti li mostra tutti quelli previsti
//   //Workaround Andrea, è stato necessario renderlo any in quanto ora può essere un array di 2 tipi => ExportType e CustomExportType
//   exportValidTypes: any;
//   exportDefaultValidTypes: string[] = ["xlsx", "csv", "txt"];
//   exportTypeEnum = ExportType;

//   numberPipeEnum = NumberColumnPipe;
//   cellAlingmentEnum = CellAlignmentEnum;

//   @ViewChild('table', { static: false }) table: MatTable<any>;
//   @ViewChild('exporter', { static: false }) exporter: MatTableExporterDirective;

//   private paginator: MatPaginator;
//   private sort: MatSort;

//   @ViewChild(MatSort) set matSort(ms: MatSort) {
//     this.sort = ms;
//     this.reloadDatatable();
//   }

//   @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
//     if (this.pageChange.observers != null && this.pageChange.observers.length == 0) {
//       this.paginator = mp;
//       this.reloadDatatable();
//     }
//   }

//   dataSource: MatTableDataSource<any> = new MatTableDataSource();
//   public TypeEnum = TypeColumn;

//   //Contiene tutta la riga selezionata, ho usato SelectionModel perchè la documentazione non è chiara a riguardo ma
//   //sarebbe la classe corretta da utilizzare (messa anche se non utilizzata per sviluppi futuri)
//   selectedRow = new SelectionModel<any>(false, null);

//   /**
//    * Array di appoggio dove andranno a finire tutte le checkbox selezionate, con le relative informazioni di ogni riga
//    */
//   allSelectedValue: Array<any> = new Array<any>();

//   // Variabile booleana che viene aggiornata nella selezione/deselezione delle checkbox (in caso di colonna checkbox)
//   isAllSelected: boolean = false;

//   /**
//    * Valore di default per la grandezza delle colonne
//    */
//   standardFlexValue: string = "10%";

//   /**
//   * Definire un'array di number per i tipi possibili di paginazione della table, default: [5, 10, 25, 100]
//   */
//   @Input("matPaginatorLength") matPaginatorLength: Array<number> = [5, 10, 25, 100];

//   @Input("matPaginatorSize") matPaginatorSize: number;

//   @Input("matPaginatorIndex") matPaginatorIndex: number;

//   @Input("matPaginatorCount") matPaginatorCount: number;

//   @Input("currencyFilterToReplace") currencyFilterToReplace: string;
//   @Input("currencyFilterToUse") currencyFilterToUse: string;

//   //#region Gestione campi per filtri singola colonna
//   headersFilters: Array<HeaderFilter> = new Array<HeaderFilter>();
//   filtersModel = [];
//   filterKeys = {};
//   //#endregion

//   // Mappatura di tutti i campi del modello
//   get keys() {

//     //Nel caso in cui non sia stata passata una chiave, la creo io runtime
//     if (this.tableColumns.filter(e => e.key == null).length > 0) {
//       var counter = 0;
//       this.tableColumns.forEach(column => {
//         if (column.key == null) {
//           column.key = "Key_" + counter;
//           counter++
//         }
//       });
//     }

//     if (this.isMultipleSelection || this.selection) {
//       let checkboxToAdd = "Checkbox";
//       let currentArray = this.tableColumns.map(({ key }) => key);
//       currentArray.unshift(checkboxToAdd);
//       return currentArray;
//     } else {
//       return this.tableColumns.map(({ key }) => key);
//     }
//   }

//   // Mappatura di tutti i campi del modello per la gestione dei filtri singola colonna
//   get headerFilters() {
//     if (this.isSingleColumnFilter == null || this.isSingleColumnFilter == false)
//       return;

//     return this.headersFilters.map(({ column }) => column);
//   }

//   constructor(private enumHelper: EnumHelper, private eqpTableService: EqpTableService, private cd: ChangeDetectorRef, private translateTableHelper: TranslateTableHelper, private datePipe: DatePipe, @Inject(DOCUMENT) private _doc: any) {
//     this.languagePipesConfigurations();
//   }


//   getHeaderFilters() {

//     if (this.tableColumns == null || this.tableColumns.length == 0)
//       return;

//     var counter = 0;
//     this.tableColumns.forEach(element => {
//       let headerFilter = new HeaderFilter();
//       headerFilter.column = element.key + '_' + counter;
//       headerFilter.key = this.isColumnTypeValidForSearch(element) ? element.value.toString() : element.key;
//       headerFilter.styles = element.styles;
//       headerFilter.isSearchable = element.isSearchable != null ? element.isSearchable : true;
//       headerFilter.type = element.type;
//       this.headersFilters.push(headerFilter);
//       counter++;
//     });

//     if (this.selection == true) {
//       let checkboxToAdd: HeaderFilter = new HeaderFilter();
//       checkboxToAdd.column = 'CheckboxColumn';
//       checkboxToAdd.isSearchable = false;
//       checkboxToAdd.key = 'Checkbox';
//       this.headersFilters.unshift(checkboxToAdd);
//     }

//   }

//   ngOnInit(): void {
//     this.initializeHelpers();    

//     this.normalizeColumnsValueAttributeForSearch();

//     // Inizializzo il datasource, il sort e il paginator
//     this.reloadDatatable(true);

//     //Faccio fare la mappatura singola dei filtri solo se viene passato true nell'input
//     if (this.isSingleColumnFilter == true || this.switchFilterType != null)
//       this.getHeaderFilters();

//   }

//   /**
//    * Inizializza le proprietà statiche dei diversi helper.
//    * Questa procedura è necessaria per fare in modo che i diversi helper, condivisi sia da eqp-table che dai componenti più interni,
//    * possano lavorare sulle stesse istanze degli INPUT o dei servizi iniettati tramite D.I.
//    */
//   initializeHelpers() {
//     ColumnAccessibilityHelper.disableRow = this.disableRow;
//     ColumnValueHelper.enumHelper = this.enumHelper;
//     ColumnValueHelper.isMultiLanguage = this.isMultiLanguage;
//   }

//   /**
//    * Cicla tutte le colonne per cui è stata definita solo la key (e che quindi il value undefined) e riporta lo stesso valore
//    * anche per la proprietà value in modo da averle tutte allineate.
//    *
//    * Il ciclo viene eseguito per tutte le colonne definite, fatta eccezione per quelle che contengono pulsanti o icone o immagini
//    */
//   normalizeColumnsValueAttributeForSearch() {
//     if (this.tableColumns == null || this.tableColumns == undefined)
//       return;

//     this.tableColumns.filter(t => (t.value == undefined || t.value == null) && this.isColumnTypeValidForSearch(t))
//       .forEach(t => {
//         t.value = t.key;
//       });
//   }

//   // In caso di chiamata asincrona, aggiorno il datasource come arrivano i dati
//   ngOnChanges(changes: SimpleChanges) {
//     // only run when property "data" changed
//     if (changes['data'] != undefined) {
//       this.data = changes.data.currentValue != undefined ? changes.data.currentValue : [];
//       this.reloadDatatable(true);
//     }
//   }

//   languagePipesConfigurations() {
//     this.eqpTableService.initPossibileLanguages();
//     this.currentCultureSelected = this.eqpTableService.getDatePipe();
//     this.currentLocaleSelected = this.eqpTableService.getCurrentLocale();
//   }

//   // Ritorna un valore dalle column.booleanValues a seconda del valore dell'elemento
//   getBooleanValue(element, column, columnValue = null) {

//     let currentColumnValue = null;

//     if (columnValue == null)
//       currentColumnValue = this.getValue(element, column);
//     else
//       currentColumnValue = columnValue;

//     if (currentColumnValue != null && currentColumnValue != undefined)
//       return column.booleanValues[currentColumnValue];
//     else
//       return null;
//   }

//   // Ritorna un valore dalle column.booleanValues a seconda del valore dell'elemento
//   getCheckboxValue(element, column) {
//     let currentColumnValue = this.getValue(element, column);
//     if (currentColumnValue != null && currentColumnValue != undefined)
//       return currentColumnValue;
//     else
//       return null;
//   }

//   getCurrencyPipe(column: ConfigColumn, element) {
//     if (column.currencyPipeCode && typeof (column.currencyPipeCode) == "function") {
//       return column.currencyPipeCode(element);
//     }
//     else
//       return column.currencyPipeCode;
//   }

//   /**
//    * Costruzione della colonna di checkbox con i relativi possibili comportamenti e casistiche
//    */
//   changeCheckboxRowSelection(event, element, index) {

//     //Controllo gli elementi già presenti nel datasource e li aggiungo alla list su cui farò l'emit
//     //se hanno la proprietà isSelected già a true e NON sono già presenti
//     this.dataSource.filteredData.forEach(element => {
//       if (element["isSelected"] && element["isSelected"] == true && !this.allSelectedValue.includes(element))
//         this.allSelectedValue.push(element);
//     });

//     if (!this.isMultipleSelection) {
//       if (event.checked == false) {
//         element["isSelected"] = false;
//         this.allSelectedValue = [];
//       } else if (event.checked == true) {
//         if (this.allSelectedValue.length > 0)
//           this.allSelectedValue[0].isSelected = false;

//         this.allSelectedValue = [];
//         element["isSelected"] = true;
//         this.allSelectedValue.push(element);
//       }
//     } else if (this.isMultipleSelection) {
//       element["index"] = index;
//       if (event.checked == true) {
//         element["isSelected"] = true;
//         this.allSelectedValue.push(element);
//       } else if (event.checked == false) {
//         let indexToRemove = this.allSelectedValue.findIndex(x => x.index == element.index)
//         element["isSelected"] = false;
//         this.allSelectedValue.splice(indexToRemove, 1);
//       }
//     }

//     if (this.allSelectedValue.length == this.dataSource.filteredData.length && this.isMultipleSelection == true) {
//       this.isAllSelected = true;
//     } else {
//       this.isAllSelected = false;
//     }

//     this.checkboxInfo.emit(this.allSelectedValue);
//   }

//   changeCheckboxRow(event, element, index, column) {

//     let keyValue = column.value ? column.value : column.key;

//     if (event.checked == false) {
//       element[keyValue] = false;
//     } else if (event.checked == true) {
//       element[keyValue] = true;
//     }
//   }

//   /**
//    * Gestione seleziona/deseleziona tutte le checkbox
//    */
//   selectUnselectAll() {
//     this.isAllSelected = !this.isAllSelected;

//     if (this.isAllSelected == true) {
//       this.allSelectedValue = [];
//       let currentIndex = 0;
//       this.dataSource.filteredData.forEach(element => {

//         // Recupero la proprietà da usare poi come indice dell'element
//         let currentValue = this.disableRow != null && typeof this.disableRow === "string" || typeof this.disableRow === "boolean" ? this.disableRow : this.disableRow != null && typeof this.disableRow === "function" ? this.disableRow() : null;

//         // Se non è stato definito il disableRow oppure la proprietà del disableRow esiste e ha come valore false allora lo includo nella lista allSelectedValue
//         if (this.disableRow == null || currentValue === false || (element.hasOwnProperty(this.disableRow) && !element[currentValue] === true)) {
//           element["index"] = currentIndex;
//           element["isSelected"] = true;
//           this.allSelectedValue.push(element);
//         } else {

//         }
//         currentIndex++;
//       });
//     } else if (this.isAllSelected == false) {
//       this.allSelectedValue = [];
//       this.dataSource.filteredData.forEach(element => {
//         element["isSelected"] = false;
//       });
//     }

//     this.checkboxInfo.emit(this.allSelectedValue);

//   }

//   /**
//    * Ricostruisco il valore in caso di oggetti complessi o casi booleani/enum
//    * altrimenti in caso di valore diretto ritorno direttamente il valore stesso
//    */
//   getValue(element, col) {
//     if (col.value && typeof (col.value) == "string" && (col.value.indexOf(',') == null || col.value.indexOf(',') == -1)) {
//       return col.value.split('.').reduce(this.getRealValue, element);
//     }
//     else if (col.value && typeof (col.value) == "string" && (col.value.indexOf(',') != null && col.value.indexOf(',') != -1)) {
//       return col.value.split('.').reduce(this.getConcatValue, element);
//     }
//     else if (col.value && typeof (col.value) == "function") {
//       return col.value(element);
//     }
//     else if (typeof (element) == "string") {
//       return element;
//     }
//     else {
//       return element[col.key];
//     }
//   }

//   getRealValue(initialValue, currentValue) {
//     return initialValue != null && initialValue != undefined ? initialValue[currentValue] : null;
//   }

//   getConcatValue(initialValue, currentValue) {
//     let retrievedList: Array<string> = currentValue.split(",");
//     let concatenatedString: string;

//     retrievedList.forEach(element => {
//       let value = initialValue[element];
//       concatenatedString = concatenatedString == undefined ? value : (concatenatedString + " " + value);
//     });

//     return concatenatedString;
//   }

//   // Filtro di ricerca standard
//   applyFilter(filterValue: string) {
//     if (filterValue != null && filterValue != "")
//       filterValue = filterValue.replace(/\s/g, "");

//     this.dataSource.filter = filterValue.trim().toLowerCase();
//   }

//   //Filtro di ricerca custom per la ricerca singola sulle colonne
//   applyFilterCustom(filterValue: string, column: string) {

//     //Resetto il datasource al punto di partenza ogni volta che riparte la ricerca
//     this.dataSource.data = this.data;
//     this.dataSource.filteredData = this.data;
//     this.cd.detectChanges();

//     //Ciclo le chiavi presenti nelle singole colonne creando un dizionario {Colonna => Testo}
//     this.filtersModel.forEach((each, ind) => {
//       if (this.selection == true) {
//         this.filterKeys[this.tableColumns[ind - 1].value.toString()] = each || null;
//       } else {
//         this.filterKeys[this.tableColumns[ind].value.toString()] = each || null;
//       }
//     });

//     //Per ogni chiave del dizionario, faccio partire la ricerca
//     //N.B l'else finale è
//     for (let key in this.filterKeys) {
//       if (this.filterKeys[key] == null)
//         this.filterKeys[key] = "";

//       this.selectedColumnToSearch = key;
//       this.applyFilter(this.filterKeys[key]);
//       this.dataSource.data = this.dataSource.filteredData;
//       this.cd.detectChanges();
//     }

//   }

//   // Aggiorno la datatable controllando che prima esista
//   //Il firstLoading serve principalmente per il isSingleColumnFilter, perchè non devono essere sempre riaggiornati i dati ma solo all'init e alla modifica (vedere onChanges)
//   reloadDatatable(firstLoading: boolean = false) {
//     var self = this;

//     if (this.dataSource == undefined)
//       this.dataSource = new MatTableDataSource();

//     //Nel caso in cui data contiene un element di tipo string, allora assegno forzatamente una key a quell'elemento
//     if (this.isSingleColumnFilter != true || (this.isSingleColumnFilter == true && firstLoading == true)) {
//       var counter = 0;
//       this.data.forEach(element => {
//         this.data[counter]["originalIndex"] = counter;
//         counter++;
//       });
//       this.dataSource.data = this.data;
//     }

//     this.dataSource.sortingDataAccessor = (obj, property) => this.getSortOrder(obj, property);

//     this.dataSource.sort = this.sort;
//     this.dataSource.paginator = this.paginator;

//     //Recupero il pageIndex della tabella attuale dal localStorage(se definito)
//     if (this.tableName != null || (this.table != null && localStorage.getItem(this._doc.title + ' Table => ' + btoa(JSON.stringify(this.table["_rowDefs"][0].columns))) != null)) {
//       this.matPaginatorSize = Number(localStorage.getItem(this._doc.title + ' Table => ' + (this.tableName != null ? this.tableName : btoa(JSON.stringify(this.table["_rowDefs"][0].columns)))))
//       this.cd.detectChanges();
//     }

//     this.dataSource.filterPredicate = function (row, filter: string): boolean {

//       if (self.isSingleColumnFilter == true && self.dataSource.filteredData != null && self.dataSource.filteredData.find(x => x == row) == null)
//         return;

//       const accumulator = (currentTerm, key) => {
//         let x = self.createFilterRow(currentTerm, row, key);
//         return x;
//       };

//       const dataStr = !self.isSingleColumnFilter ? Object.keys(row).reduce(accumulator, '').toLowerCase().replace(/\s/g, "") : self.createFilterRow(null, row, self.selectedColumnToSearch).toLowerCase().replace(/\s/g, "");
//       filter = filter.replace(/\s/g, "");

//       if (self.currencyFilterToReplace != null) {

//         if (self.currencyFilterToUse == null)
//           throw new Error("Attenzione, la proprietà currencyFilterToUse è obbligatoria!");

//         filter = filter.split(self.currencyFilterToReplace).join(self.currencyFilterToUse);

//       }

//       const transformedFilter = filter.toString().trim().toLowerCase();
//       return dataStr.indexOf(transformedFilter) !== -1;
//     }
//   }

//   renderRows() {
//     this.table.renderRows();
//   }

//   /**
//    * Funzione custom per il sort
//    * @param obj Riga
//    * @param path Nome proprietà
//    * @returns String | Number
//    */
//   getSortOrder(row, path) {

//     //Trovo la colonna che corrisponde al path nel key o nel value
//     let foundedColumn = this.tableColumns.find(x => x.key == path || x.value == path);

//     if (foundedColumn.value != null) {
//       //Se è una stringa concatena (es: Nome, Cognome), splitto la prima parola e cerco per quella
//       if (foundedColumn.value.toString().includes(",")) {

//         let stringArray = "";

//         foundedColumn.value.toString().split(',').forEach(propertyPath => {
//           stringArray += row[propertyPath];
//         });

//         return stringArray;

//       } else {
//         //Faccio il reduce di una proprietà complessa (es: object.Nome), tipico caso dell'utilizzo del tipo value
//         return foundedColumn.value.toString().split('.').reduce((o, p) => o && o[p], row)
//       }
//     } else {
//       return row[path];
//     }

//   }

//   /**
//    * Funzione richiamata nella costruzione del FilterPredicate custom,si occupa di comporre (per ciascun elemento della tabella) una stringa
//    * ottenuta dalla concatenazione di tutti i valori mostrati nelle colonne valide per la ricerca.
//    *
//    * La stringa risultante sarà poi usata per l'applicazione del filtro nel metodo reloadDatatable
//    *
//    * N.B. La funzione, tramite il reduce richiamato nella funzione del filter predicate, viene richiamata per ogni proprietà dell'oggetto
//    * bindato alla riga della tabella
//    *
//    * @param searchString Stringa costruita ricorsivamente (dall'accumulator) che contiene la concatenazione dei valori delle proprietà dell'elemento cu sui fare la ricerca
//    * @param rowItem Elemento bindato alla riga
//    * @param columnKey Chiave della ConfigColumn
//    * @returns
//    */
//   createFilterRow(searchString, rowItem, itemPropertyName) {

//     if (searchString == null || searchString == undefined)
//       searchString = "";

//     //Recupera tutte le colonne della tabella associate alla property name corrente (potrebbero esserci più colonne che nel value utilizzano la stessa proprietà quindi è necessario recuperarle tutte)
//     let propertyObjectColumns = this.tableColumns.filter(x => x.key == itemPropertyName || (x.value != null && x.value.toString().toLowerCase().includes(itemPropertyName.toLowerCase()) == true));

//     //Se non ci sono colonne associate alla proprietà esce restituendo una stringa vuota
//     if (propertyObjectColumns == null || propertyObjectColumns == undefined || propertyObjectColumns.length == 0) {
//       searchString += "";
//     }
//     else {
//       //Filtra le colonne recuperate escludendo tutte quelle di tipo SIMPLE_ACTION, MENU_ACTION, ICON, IMAGE o CHECKBOX (non servono per la ricerca)
//       //più tutte quelle per cui la proprietà isSearchable è stata impostata a FALSE
//       let validColumns = propertyObjectColumns.filter(c => c.isSearchable != false && this.isColumnTypeValidForSearch(c));

//       //Se non ci sono colonne valide esce restituendo una stringa vuota
//       if (validColumns == null || validColumns.length == 0) {
//         searchString += "";
//       }
//       else {
//         //Cicla le colonne valide e per ciascuna di esse ricostruisce il valore mostrato nella colonna e lo aggiunge alla stringa su cui verrà fatta la ricerca finale
//         for (var colIndex = 0; colIndex < validColumns.length; colIndex++) {
//           //Concateno alla searchString il valore mostrato nella colonna corrente, ricostruito con gli stessi metodi
//           //usati nelle diverse celle della tabella
//           let currentColumn = validColumns[colIndex];
//           if (currentColumn.type == TypeColumn.Enum) {
//             searchString += this.getEnumValue(currentColumn.enumModel, rowItem, currentColumn);
//           }
//           else if (currentColumn.type == TypeColumn.Boolean) {
//             searchString += this.getBooleanValue(rowItem, currentColumn);
//           }
//           else if (currentColumn.type == TypeColumn.Date) {
//             //Recupero il valore della data w e poi lo riscrivo nel formato visualizzato in base alla lingua
//             let data = this.getValue(rowItem, currentColumn);
//             let currentDate: any = null;
//             if (data == null) {
//               searchString += "";
//               return searchString;
//             }
//             else if (typeof data === "string") {
//               currentDate = new Date(data);

//             }
//             else {
//               currentDate = data;
//             }

//             let currentDateText: string = this.datePipe.transform(currentDate, currentColumn.format ?? "shortDate", null, this.cultureInfo);
//             let arrayOfSplChars: Array<string> = Array.from(this.splChars);
//             let usedSplChar: string;

//             arrayOfSplChars.forEach(element => {
//               if (currentDateText.includes(element)) {
//                 usedSplChar = element;
//                 let splittedDate = currentDateText.split(element);
//                 splittedDate.forEach(function (singleDate, index) {
//                   if (singleDate.length <= 1) {
//                     splittedDate[index] = singleDate.padStart(2, "0");
//                   }
//                 });
//                 currentDateText = splittedDate.join(usedSplChar);
//               }
//             });

//             searchString += currentDateText;
//           }
//           else if (currentColumn.type == TypeColumn.ExternalTemplate) {
//             try {
//               if (rowItem[itemPropertyName] == null || rowItem[itemPropertyName] == undefined) {
//                 searchString += "";
//               }
//               else if (Array.isArray(rowItem[itemPropertyName]) || typeof (rowItem[itemPropertyName] === 'object')) {

//                 searchString += JSON.stringify(rowItem[itemPropertyName]);
//               }
//               else {
//                 searchString += rowItem[itemPropertyName].toString().toLowerCase();
//               }
//             }
//             catch (Error) {
//               searchString += "";
//             }
//           }
//           else {
//             searchString += this.getValue(rowItem, currentColumn);
//           }
//         }
//       }
//     }
//     return searchString;
//   }

//   /**
//    * Restituisce TRUE se il type della colonna risulta essere valido per la ricerca altrimenti restituisce FALSE
//    * @param c Colonna della tabella per cui verificare la validità del type per la ricerca
//    * @returns
//    */
//   isColumnTypeValidForSearch(c: ConfigColumn): boolean {
//     return c.type != TypeColumn.Icon && c.type != TypeColumn.Checkbox && c.type != TypeColumn.Image && c.type != TypeColumn.MenuAction && c.type != TypeColumn.SimpleAction && c.type != TypeColumn.Color && c.isSearchable != false
//   }

//   // Tramite l'enumHelper a cui vengono passati il modello dell'enumeratore e il valore assunto dall'enumeratore stesso
//   // Viene restituita l'etichetta da mostrare
//   getEnumValue(inputEnum, element, col, columnValue = null) {

//     let currentColumnValue = null;

//     if (columnValue == null)
//       currentColumnValue = this.getValue(element, col);
//     else
//       currentColumnValue = columnValue;

//     if (currentColumnValue != null && currentColumnValue != undefined)
//       return this.enumHelper.getEnumLabel(inputEnum, currentColumnValue, this.isMultiLanguage, col.multilanguagePrefixKey);
//     else
//       return null;
//   }

//   /**
//    * Metodo per la verifica del Disabled sul bottone
//    */
//   getDisableInfo(action, element) {
//     if (!action.disabled)
//       return;

//     if (typeof (action.disabled) == "boolean") {
//       return action.disabled;
//     } else {
//       return action.disabled(element);
//     }
//   }

//   /**
//   * Metodo per la verifica dell'Hidden sul bottone
//   */
//   getHiddenInfo(action, element) {
//     if (!action.hidden)
//       return;

//     if (typeof (action.hidden) == "boolean") {
//       return action.hidden;
//     } else {
//       return action.hidden(element);
//     }
//   }

//   getIconValue(action, element) {
//     if (!action.icon)
//       return;

//     if (typeof (action.icon) == "string") {
//       return action.icon;
//     } else {
//       return action.icon(element);
//     }
//   }

//   isRowDisabled(element) {
//     if (!this.disableRow)
//       return;

//     if (typeof (this.disableRow) == "string") {
//       let currentValue = this.disableRow;
//       return element[currentValue];
//     }

//     if (typeof (this.disableRow) == "boolean") {
//       let currentValue = this.disableRow;
//       return currentValue;
//     }

//     //se non è string ed è definito sarà sicuramente una funzione
//     else if (this.disableRow != null) {
//       return this.disableRow(element);
//     }
//   }

//   getTooltipInfo(col, element) {
//     if (!col.tooltip)
//       return;

//     if (typeof (col.tooltip.tooltipText) == "string") {
//       return col.tooltip.tooltipText;
//     } else {
//       return col.tooltip.tooltipText(element);
//     }
//   }

//   getNgStyle(col, element) {

//     var styleObject = {};
//     if (typeof (col.containerStyle) == "object") {
//       styleObject = col.containerStyle;
//     } else if (col.containerStyle instanceof Function) {
//       styleObject = col.containerStyle(element);
//     }

//     if (styleObject == null)
//       styleObject = {};

//     if (!this.isRowDisabled(element) == false && styleObject['color'] == null)
//       styleObject['color'] = this.isRowDisabled(element) ? this.greyDisabledColor : 'inherit';

//     if (this.isRowDisabled(element) == true) {
//       styleObject['color'] = this.greyDisabledColor;
//     } else if (styleObject['color'] == null) {
//       styleObject['color'] = 'inherit'
//     }

//     return styleObject;

//   }

//   getHyperlinkTextValue(col, element) {
//     if (!col.hyperlink)
//       return;

//     //Aggiorno la proprietà value così da non dover cambiare il metodo getValue
//     col.value = col.hyperlink.hyperlinkText;

//     let currentColumnValue = this.getValue(element, col);
//     if (currentColumnValue != null && currentColumnValue != undefined)
//       return currentColumnValue;
//     else
//       return col.value;

//     // if (col.hyperlink.hyperlinkText) {
//     //   if (typeof (col.hyperlink.hyperlinkText) == "string") {
//     //     return col.hyperlink.hyperlinkText;
//     //   } else {
//     //     return col.hyperlink.hyperlinkText(element);
//     //   }
//     // }

//   }

//   getHyperlinkUrlValue(col, element) {
//     if (!col.hyperlink)
//       return;

//     if (col.hyperlink.hyperlinkUrl) {
//       if (typeof (col.hyperlink.hyperlinkUrl) == "string") {
//         return col.hyperlink.hyperlinkUrl;
//       } else {
//         return col.hyperlink.hyperlinkUrl(element);
//       }
//     }

//   }

//   getImagePreviewValue(col, element) {
//     if (!col.image)
//       return;

//     if (typeof (col.image.imagePreview) == "string") {
//       return col.image.imagePreview;
//     } else {
//       return col.image.imagePreview(element);
//     }
//   }

//   getImageFullValue(col, element) {
//     if (!col.image)
//       return;

//     if (typeof (col.image.imageFull) == "string") {
//       return col.image.imageFull;
//     } else {
//       return col.image.imageFull(element);
//     }
//   }

//   getCurrentLanguage() {
//     return this.eqpTableService.getLanguage();
//   }

//   highlight(row) {
//     if (this.isHighlight == true) {
//       if (row != null && this.selectedRow != row) {
//         this.selectedRow = row;
//         this.highlightSelected.emit(this.selectedRow);
//       } else {
//         this.highlightDeselected.emit(this.selectedRow);
//         this.selectedRow = new SelectionModel<any>(false, null);
//       }

//     }
//   }

//   deselectHighlight() {
//     if (this.selectedRow != null)
//       this.selectedRow = null;
//   }

//   executeConfirmFunction() {
//     this.functionButtonConfirm.emit(this.allSelectedValue);
//   }

//   executeExitFunction() {
//     this.functionButtonExit.emit(null);
//   }

//   /**
//    * Gestione paginazione lato server
//    * @param event
//    */
//   pageChanged(event) {

//     //Aggiorno il matPaginatorSize attuale e salvo nel localStorage il pageIndex selezionato
//     //N.B. lo associo alla tabella se è stato definito il suo tableName altrimenti genero un nome composto dalle colonne della tabella stessa
//     this.matPaginatorSize = event.pageSize;
//     localStorage.setItem(this._doc.title + ' Table => ' + (this.tableName != null ? this.tableName : btoa(JSON.stringify(this.table["_rowDefs"][0].columns))), this.matPaginatorSize.toString());

//     let pageIndex = event.pageIndex;
//     let pageSize = event.pageSize;

//     let previousIndex = event.previousPageIndex;

//     let previousSize = pageSize * pageIndex;

//     let infoToSend = {
//       previousSize, pageIndex, pageSize
//     }

//     this.pageChange.emit(infoToSend);
//   }

//   /**
//    * Gestione ordinamento lato server
//    * @param event
//    */
//   sortChanged(event) {
//     this.sortChange.emit(event);
//   }

//   //#region Gestione eventi di output per AVVIO e FINE esportazione tabella

//   /**
//  * Viene scatenato quando viene avviata la procedura di export della tabella (procedura standard e non custom)
//  */
//   exportStart() {
//     this.eqpExportStarted.emit();
//   }

//   /**
//    * Viene scatenato quando viene completata la procedura di export della tabella (procedura standard e non custom)
//    */
//   exportComplete() {
//     this.eqpExportCompleted.emit();
//   }

//   //#endregion

//   createPdf() {
//     var doc = new jsPDF();

//     doc.setFontSize(18);
//     doc.text('My Team Detail', 11, 8);
//     doc.setFontSize(11);
//     doc.setTextColor(100);


//     (doc as any).autoTable({
//       head: this.tableColumns.map(x => x.display),
//       body: this.data,
//       theme: 'plain',
//       didDrawCell: data => {
//         console.log(data.column.index)
//       }
//     })

//     // below line for Open PDF document in new tab
//     doc.output('dataurlnewwindow')

//     // below line for Download PDF document
//     doc.save('myteamdetail.pdf');
//   }

// }
