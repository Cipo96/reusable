import { Injectable } from '@angular/core';
import { ConfigColumn } from '@eqproject/eqp-common';

/**
 * Classe di helper che espone funzioni statiche per la gestione dei pipe
 */
@Injectable()
export class ColumnPipeHelper {

  /**
   * Restituisce il pipe da utilizzare per il tipo currency.
   * Se il nodo currencyPipeCode della colonna assume un valore statico allora viene restituito quel valore altrimenti
   * se il nodo risulta essere una funzione allora viene invocata passando come input l'elemento bindato alla riga della tabella
   * @param column Configurazione della colonna per cui ottenere il pipe
   * @param element Elemento bindato alla riga
   * @returns Restituisce il pipe currency da applicare
   */
  getCurrencyPipe(column: ConfigColumn, element) {
    if (column.currencyPipeCode && typeof (column.currencyPipeCode) == "function") {
      return column.currencyPipeCode(element);
    }
    else
      return column.currencyPipeCode;
  }
}

