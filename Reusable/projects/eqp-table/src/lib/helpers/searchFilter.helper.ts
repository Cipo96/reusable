import { ConfigColumn, TypeColumn } from "@eqproject/eqp-common";
import { ColumnValueHelper } from "./columnValue.helper";
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from "@angular/material/table";
import { Injectable } from "@angular/core";

/**
* Costante per definire i caratteri speciali possibili da utilizzare come separatore nel formato data.
*/
const SPLIT_CHARACTERS: string = "*|/,:;.-";

/**
 * Servizio di helper contenente le funzioni di utilità per l'utilizzo dei filtri di ricerca
 */
@Injectable()
export class SearchFilterHelper {

    datePipe: DatePipe = null;
    tableColumns: Array<ConfigColumn> = null;
    cultureInfo: string = null;
    currencyFilterToReplace: string = null;
    currencyFilterToUse: string = null;

    constructor(private columnValueHelper: ColumnValueHelper) {

    }

    /**
       * Funzione richiamata nella costruzione del FilterPredicate custom,si occupa di comporre (per ciascun elemento della tabella) una stringa
       * ottenuta dalla concatenazione di tutti i valori mostrati nelle colonne valide per la ricerca.
       *
       * La stringa risultante sarà poi usata per l'applicazione del filtro nel metodo reloadDatatable
       *
       * N.B. La funzione, tramite il reduce richiamato nella funzione del filter predicate, viene richiamata per ogni proprietà dell'oggetto
       * bindato alla riga della tabella
       *
       * @param searchString Stringa costruita ricorsivamente (dall'accumulator) che contiene la concatenazione dei valori delle proprietà dell'elemento cu sui fare la ricerca
       * @param rowItem Elemento bindato alla riga
       * @param columnKey Chiave della ConfigColumn
       * @returns
       */
    createFilterRow(searchString, rowItem, itemPropertyName) {

        if (searchString == null || searchString == undefined)
            searchString = "";

        //Recupera tutte le colonne della tabella associate alla property name corrente (potrebbero esserci più colonne che nel value utilizzano la stessa proprietà quindi è necessario recuperarle tutte)
        let propertyObjectColumns = this.tableColumns.filter(x => x.key == itemPropertyName || (x.value != null && x.value.toString().toLowerCase().includes(itemPropertyName.toLowerCase()) == true));

        //Se non ci sono colonne associate alla proprietà esce restituendo una stringa vuota
        if (propertyObjectColumns == null || propertyObjectColumns == undefined || propertyObjectColumns.length == 0) {
            searchString += "";
        }
        else {
            //Filtra le colonne recuperate escludendo tutte quelle di tipo SIMPLE_ACTION, MENU_ACTION, ICON, IMAGE o CHECKBOX (non servono per la ricerca)
            //più tutte quelle per cui la proprietà isSearchable è stata impostata a FALSE
            let validColumns = propertyObjectColumns.filter(c => c.isSearchable != false && this.isColumnTypeValidForSearch(c.type, c.isSearchable));

            //Se non ci sono colonne valide esce restituendo una stringa vuota
            if (validColumns == null || validColumns.length == 0) {
                searchString += "";
            }
            else {
                //Cicla le colonne valide e per ciascuna di esse ricostruisce il valore mostrato nella colonna e lo aggiunge alla stringa su cui verrà fatta la ricerca finale
                for (var colIndex = 0; colIndex < validColumns.length; colIndex++) {
                    //Concateno alla searchString il valore mostrato nella colonna corrente, ricostruito con gli stessi metodi
                    //usati nelle diverse celle della tabella
                    let currentColumn = validColumns[colIndex];
                    if (currentColumn.type == TypeColumn.Enum) {
                        searchString += this.columnValueHelper.getEnumValue(currentColumn.enumModel, rowItem, currentColumn);
                    }
                    else if (currentColumn.type == TypeColumn.Boolean) {
                        searchString += this.columnValueHelper.getBooleanValue(rowItem, currentColumn);
                    }
                    else if (currentColumn.type == TypeColumn.Date) {
                        //Recupero il valore della data w e poi lo riscrivo nel formato visualizzato in base alla lingua
                        let data = this.columnValueHelper.getDateValue(rowItem, currentColumn);
                        let currentDate: any = null;
                        if (data == null) {
                            searchString += "";
                            return searchString;
                        }
                        else if (typeof data === "string") {
                            currentDate = new Date(data);

                        }
                        else {
                            currentDate = data;
                        }

                        let currentDateText: string = this.datePipe.transform(currentDate, currentColumn.format ?? "shortDate", null, this.cultureInfo);
                        let arrayOfSplChars: Array<string> = Array.from(SPLIT_CHARACTERS);
                        let usedSplChar: string;

                        arrayOfSplChars.forEach(element => {
                            if (currentDateText.includes(element)) {
                                usedSplChar = element;
                                let splittedDate = currentDateText.split(element);
                                splittedDate.forEach(function (singleDate, index) {
                                    if (singleDate.length <= 1) {
                                        splittedDate[index] = singleDate.padStart(2, "0");
                                    }
                                });
                                currentDateText = splittedDate.join(usedSplChar);
                            }
                        });

                        searchString += currentDateText;
                    }
                    else if (currentColumn.type == TypeColumn.ExternalTemplate) {
                        try {
                            if (rowItem[itemPropertyName] == null || rowItem[itemPropertyName] == undefined) {
                                searchString += "";
                            }
                            else if (Array.isArray(rowItem[itemPropertyName]) || typeof (rowItem[itemPropertyName] === 'object')) {

                                searchString += JSON.stringify(rowItem[itemPropertyName]);
                            }
                            else {
                                searchString += rowItem[itemPropertyName].toString().toLowerCase();
                            }
                        }
                        catch (Error) {
                            searchString += "";
                        }
                    }
                    else {
                        searchString += this.columnValueHelper.getValue(rowItem, currentColumn);
                    }
                }
            }
        }
        return searchString;
    }

    /**
     * Restituisce TRUE se il type della colonna risulta essere valido per la ricerca altrimenti restituisce FALSE
     * @param c Colonna della tabella per cui verificare la validità del type per la ricerca
     * @returns
     */
    isColumnTypeValidForSearch(type: TypeColumn, isSearchable: boolean): boolean {
        return type != TypeColumn.Icon && type != TypeColumn.Checkbox && type != TypeColumn.Image && type != TypeColumn.MenuAction && type != TypeColumn.SimpleAction && type != TypeColumn.Color && isSearchable != false
    }

    /**
     * Si occupa di costruire il predicato da associare al filterPredicate del datasource della mat-table
     * @param dataSource Datasource della mat-table
     * @param isSingleColumnFilter Input di eqp-table che specifica se si sta usando la ricerca globale o su singola colonna
     * @param selectedColumnToSearch Chiave della colonna su cui applicare il filtro (usata solo se isSingleColumnFIlter = true)
     * @param row Riga della mat-table
     * @param filter Valore del filtro inserito dall'utente
     * @returns Restituisce un booleano con valore TRUE per le righe che soddisfano il filtro, altrimenti restituisce FALSE
     */
    createFilterPredicate(dataSource: MatTableDataSource<any>, isSingleColumnFilter: boolean, selectedColumnToSearch: string, row, filter: string): boolean {
        if (isSingleColumnFilter == true && dataSource.filteredData != null && dataSource.filteredData.find(x => x == row) == null)
            return;

        const accumulator = (currentTerm, key) => {
            let x = this.createFilterRow(currentTerm, row, key);
            return x;
        };

        const dataStr = !isSingleColumnFilter ? Object.keys(row).reduce(accumulator, '').toLowerCase().replace(/\s/g, "") : this.createFilterRow(null, row, selectedColumnToSearch).toLowerCase().replace(/\s/g, "");
        filter = filter.replace(/\s/g, "");

        if (this.currencyFilterToReplace != null) {

            if (this.currencyFilterToUse == null)
                throw new Error("Attenzione, la proprietà currencyFilterToUse è obbligatoria!");

            filter = filter.split(this.currencyFilterToReplace).join(this.currencyFilterToUse);

        }

        const transformedFilter = filter.toString().trim().toLowerCase();
        return dataStr.indexOf(transformedFilter) !== -1;
    }

    addExternalTemplateFilters() {

    }
}
