import { Injectable } from "@angular/core";
import { TypeColumn } from "@eqproject/eqp-common";

/**
 * Servizio di helper contenente le funzioni di utilità per la gestione dell'ordinamento
 */
@Injectable()
export class SortingHelper {

    /**
     * Funzione custom per il sort
     * @param tableColumns AAA
     * @param obj Elemento bindato alla riga
     * @param path Nome proprietà
     * @returns String | Number
    */
    getSortOrder(tableColumns, row, path) {

        //Trovo la colonna che corrisponde al path nel key o nel value
        let foundedColumn = tableColumns.find(x => x.key == path || x.value == path);

        if (foundedColumn.value != null) {

            //Se un template ha la funzione di ricerca, filtro per quella funzione altrimenti restituisco il valore dalla row
            if (foundedColumn.type == TypeColumn.ExternalTemplate)
                if (foundedColumn.externalTemplateSearchFunction != null)
                    return foundedColumn.externalTemplateSearchFunction(row);
                else
                    return row[path];

            // Se è una funzione, chiamala con la riga come argomento e usa il suo risultato per il sorting
            if (typeof foundedColumn.value === 'function') {
                return foundedColumn.value(row);

                //Se è una stringa concatena (es: Nome, Cognome), splitto la prima parola e cerco per quella
            } else if (foundedColumn.value.toString().includes(",")) {
                let stringArray = "";

                foundedColumn.value.toString().split(',').forEach(propertyPath => {
                    stringArray += row[propertyPath];
                });

                return stringArray;

            } else {
                //Faccio il reduce di una proprietà complessa (es: object.Nome), tipico caso dell'utilizzo del tipo value
                return foundedColumn.value.toString().split('.').reduce((o, p) => o && o[p], row)
            }
        } else {
            return row[path];
        }

    }
}
