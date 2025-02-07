import { Injectable } from "@angular/core";

/**
 * Servizio di helper che espone funzioni statiche per il controllo sull'accessibilità delle colonne.
 * Espone quindi funzioni per: gestione tooltip, verifica stato disabilitazione pulsanti, verifica stato dell'attributo hidden
 * dei pulsanti, verifica stato disabilitazione di una riga
 */
@Injectable()
export class ColumnAccessibilityHelper {

  /**
   * Permette di disabilitare visivamente la riga. Accetta una stringa contentente il nome di una proprietà che deve essere contenuta nella tabella
   * e che DEVE restituire valori booleani, altrimenti accetta una Function con lo stesso funzionamento
   * oppure un valore booelano
   */
  disableRow: string | Function | boolean = null;

  /**
   * Valore di default da usare come colore per l'applicazione dello stile 'disabled'
   */
  disableRowColor: string = null;

  /**
   * Restituisce il testo da mostrare come tooltip per la cella della colonna richiesta.
   * Se per la configurazione della colonna il nodo tooltip.tooltipText riporta un valore statico allora restituisce quel valore,
   * altrimenti se a tale nodo è legata una funzione allora richiama tale funzione passando come parametro l'elemento bindato alla riga
   * @param col Configurazione colonna per cui mostrare il tooltip
   * @param element Elemento bindato alla riga per cui recuperare il tooltip
   * @returns Restituisce il testo da mostrare come tooltip
   */
  getTooltipInfo(col, element) {
    if (!col.tooltip)
      return;

    if (typeof (col.tooltip.tooltipText) == "string") {
      return col.tooltip.tooltipText;
    } else {
      return col.tooltip.tooltipText(element);
    }
  }

  /**
   * Restituisce il valore da attribuire allo stato disabled del pulsante della tabella.
   * Se per la configurazione dell'action passata come parametro il nodo disabled riporta un valore statico allora restituisce quel valore, 
   * altrimenti se a tale nodo è legata una funzione allora richiama tale funzione passando come parametro l'elemento bindato alla riga
  */
  getDisableInfo(action, element) {
    if (!action.disabled)
      return;

    if (typeof (action.disabled) == "boolean") {
      return action.disabled;
    } else {
      return action.disabled(element);
    }
  }

  /**
  * Restituisce il valore da attribuire allo stato hidden del pulsante della tabella.
  * Se per la configurazione dell'action passata come parametro il nodo hidden riporta un valore statico allora restituisce quel valore,
  * altrimenti se a tale nodo è legata una funzione allora richiama tale funzione passando come parametro l'elemento bindato alla riga
  */
  getHiddenInfo(action, element) {
    if (!action.hidden)
      return;

    if (typeof (action.hidden) == "boolean") {
      return action.hidden;
    } else {
      return action.hidden(element);
    }
  }

  /**
  * Restituisce il valore da attribuire allo stato disabled della riga della tabella a cui è bindato l'elemento ricevuto in input.
  * Se l'input disableRow è una stringa contenente il nome della proprietà allora restituisce il valore della proprietà ricercata nell'elemento di input, 
  * se invece disableRow è un booleano allora restituisce tale valore, infine se disableRow è una funzione passata dall'esterno allora invoca tale funzione
  * passando come input l'elemento bindato alla riga
  * @param element Elemento bindato alla riga
  * @returns Restituisce il valore da attribuire al tag 'disabled' della riga della tabella
  */
  isRowDisabled(element) {
    if (!this.disableRow)
      return;

    if (typeof (this.disableRow) == "string") {
      let currentValue = this.disableRow;
      return element[currentValue];
    }

    if (typeof (this.disableRow) == "boolean") {
      let currentValue = this.disableRow;
      return currentValue;
    }

    //se non è string ed è definito sarà sicuramente una funzione
    else if (this.disableRow != null) {
      return this.disableRow(element);
    }
  }
}

