import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ExportType, MatTableExporterDirective } from 'mat-table-exporter';
import { TranslateTableHelper } from '../../helpers/translateTable.helper';
import { ConfigColumn, ExportEqpTable, TypeColumn } from '@eqproject/eqp-common';

@Component({
  selector: 'eqp-table-exporter',
  templateUrl: 'eqp-table-exporter.component.html',
  styleUrls: ['eqp-table-exporter.component.scss'],
})
export class EqpTableExporterComponent implements OnInit {

  //#region Definizione INPUT

  /**
 * Indica il nome del file che si sta esportando, se non definito verrà attribuito il nome "New"
 */
  @Input("exportEqpTable") exportEqpTable: ExportEqpTable;

  /**
   * Se true, allora verrà utilizzato un emitter all'interno del translateHelper per gestire la sincronia delle chiamate con l'enumhelper
   * che si dovrà occupare di ritornare (nel caso di enumeratore) l'elenco tradotto
   */
  @Input("isMultiLanguage") isMultiLanguage: boolean = false;

  /**
  * Se true, viene aggiunta la colonna delle checkbox
  */
  @Input("selectionEnabled") selectionEnabled: boolean = false;

  /**
  * Configurazione delle colonne da dare alla tabella, Tipo: Array<ConfigColumn>
  */
  @Input("tableColumns") tableColumns: Array<ConfigColumn> = new Array<ConfigColumn>();

  @Input('exporterInstance') exporterInstance: MatTableExporterDirective;

  //#endregion

  //#region Proprietà per gestione mat-table-exporter

  /**
   * Array usato per memorizzare i formati possibili da usare per l'esportazione. Se l'utente passa uno specifico type o N specifici type allora verranno usati solo quelli
   * altrimenti li mostra tutti quelli previsti.
   *
   * Workaround Andrea, è stato necessario renderlo any in quanto ora può essere un array di 2 tipi => ExportType e CustomExportType
   */
  exportValidTypes: any;

  /**
   * Definizione dei formati di default da utilizzare per l'esportazione qualora l'utente non richieda una configurazione particolare
   */
  exportDefaultValidTypes: string[] = ["xlsx", "csv", "txt"];

  /**
   * Variabile d'appoggio del tipo dell'enum in modo da poterla
   */
  exportTypeEnum = ExportType;

  //#endregion


  constructor(private translateTableHelper: TranslateTableHelper, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.configureExport();
  }

  /**
   * Configura i dati per l'esportare dell'eqp-table
   */
  configureExport() {

    //Se è stata richiesta la funzionalità di esportazione allora compone l'array di tutti i formati esportabili
    if (this.exportEqpTable != null) {

      //#region Imposta l'array di estensioni possibili per l'export

      //Se viene passato un array nella configurazione allora utilizza quello altrimenti mostra i tipi di default (xlsx, csv e text)
      if (this.exportEqpTable.exportFileType != null)
        this.exportValidTypes = Array.isArray(this.exportEqpTable.exportFileType) ? this.exportEqpTable.exportFileType : [this.exportEqpTable.exportFileType];
      else {
        let enumValue = ExportType;
        this.exportValidTypes = Object.keys(enumValue).map(k => enumValue[k]).filter(p => this.exportDefaultValidTypes.includes(p));
      }
      //#endregion

      //Normalizza e nasconde le colonne che non servono all'exporter (es: colonne con pulsanti)
      //this.normalizeTableExporterHiddenColumns();

      //Se è stato passato il buttonTextTranslateKey e la tabella è gestita col multilingua allora
      //sovrascrive il buttonText con la traduzione associata alla buttonTextTranslateKey (recuperara dal json di traduzione caricata per la tabella)
      if (this.exportEqpTable.buttonTextTranslateKey != null && this.isMultiLanguage == true && this.translateTableHelper.translateService != null) {
        this.exportEqpTable.buttonText = this.translateTableHelper.returnTranslateValue(this.exportEqpTable.buttonTextTranslateKey, null);
      }

      //Se è stato passato il tooltipTextTranslateKey e la tabella è gestita col multilingua allora
      //sovrascrive il tooltipText con la traduzione associata alla tooltipTextTranslateKey (recuperara dal json di traduzione caricata per la tabella)
      if (this.exportEqpTable.tooltipTextTranslateKey != null && this.isMultiLanguage == true && this.translateTableHelper.translateService != null) {
        this.exportEqpTable.tooltipText = this.translateTableHelper.returnTranslateValue(this.exportEqpTable.tooltipTextTranslateKey, null);
      }
    }
  }

  // /**
  //  * Normalizza le colonne da nascondere all'exporter includendo tutte le colonne di tipo MenuAction, SimpleAction e, se attiva la selezione, anche la colonna di selezione
  //  */
  //  normalizeTableExporterHiddenColumns() {
  //   //Aggiunge di default le colonne che contengono pulsanti tra le colonne nascoste per l'esportazione
  //   if (this.exportEqpTable.hiddenColumns == null) {
  //     this.exportEqpTable.hiddenColumns = [];
  //   }

  //   //Se la selezione è attiva allora aggiunge sempre l'indice 0 che coincide con la colonna di selezione (che non va esportata)
  //   if (this.selectionEnabled == true && this.exportEqpTable.hiddenColumns.find(p => p == 0) == null)
  //     this.exportEqpTable.hiddenColumns.push(0);

  //   //Legge gli indici delle colonne di tipo SIMPLE_ACTION e MENU_ACTION e li aggiunge all'hiddenColumns
  //   for (let colIndex = 0; colIndex < this.tableColumns.length; colIndex++) {
  //     if (this.exportEqpTable.hiddenColumns.find(c => c == colIndex) == null && (this.tableColumns[colIndex].type == TypeColumn.MenuAction || this.tableColumns[colIndex].type == TypeColumn.SimpleAction)) {
  //       let hiddenColumnIndex = this.selectionEnabled == true ? colIndex + 1 : colIndex;
  //       if (this.exportEqpTable.hiddenColumns.find(p => p == hiddenColumnIndex) == null)
  //         this.exportEqpTable.hiddenColumns.push(hiddenColumnIndex);
  //     }
  //   }
  // }


  /**
   * Funzione che si occupa di invocare l'export della tabella mediante la direttiva mat-table-exporter.
   * Inizialmente la chiamata avveniva direttamente dall'html ma questo comportava un errore con gli indici delle eventuali colonne escluse quando nella tabella
   * era attiva la selezione (La colonna di selezionava veniva aggiunta a runtime dopo il rendering e quindi occupava una nuova posizione 0 con conseguente scarrellamento di tutte le altre colonne).
   * @param exportType Tipo di esportazione
   */
  runTableExporter(exportType: ExportType) {
    this.exporterInstance.exportTable(exportType, { fileName: this.exportEqpTable.exportFileName != null ? this.exportEqpTable.exportFileName : 'Export ' + exportType, Props: { Author: 'EqProject' } });
  }

}
