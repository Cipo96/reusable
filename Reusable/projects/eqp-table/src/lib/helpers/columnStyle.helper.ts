import { Injectable } from '@angular/core';
import { ColumnAccessibilityHelper } from './columnAccessibility.helper';

/**
 * Servizio di helper che espone funzioni statiche per la gestione dello stile dell'eqp-table
 */
@Injectable()
export class ColumnStyleHelper {

    constructor(private columnAccessibilityHelper: ColumnAccessibilityHelper) {

    }


    /**
     * A partire dalla configurazione della colonna ricevuta in input restituisce il nodo containerStyle associato.
     * Se tale nodo assume un valore statico allora restituisce quel valore altrimenti, se è una funzione allora la invoca passando come input 
     * l'elemento bindato alla riga (ricevuto nel secondo parametro della firma).
     * Infine, dopo aver ottenuto il nodo relativo allo stile si occupa di settare il colore della riga se quest'ultima risulta disabilitata
     * @param col Configurazione della colonna per cui recuperare lo stile
     * @param element Elemento bindato alla riga della tabella
     * @returns Restituisce lo stile da applicare alla colonna
     */
    getNgStyle(col, element) {

        var styleObject = {};
        if (typeof (col.containerStyle) == "object") {
            styleObject = col.containerStyle;
        } else if (col.containerStyle instanceof Function) {
            styleObject = col.containerStyle(element);
        }

        if (styleObject == null)
            styleObject = {};

        if (!this.columnAccessibilityHelper.isRowDisabled(element) == false && styleObject['color'] == null)
            styleObject['color'] = this.columnAccessibilityHelper.isRowDisabled(element) ? this.columnAccessibilityHelper.disableRowColor : 'inherit';

        if (this.columnAccessibilityHelper.isRowDisabled(element) == true) {
            styleObject['color'] = this.columnAccessibilityHelper.disableRowColor;
        } else if (styleObject['color'] == null) {
            styleObject['color'] = 'inherit'
        }
        return styleObject;
    }
}

