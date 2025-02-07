import { Injectable } from '@angular/core';
import { EnumHelper } from './enum.helper';

/**
 * Servizio di helper che espone le funzioni statiche che hanno il compito di ricavare l'effettivo valore da mostrare nelle celle della tabella.
 */
@Injectable()
export class ColumnValueHelper {

    /**
     * Proprietà (popolata nell'inizializzazione del component EqpTableComponent) e serve per capire se per la tabella corrente
     * è stato richiesto il multilingua oppure no
     */
    isMultiLanguage: boolean = false;

    // /**
    //  * Proprietà (popolata nell'inizializzazione del component EqpTableComponent) e serve per passare a questo servizio
    //  * l'istanza dell'EnumHelper in cui sono contenute le funzioni utilità per la gestione del multilingua sugli enumeratori
    //  */
    // enumHelper: EnumHelper = null;

    constructor(private enumHelper: EnumHelper) {

    }

    /**
     * Restituisce il valore booleano corretto in base all'elemento bindato alla riga e alla configurazione della colonna
     * @param element Elemento bindato alla riga della tabella
     * @param column Configurazione della colonna
     * @param columnValue Valore contenuto nella colonna
     * @returns 
     */
    getBooleanValue(element, column, columnValue = null) {

        let currentColumnValue = null;

        if (columnValue == null)
            currentColumnValue = this.getValue(element, column);
        else
            currentColumnValue = columnValue;

        if (currentColumnValue != null && currentColumnValue != undefined)
            return column.booleanValues[currentColumnValue];
        else
            return null;
    }

    /**
     * Funzione che si occupa di restituire l'etichetta corretta (eventualmente tradotta) da associare al valore dell'enum
     * bindato all'oggetto contenuto nella riga.
     * La funzione utilizza l'enumHelper in cui è contenuta la logica per il recupero dell'etichetta e dell'eventuale traduzione
     * @param inputEnum Type dell'enumeratore
     * @param element Elemento bindato alla riga della tabella
     * @param col Configurazione della colonna di tipo ENUM
     * @param columnValue Valore della colonna (opzionale)
     * @returns Restituisce l'etichetta (eventualmente tradotta) da associare al valore dell'enum passato
     */
    getEnumValue(inputEnum, element, col, columnValue = null) {
        let currentColumnValue = null;

        if (columnValue == null)
            currentColumnValue = this.getValue(element, col);
        else
            currentColumnValue = columnValue;

        if (currentColumnValue != null && currentColumnValue != undefined && this.enumHelper) {
            return this.enumHelper.getEnumLabel(inputEnum, currentColumnValue, this.isMultiLanguage, col.multilanguagePrefixKey);
        }
        else
            return null;
    }

    /**
     * Funzione che si occupa di restituire il valore booleano corretto da bindare alla checkbox contenuta nella colonna
     * @param element Elemento bindato alla riga della tabella
     * @param column Configurazione della colonna
     * @returns 
     */
    getCheckboxValue(element, column) {
        let currentColumnValue = this.getValue(element, column);
        if (currentColumnValue != null && currentColumnValue != undefined)
            return currentColumnValue;
        else
            return null;
    }

    /**
     * Funzione che si occupa di restituire l'url da usare come hyperlink per le colonne di questo tipo.
     * Se il nodo hyperlinUrl della colonna contiene un valore statico allora restituisce quel valore altrimenti se è una funzione la invoca
     * passando come input l'elemento bindato alla riga
     * @param col Configurazione della colonna
     * @param element Elemento bindato alla riga
     * @returns Restituisce il valore da usare come URL per la colonna di tipo Hypwerlink
     */
    getHyperlinkUrlValue(col, element) {
        if (!col.hyperlink)
            return;

        if (col.hyperlink.hyperlinkUrl) {
            if (typeof (col.hyperlink.hyperlinkUrl) == "string") {
                return col.hyperlink.hyperlinkUrl;
            } else {
                return col.hyperlink.hyperlinkUrl(element);
            }
        }

    }

    /**
     * Funzione che si occupa di restituire il testo da mostrare in una cella di tipo Hyperlink.
     * Se il nodo hyperlinkText della colonna contiene un valore statico allora restituisce quel valore altrimenti se è una funzione la invoca
     * passando come input l'elemento bindato alla riga
     * @param col Configurazione della colonna
     * @param element Elemento bindato alla riga
     * @returns Restituisce il valore da usare come testo per la colonna di tipo Hypwerlink
     */
    getHyperlinkTextValue(col, element) {
        if (!col.hyperlink)
            return;

        //Aggiorno la proprietà value così da non dover cambiare il metodo getValue
        col.value = col.hyperlink.hyperlinkText;

        let currentColumnValue = this.getValue(element, col);
        if (currentColumnValue != null && currentColumnValue != undefined)
            return currentColumnValue;
        else
            return col.value;
    }

    /**
     * Funzione che si occupa di restituire l'icona da usare per le action dei pulsanti della tabella.
     * Se il nodo icon della action contiene un valore statico allora restituisce quel valore altrimenti se è una funzione la invoca
     * passando come input l'elemento bindato alla riga
     * @param col Configurazione della colonna
     * @param element Elemento bindato alla riga
     * @returns Restituisce il valore da usare come icona del pulsante
     */
    getIconValue(action, element) {
        if (!action.icon)
            return;

        if (typeof (action.icon) == "string") {
            return action.icon;
        } else {
            return action.icon(element);
        }
    }

    /**
     * Funzione che si occupa di restituire il valore generico da mostrare nella cella della tabella.
     * Se la cella contiene un valore semplice allora lo restituisce direttamente altrimenti se contiene oggetti complessi o funzioni 
     * allora li ispeziona per ricavare il valore da visualizzare
     * @param element Elemento bindato alla riga
     * @param col Configurazione della colonna
     * @returns Restituisce il valore da mostrare nella cella della eqp-table
     */
    getValue(element, col) {
        if (col.value && typeof (col.value) == "string" && (col.value.indexOf(',') == null || col.value.indexOf(',') == -1)) {
            return col.value.split('.').reduce(this.getRealValue, element);
        }
        else if (col.value && typeof (col.value) == "string" && (col.value.indexOf(',') != null && col.value.indexOf(',') != -1)) {
            return col.value.split('.').reduce(this.getConcatValue, element);
        }
        else if (col.value && typeof (col.value) == "function") {
            return col.value(element);
        }
        else if (typeof (element) == "string") {
            return element;
        }
        else {
            return element[col.key];
        }
    }


    /**
     * TODO
     * @param initialValue 
     * @param currentValue 
     * @returns 
     */
    private getRealValue(initialValue, currentValue) {
        return initialValue != null && initialValue != undefined ? initialValue[currentValue] : null;
    }

    /**
     * TODO
     * @param initialValue 
     * @param currentValue 
     * @returns 
     */
    private getConcatValue(initialValue, currentValue) {
        let retrievedList: Array<string> = currentValue.split(",");
        let concatenatedString: string;

        retrievedList.forEach(element => {
            let value = initialValue[element];
            concatenatedString = concatenatedString == undefined ? value : (concatenatedString + " " + value);
        });

        return concatenatedString;
    }

    /**
    * Funzione che si occupa di restituire il valore di tipo "Date" corretto da bindare alla cella della colonna
    * @param element Elemento bindato alla riga della tabella
    * @param column Configurazione della colonna
    * @returns 
    */
    getDateValue(element, column) {
        let currentColumnValue = this.getValue(element, column);
        if (currentColumnValue != null && currentColumnValue != undefined && this.isDateValid(currentColumnValue))
            return currentColumnValue;
        else
            return null;
    }

    private isDateValid(value: any): boolean {
        const date = new Date(value);
        return !isNaN(date.getTime());
    }


}

