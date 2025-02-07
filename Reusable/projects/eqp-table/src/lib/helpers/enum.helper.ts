import { TranslateTableHelper } from './translateTable.helper';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

/**
 * N.B. Ricordarsi in caso di modifica di questo helper, di riportare la modifica in tutti gli altri progetti dove è stato usato
 * in quanto per la build della library è necessario che il file venga ripetuto in ogni progetto e non può essere istanziato
 * globalmente
 */
export class EnumHelper {

  /**
   * Contiene i singoli valori key value dell'enumeratore separati 
   */
  indexEnumerator;

  /**
   * Definisco l'array che dovrà essere filtrato a seconda di indexEnumerator e poi successivamente iterato
   */
  arrayToCompare;

  /**
   * Array dove sarà ricostruito l'enumeratore e dopo essere clonato sarà restituito per ricavare la Label interessata 
   */
  arrayIterated = [];

  constructor(private translateTableHelper: TranslateTableHelper) { }

  /**
   * Funzione che si occupa di restituire un array di oggetti con chiave-valore (key-value) ottenuto dalla mappatura dell'enum richiesto.
   * La funzione, dato il tipo dell'enumeratore, ricostruisce un array con tanti oggetti quanti sono i nodi dell'enum; ciascun oggetto
   * dell'array avrà la proprietà 'key' uguale al valore dell'enum mentre la proprietà 'value' con l'etichetta dell'enum (eventualmente tradotta)
   * @param enumObject 
   * @param isMultilanguage 
   * @param multilanguagePrefixKey 
   * @returns 
   */
  getEnumArray<T extends { [name: string]: any }>(enumObject: T, isMultilanguage: boolean, multilanguagePrefixKey: string) {
    this.indexEnumerator = Object.keys(enumObject);
    this.arrayToCompare = this.indexEnumerator.filter(x => !isNaN(x));

    this.arrayToCompare.forEach(index => {
      let object = { key: parseInt(index), value: this.translateTableHelper.translateService != null && isMultilanguage == true ? this.translateTableHelper.returnTranslateValue(enumObject[index], multilanguagePrefixKey) : enumObject[index] }
      this.arrayIterated.push(object);
    });

    //Dovendo svuotare l'arrayIterated creo un clone da passare come oggetto finale
    let clonedArray = JSON.parse(JSON.stringify(this.arrayIterated));

    this.arrayIterated = [];

    return clonedArray;
  }

  /**
   * Funzione che riceve in input il tipo dell'enumeratore e il valore selezionato e si occupa di restituisce la relativa etichetta associata.
   * Se per l'enumeratore è gestito il multilingua allora si occupa di restituisce l'etichetta opportunamente tradotta (questa funzionalità è utilizzabile solo se
   * la tabella ha isMultiLanguage = TRUE e solo se è stato passato il TranslateService opportunamente configurato)
   * @param enumObject Type dell'enumeratore
   * @param value Valore impostato per l'enumeratore
   * @param isMultilanguage TRUE se per l'enumeratore richiesto si sta gestendo il multilingua
   * @param multilanguagePrefixKey Eventuale prefisso per la ricerca del valore dell'enum all'interno del dizionario di traduzione
   * @returns Restituisce una stringa corrispondente all'etichetta (eventualmente tradotta) del valore dell'enum passato in input
   */
  getEnumLabel<T extends { [name: string]: any }>(enumObject: T, value?: number, isMultilanguage?: boolean, multilanguagePrefixKey?: string) {
    let enumArray = this.getEnumArray(enumObject, isMultilanguage, multilanguagePrefixKey);
    if (value != null && value != undefined)
      return enumArray.filter(x => x.key == value).length > 0 ? enumArray.find(x => x.key == value).value : null;
    else
      return null;
  }

}

