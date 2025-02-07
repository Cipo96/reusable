import { Component, OnInit, ViewChild, SimpleChanges, ChangeDetectorRef, Inject, HostListener, AfterViewInit, ElementRef } from '@angular/core';
import { TypeColumn, HeaderFilter, CellAlignmentEnum, ConfigColumn } from '@eqproject/eqp-common';
import { TableColumnField, EqpCommonService } from '@eqproject/eqp-common';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EnumHelper } from './helpers/enum.helper';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { EqpTableService } from './eqp-table.service';
import { DatePipe, DOCUMENT } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import 'jspdf-autotable';
import jsPDF from 'jspdf';
import { TranslateTableHelper } from './helpers/translateTable.helper';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { ColumnStyleHelper } from './helpers/columnStyle.helper';
import { ColumnValueHelper } from './helpers/columnValue.helper';
import { ColumnAccessibilityHelper } from './helpers/columnAccessibility.helper';
import { ColumnPipeHelper } from './helpers/columnPipe.helper';
import { EqpTableBaseComponent } from './internal-components/base-component/base.component';
import { SearchFilterHelper } from './helpers/searchFilter.helper';
import { SortingHelper } from './helpers/sorting.helper';
import { ResizeHelper } from './helpers/resize.helper';

/**
 * Costante per definire i caratteri speciali possibili da utilizzare come separatore nel formato data.
 */
const SPLIT_CHARACTERS: string = '*|/,:;.-';


@Component({
  selector: 'eqp-table',
  templateUrl: 'eqp-table.component.html',
  styleUrls: ['eqp-table.component.scss', 'eqp-table-mobile.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('iconTransition', [
      state('true', style({ transform: 'rotate(180deg)' })),
      state('false', style({ transform: 'rotate(0deg)' })),
      transition('true <=> false', animate('200ms ease-out')),
    ])
  ],
  providers: [DatePipe, ColumnValueHelper, ColumnStyleHelper, ColumnAccessibilityHelper, ColumnPipeHelper, SearchFilterHelper, SortingHelper, ResizeHelper]
})
export class EqpTableComponent extends EqpTableBaseComponent implements OnInit, AfterViewInit {


  //N.B. LA DEFINIZIONE DI INPUT E OUTPUT DEL COMPONENTE E' FATTA SU EqpTableMainComponent


  expandedElement: any | null;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public TypeEnum = TypeColumn;
  private paginator: MatPaginator;
  private sort: MatSort;
  searchActive = false; // Stato della ricerca
  public mediaQuery: MediaQueryList;
  @ViewChild('searchInput') searchInput: ElementRef; // Riferimento all'elemento di input
  @ViewChild('table', { static: false }) table: MatTable<any>;
  @ViewChild('tableContainer', { read: ElementRef }) tableContainer: ElementRef;
  @ViewChild('exporter', { static: false }) exporter: MatTableExporterDirective;


  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.reloadDatatable();
  }


  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    if (this.pageChange.observers != null && this.pageChange.observers.length == 0) {
      this.paginator = mp;
      this.reloadDatatable();
    }
  }


  //#region Proprietà per gestione culture e lingua


  currentCultureSelected: string;
  currentLocaleSelected: string;


  //#endregion


  //#region Proprietà per gestione configurazione colonne

  /**
   * Restituisce la mappatura di tutte le colonne dell'eqp-table
   */
  getColumnKeys() {
    let keysToReturn;


    //Nel caso in cui non sia stata passata una chiave, la creo io runtime
    if (this.tableColumns.filter(e => e.key == null).length > 0) {
      var counter = 0;
      this.tableColumns.forEach(column => {
        if (column.key == null) {
          column.key = 'Key_' + counter;
          counter++
        }
      });
    }


    if (this.isMultipleSelection || this.selection) {
      let checkboxToAdd = 'Checkbox';
      let currentArray = this.tableColumns.filter(x => !x["isHidden"]).map(({ key }) => key);
      currentArray.unshift(checkboxToAdd);
      keysToReturn = currentArray;
    } else {
      keysToReturn = this.tableColumns.filter(x => !x["isHidden"]).map(({ key }) => key);
    }

    //Dopo i controlli, verifico quali sono nel viewport
    if (this.autoResizeColumns == true) {
      const mediaQuery = window.matchMedia('(min-width: 961px)');

      // Verifica se il media screen è superiore a 961px
      if (mediaQuery.matches) {
        keysToReturn = this.resizeHelper.getKeysInViewPort(keysToReturn);
      }
    }

    return keysToReturn;
  }


  /**
   * Conterrà ogni volta il nome della colonna nel quale si sta facendo il filtro singolo
   */
  selectedColumnToSearch: string;


  /**
   * Variabile d'appoggio per poter usare l'uguaglianza direttamente con i valori dell'enum sull'HTML.
   * In questo modo si evita di usare i numeri associati all'enum ma direttamente la loro etichetta (molto più parlante)
   */
  cellAlingmentEnum = CellAlignmentEnum;


  /**
   * Valore di default per la grandezza delle colonne
   */
  standardFlexValue: string = '0 0 10%';


  //#endregion


  //#region Proprietà per gestione selezione su tabella


  /**
   * Contiene tutta la riga selezionata, ho usato SelectionModel perchè la documentazione non è chiara a riguardo ma
   * sarebbe la classe corretta da utilizzare (messa anche se non utilizzata per sviluppi futuri)
   */
  selectedRow = new SelectionModel<any>(false, null);


  /**
   * Array di appoggio dove andranno a finire tutte le checkbox selezionate, con le relative informazioni di ogni riga
   */
  allSelectedValue: Array<any> = new Array<any>();


  // Variabile booleana che viene aggiornata nella selezione/deselezione delle checkbox (in caso di colonna checkbox)
  isAllSelected: boolean = false;


  displayedColumns: Array<string>;
  detailColumns: Array<string> = [];
  detailConfigColumns: Array<ConfigColumn> = new Array<ConfigColumn>();


  //#endregion


  //#region Proprietà e funzioni per filtri su singola colonna


  /**
   * Proprietà readonly che restituisce la definizione delle colonne su cui dover applicare i filtri per singola colonna
   */
  get getHeaderFiltersColumnDefinitions() {
    if (this.isSingleColumnFilter == null || this.isSingleColumnFilter == false)
      return;


    return this.headersFilters.map(({ column }) => column);
  }


  headersFilters: Array<HeaderFilter> = new Array<HeaderFilter>();
  filtersModel = [];
  filterKeys = {};
  doit;
  private resizeTimeout: any;

  //#endregion


  constructor(private enumHelper: EnumHelper,
    private eqpTableService: EqpTableService,
    private cd: ChangeDetectorRef,
    private translateTableHelper: TranslateTableHelper,
    private datePipe: DatePipe,
    @Inject(DOCUMENT) private _doc: any,
    public columnValueHelper: ColumnValueHelper,
    public columnStyleHelper: ColumnStyleHelper,
    public columnAccessibilityHelper: ColumnAccessibilityHelper,
    public columnPipeHelper: ColumnPipeHelper,
    public searchFilterHelper: SearchFilterHelper,
    public sortingHelper: SortingHelper,
    public resizeHelper: ResizeHelper) {


    super();


    this.languagePipesConfigurations();
  }


  //#region Funzioni di inizializzazione


  /**
   * Quando la tabella viene inizializzata vengono inizializzati gli helper statici, configurati i filtri e normalizzate le eventuali colonne da
   * escludere nell'export (es: colonne con pulsanti)
   */
  ngOnInit(): void {


    super.ngOnInit();

    if (this.tableColumnFields != null)
      this.checkAndConvertTableColumn()

    this.initializeHelpers();


    this.normalizeColumnsValueAttributeForSearch();
    this.normalizeTableExporterHiddenColumns();


    // Inizializzo il datasource, il sort e il paginator
    this.reloadDatatable(true);


    if (this.autoResizeColumns === true)
      this.onResize();


    //Faccio fare la mappatura singola dei filtri solo se viene passato true nell'input
    if (this.isSingleColumnFilter == true || this.switchFilterType != null)
      this.getHeaderFilters();


    this.displayedColumns = this.getColumnKeys();

  }


  ngAfterViewInit(): void {
    if (this.autoResizeColumns === true)
      this.onResize();
  }


  @HostListener('window:resize', ['$event'])
  onResize() {
    this.mediaQuery = window.matchMedia('(min-width: 961px)');
    // if (this.autoResizeColumns == true) {
    //   this.doit = setTimeout(() => self.callResizeHelper(), 300);
    // }
    clearTimeout(this.resizeTimeout); // Cancella il timeout precedente, se presente

    this.resizeTimeout = setTimeout(() => {
      this.callResizeHelper();
    }, 300);
  }


  callResizeHelper() {
    this.displayedColumns = this.getColumnKeys();
    this.resizeHelper.doResize(this);
  }


  /**
   * Normalizza le colonne da nascondere all'exporter includendo tutte le colonne di tipo MenuAction, SimpleAction e, se attiva la selezione, anche la colonna di selezione
   */
  normalizeTableExporterHiddenColumns() {
    if (this.exportEqpTable == null || this.exportEqpTable == undefined)
      return;


    //Aggiunge di default le colonne che contengono pulsanti tra le colonne nascoste per l'esportazione
    if (this.exportEqpTable.hiddenColumns == null) {
      this.exportEqpTable.hiddenColumns = [];
    }


    //Se la selezione è attiva allora aggiunge sempre l'indice 0 che coincide con la colonna di selezione (che non va esportata)
    if (this.selection == true && this.exportEqpTable.hiddenColumns.find(p => p == 0) == null)
      this.exportEqpTable.hiddenColumns.push(0);


    //Legge gli indici delle colonne di tipo SIMPLE_ACTION e MENU_ACTION e li aggiunge all'hiddenColumns
    for (let colIndex = 0; colIndex < this.tableColumns.length; colIndex++) {
      if (this.exportEqpTable.hiddenColumns.find(c => c == colIndex) == null && (this.tableColumns[colIndex]["type"] == TypeColumn.MenuAction || this.tableColumns[colIndex]["type"] == TypeColumn.SimpleAction)) {
        const hiddenColumnIndex = this.selection == true ? colIndex + 1 : colIndex;
        if (this.exportEqpTable.hiddenColumns.find(p => p == hiddenColumnIndex) == null)
          this.exportEqpTable.hiddenColumns.push(hiddenColumnIndex);
      }
    }
  }


  /**
   * Inizializza le proprietà statiche dei diversi helper.
   * Questa procedura è necessaria per fare in modo che i diversi helper, condivisi sia da eqp-table che dai componenti più interni,
   * possano lavorare sulle stesse istanze degli INPUT o dei servizi iniettati tramite D.I.
   */
  initializeHelpers() {
    this.columnAccessibilityHelper.disableRow = this.disableRow;
    this.columnAccessibilityHelper.disableRowColor = this.disableRowColor;
    this.columnValueHelper.isMultiLanguage = this.isMultiLanguage;
    this.searchFilterHelper.datePipe = this.datePipe;
    this.searchFilterHelper.tableColumns = this.tableColumns;
    this.searchFilterHelper.cultureInfo = this.cultureInfo;
    this.searchFilterHelper.currencyFilterToReplace = this.currencyFilterToReplace;
    this.searchFilterHelper.currencyFilterToUse = this.currencyFilterToUse;
    this.resizeHelper.initializeEqpTableContext(this);
  }


  /**
   * Cicla tutte le colonne per cui è stata definita solo la key (e che quindi il value undefined) e riporta lo stesso valore
   * anche per la proprietà value in modo da averle tutte allineate.
   *
   * Il ciclo viene eseguito per tutte le colonne definite, fatta eccezione per quelle che contengono pulsanti o icone o immagini
   */
  normalizeColumnsValueAttributeForSearch() {
    if (this.tableColumns == null || this.tableColumns == undefined)
      return;

    this.tableColumns.filter(t => (t.value == undefined || t.value == null) && this.searchFilterHelper.isColumnTypeValidForSearch(t["type"], t["isSearchable"]))
      .forEach(t => {
        t.value = t.key;
      });
  }


  languagePipesConfigurations() {
    this.eqpTableService.initPossibileLanguages();
    this.currentCultureSelected = this.eqpTableService.getDatePipe();
    this.currentLocaleSelected = this.eqpTableService.getCurrentLocale();
  }


  getHeaderFilters() {


    if (this.tableColumns == null || this.tableColumns.length == 0)
      return;


    var counter = 0;
    this.tableColumns.forEach(element => {
      let headerFilter = new HeaderFilter();
      headerFilter.column = element.key + '_' + counter;
      headerFilter.key = this.searchFilterHelper.isColumnTypeValidForSearch(element["type"], element["isSearchable"]) ? element.value.toString() : element.key;
      headerFilter.styles = element.styles;
      headerFilter.isSearchable = element["isSearchable"] != null ? element["isSearchable"] : true;
      headerFilter.type = element["type"];
      this.headersFilters.push(headerFilter);
      counter++;
    });


    if (this.selection == true) {
      let checkboxToAdd: HeaderFilter = new HeaderFilter();
      checkboxToAdd.column = 'CheckboxColumn';
      checkboxToAdd.isSearchable = false;
      checkboxToAdd.key = 'Checkbox';
      this.headersFilters.unshift(checkboxToAdd);
    }


    if (this.autoResizeColumns == true) {
      const detailToAdd: HeaderFilter = new HeaderFilter();
      detailToAdd.column = 'DetailColumn';
      detailToAdd.isSearchable = false;
      detailToAdd.key = 'Detail';
      this.headersFilters.unshift(detailToAdd);
    }
  }


  // In caso di chiamata asincrona, aggiorno il datasource come arrivano i dati
  ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
    if (changes['data'] != undefined) {
      this.data = changes.data.currentValue != undefined ? changes.data.currentValue : [];
      this.reloadDatatable(true);
    }
  }

  //#endregion


  //#region Funzioni per reload datasource e gestione paginazione e ordinamento


  /**
   * Ricarica la datatable ridefinendo, oltre al datasource, anche la paginazione, l'ordinamento, il predicato di ricerca.
   * Ridefinisce inoltre l'originalIndex di ogni elemento.
   * @param firstLoading Serve principalmente per il isSingleColumnFilter, perchè non devono essere sempre riaggiornati i dati ma solo all'init e alla modifica (vedere onChanges)
   */
  public reloadDatatable(firstLoading: boolean = false) {
    var self = this;


    if (this.dataSource == undefined)
      this.dataSource = new MatTableDataSource();


    //Nel caso in cui data contiene un element di tipo string, allora assegno forzatamente una key a quell'elemento
    if (this.isSingleColumnFilter != true || (this.isSingleColumnFilter == true && firstLoading == true)) {
      var counter = 0;
      this.data.forEach(element => {
        this.data[counter]['originalIndex'] = counter;
        counter++;
      });
      this.dataSource.data = this.data;
    }

    this.dataSource.sortingDataAccessor = (obj, property) => this.sortingHelper.getSortOrder(this.tableColumns, obj, property);


    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;


    //Recupero il pageIndex della tabella attuale dal localStorage(se definito)
    if (this.tableName != null || (this.table != null && localStorage.getItem(this._doc.title + ' Table => ' + btoa(JSON.stringify(this.table['_rowDefs'][0].columns))) != null)) {
      this.matPaginatorSize = Number(localStorage.getItem(this._doc.title + ' Table => ' + (this.tableName != null ? this.tableName : btoa(JSON.stringify(this.table['_rowDefs'][0].columns)))))
      this.cd.detectChanges();
    }


    //Ricostruisce il predicato da usare come filtro di ricerca dei dati della tabella
    this.dataSource.filterPredicate = function (row, filter: string): boolean {
      row = self.getExternalTemplateFilterValues(row);
      return self.searchFilterHelper.createFilterPredicate(self.dataSource, self.isSingleColumnFilter, self.selectedColumnToSearch, row, filter);
    }
  }

  getExternalTemplateFilterValues(row) {
    for (let element of this.tableColumns.filter(x => x["type"] == TypeColumn.ExternalTemplate)) {
      if (element["externalTemplateSearchFunction"] != null) {
        row = { ...row, [element.key]: (typeof element["externalTemplateSearchFunction"] == "string" ? element["externalTemplateSearchFunction"] : element["externalTemplateSearchFunction"](row)) };
      }
    }
    return row;
  }


  /**
   * Richiama il metodo renderRows della mat-table in modo da forzare il caricamento dei dati nel DOM
   */
  renderRows() {
    this.table.renderRows();
  }


  /**
   * Funzione che si occupa di memorizzare nel localStorage la dimensione di pagina impostata per la tabella (in modo da recuperarla all'init)
   * e, inoltre, invoca l'evento di output pageChange per notificare il cambio di pagina (utile se ad esempio si sta usando la paginazione lato server)
   * @param event
   */
  pageChanged(event) {


    //Aggiorno il matPaginatorSize attuale e salvo nel localStorage il pageIndex selezionato
    //N.B. lo associo alla tabella se è stato definito il suo tableName altrimenti genero un nome composto dalle colonne della tabella stessa
    this.matPaginatorSize = event.pageSize;


    if (this.disablePageStorageSave != true)
      localStorage.setItem(this._doc.title + ' Table => ' + (this.tableName != null ? this.tableName : btoa(JSON.stringify(this.table['_rowDefs'][0].columns))), this.matPaginatorSize.toString());


    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;


    //let previousIndex = event.previousPageIndex;
    let previousSize = pageSize * pageIndex;


    let infoToSend = {
      previousSize, pageIndex, pageSize
    }


    this.pageChange.emit(infoToSend);
  }


  /**
   * Funzione che si occupa di invocare l'evento di output sortChange per notificare il cambio di ordinamento (utile se ad esempio si sta usando la paginazione/ordinamento lato server)
   * @param event
   */
  sortChanged(event) {
    this.sortChange.emit(event);
  }


  //#endregion


  //#region Funzioni di gestione selezione singola/multipla delle righe


  /**
   * Gestione seleziona/deseleziona tutte le checkbox
   */
  selectUnselectAll() {
    this.isAllSelected = !this.isAllSelected;


    if (this.isAllSelected == true) {
      this.allSelectedValue = [];
      let currentIndex = 0;
      this.dataSource.filteredData.forEach(element => {


        // Recupero la proprietà da usare poi come indice dell'element
        let currentValue = this.disableRow != null && typeof this.disableRow === 'string' || typeof this.disableRow === 'boolean' ? this.disableRow : this.disableRow != null && typeof this.disableRow === 'function' ? this.disableRow() : null;


        // Se non è stato definito il disableRow oppure la proprietà del disableRow esiste e ha come valore false allora lo includo nella lista allSelectedValue
        if (this.disableRow == null || currentValue === false || (element.hasOwnProperty(this.disableRow) && !element[currentValue] === true)) {
          element['index'] = currentIndex;
          element[this.isSelectedPropertyName] = true;
          this.allSelectedValue.push(element);
        } else {


        }
        currentIndex++;
      });
    } else if (this.isAllSelected == false) {
      this.allSelectedValue = [];
      this.dataSource.filteredData.forEach(element => {
        element[this.isSelectedPropertyName] = false;
      });
    }


    this.checkboxInfo.emit(this.allSelectedValue);


  }


  /**
   * Costruzione della colonna di checkbox con i relativi possibili comportamenti e casistiche
   */
  changeCheckboxRowSelection(event, element, index) {

    //Controllo gli elementi già presenti nel datasource e li aggiungo alla list su cui farò l'emit
    //se hanno la proprietà isSelected già a true e NON sono già presenti
    this.dataSource.filteredData.forEach(element => {
      if (element[this.isSelectedPropertyName] && element[this.isSelectedPropertyName] == true && !this.allSelectedValue.includes(element))
        this.allSelectedValue.push(element);
    });


    if (!this.isMultipleSelection) {
      if (event.checked == false) {
        element[this.isSelectedPropertyName] = false;
        this.allSelectedValue = [];
      } else if (event.checked == true) {
        if (this.allSelectedValue.length > 0)
          this.allSelectedValue[0][this.isSelectedPropertyName] = false;

        this.allSelectedValue = [];
        element[this.isSelectedPropertyName] = true;
        this.allSelectedValue.push(element);
      }
    } else if (this.isMultipleSelection) {
      element['index'] = index;
      if (event.checked == true) {
        element[this.isSelectedPropertyName] = true;
        this.allSelectedValue.push(element);
      } else if (event.checked == false) {
        let indexToRemove = this.allSelectedValue.findIndex(x => x.index == element.index)
        element[this.isSelectedPropertyName] = false;
        this.allSelectedValue.splice(indexToRemove, 1);
      }
    }


    if (this.allSelectedValue.length == this.dataSource.filteredData.length && this.isMultipleSelection == true) {
      this.isAllSelected = true;
    } else {
      this.isAllSelected = false;
    }


    this.checkboxInfo.emit(this.allSelectedValue);
    this.checkboxJustSelectedInfo.emit(element);
  }


  //#endregion


  //#region Gestione eventi di output per AVVIO e FINE esportazione tabella


  /**
   * Viene scatenato quando viene avviata la procedura di export della tabella (procedura standard e non custom)
   */
  exportStart() {
    this.eqpExportStarted.emit();
  }


  /**
   * Viene scatenato quando viene completata la procedura di export della tabella (procedura standard e non custom)
   */
  exportComplete() {
    this.eqpExportCompleted.emit();
  }


  //#endregion


  //#region  Gestione eventi di output per pulsanti CONFIRM e EXIT


  executeConfirmFunction() {
    this.functionButtonConfirm.emit(this.allSelectedValue);
  }


  executeExitFunction() {
    this.functionButtonExit.emit(null);
  }


  //#endregion


  //#region Funzioni per evidenziazione riga selezionata

  /**
   * Vengono applicate le classi passate alla mat-row, mat-cell e mat-header-cell
   * @param row
   * @returns
   */
  getMatRowCss(row): string {
    if (this.rowCssClass != null)
      return typeof this.rowCssClass == "string" ? this.rowCssClass : this.rowCssClass(row);

    return '';
  }

  getCellCss(element, col): string {
    if (this.cellCssClass != null)
      return typeof this.cellCssClass == "string" ? this.cellCssClass : this.cellCssClass(element, col);

    return '';
  }

  getHeaderCellCss(col): string {
    if (this.headerCellCssClass != null)
      return typeof this.headerCellCssClass == "string" ? this.headerCellCssClass : this.headerCellCssClass(col);

    return '';
  }

  /**
   * Se l'input isHighlight è impostato a TRUE allora si occupa di evidenziare la riga selezionata
   * @param row Riga da evidenziare
   */
  highlight(row) {
    if (this.isHighlight == true) {
      if (row != null && this.selectedRow != row) {
        this.selectedRow = row;
        this.highlightSelected.emit(this.selectedRow);
      } else {
        this.highlightDeselected.emit(this.selectedRow);
        this.selectedRow = new SelectionModel<any>(false, null);
      }


    }
  }


  /**
   * Permette di rimuovere l'evidenziatura dalla riga selezionata.
   * COmporta la deselezione della riga
   */
  public deselectHighlight() {
    if (this.selectedRow != null)
      this.selectedRow = null;
  }


  //#endregion


  //#region Funzioni di ricerca e applicazioni filtri


  /**
   * Funzione richiamata quando l'utente scrivo nel campo di ricerca testuale globale.
   * Si occupa di applicare il filtro sui dati in base alla configurazione delle colonne.
   * @param filterValue Testo scritto nell'input di testo
   */
  applyFilter(filterValue: string) {
    if (filterValue != null && filterValue != '')
      filterValue = filterValue.replace(/\s/g, '');


    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleSearch() {
    this.searchActive = !this.searchActive;
    //Resetto l'input e riapplico il filtro
    if (!this.searchActive) {
      this.searchInput.nativeElement.value = '';
      this.applyFilter('');
    }

    if (this.searchActive)
      this.searchInput.nativeElement.focus();
  }

  /**
   * Funzione richiamata quando l'utente inizia la ricerca su una specifica colonna.
   * Si occupa di filtrare i dati cercando il testo inserito dall'utente solo in una specifica colonna
   * @param filterValue Valore di ricerca inserito dall'utente
   * @param column Colonna su cui va applicato il filtro
   */
  applyFilterSingleColumn(filterValue: string, column: string) {


    //Resetto il datasource al punto di partenza ogni volta che riparte la ricerca
    this.dataSource.data = this.data;
    this.dataSource.filteredData = this.data;
    this.cd.detectChanges();


    //Ciclo le chiavi presenti nelle singole colonne creando un dizionario {Colonna => Testo}
    this.filtersModel.forEach((each, ind) => {
      if (this.selection == true) {
        this.filterKeys[this.tableColumns[ind - 1].value.toString()] = each || null;
      } else {
        this.filterKeys[this.tableColumns[ind].value.toString()] = each || null;
      }
    });


    //Per ogni chiave del dizionario, faccio partire la ricerca
    //N.B l'else finale è
    for (let key in this.filterKeys) {
      if (this.filterKeys[key] == null)
        this.filterKeys[key] = '';


      this.selectedColumnToSearch = key;
      this.applyFilter(this.filterKeys[key]);
      this.dataSource.data = this.dataSource.filteredData;
      this.cd.detectChanges();
    }


  }

  //Al Change dell'evento di checkbox delle hidden columns, aggiorno la proprietà isHidden
  isColumnToShowChecked(cd) {
    cd.isHidden = !cd.isHidden
    if (this.autoResizeColumns == true)
      this.onResize();
  }

  //#endregion

  //#region Gestione TableColumn

  /**
   * Controllo se è tutto configurato correttamente ed eventualmente converto l'array di TableColumn nel
   * modello base utilizzato nel componente (ConfigColumn)
   */
  checkAndConvertTableColumn() {

    this.checkTableColumn();

    //Se mi viene passato direttamente un array di BaseFieldModel, prima lo converto in un array di TableFields
    if (EqpCommonService.isBaseField(this.tableColumnFields))
      this.tableColumnFields = EqpCommonService.convertAs<TableColumnField>(this.tableColumnFields, TableColumnField, this.tableColumnFields.map(x => x.key));

    this.tableColumns = TableColumnField.createConfigColumns(this.tableColumnFields);
  }

  /**
   * Faccio i controlli del caso, per capire se è stata configurata correttamente la nuova tabella
   */
  private checkTableColumn() {
    if (this.tableColumns != null && this.tableColumnFields != null) {
      throw new Error(
        "Can't use simultaneously tableColumns and tableColumnFields"
      );
    }
  }

  //#endregion

  tableFiltersSelected(event) {
    this.filtersSelected.emit(event);
  }

  tableCustomFiltersSavedValueLoaded(event) {
    this.customFiltersSavedValueLoaded.emit(event);
  }

  createPdf() {
    var doc = new jsPDF();


    doc.setFontSize(18);
    doc.text('My Team Detail', 11, 8);
    doc.setFontSize(11);
    doc.setTextColor(100);




    (doc as any).autoTable({
      head: this.tableColumns.map(x => x.display),
      body: this.data,
      theme: 'plain',
      didDrawCell: data => {
        console.log(data.column.index)
      }
    })


    // below line for Open PDF document in new tab
    doc.output('dataurlnewwindow')


    // below line for Download PDF document
    doc.save('myteamdetail.pdf');
  }
}



