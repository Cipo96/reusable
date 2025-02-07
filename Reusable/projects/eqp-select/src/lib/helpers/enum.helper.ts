import { Injectable } from "@angular/core";
import { TranslateSelectHelper } from "./translateSelect.helper";

@Injectable({
  providedIn: "root"
})

/**
 * N.B. Ricordarsi in caso di modifica di questo helper, di riportare la modifica in tutti gli altri progetti dove è stato usato
 * in quanto per la build della library è necessario che il file venga ripetuto in ogni progetto e non può essere istanziato
 * globalmente
 */
export class EnumHelper {
  //Contiene i singoli valori key value dell'enumeratore separati
  indexEnumerator;

  //Definisco l'array che dovrà essere filtrato a seconda di indexEnumerator e poi successivamente iterato
  arrayToCompare;

  //Array dove sarà ricostruito l'enumeratore e dopo essere clonato sarà restituito per ricavare la Label interessata
  arrayIterated = [];

  constructor(private translateSelectHelper: TranslateSelectHelper) {}

  getEnumArray<T extends { [name: string]: any }>(
    enumObject: T,
    isMultilanguage?: boolean,
    multilanguagePrefixKey?: string
  ) {
    const arrayKeyProperty = "ID";
    const arrayValueProperty = "Label";

    this.indexEnumerator = Object.keys(enumObject);
    this.arrayToCompare = this.indexEnumerator.filter((x) => !isNaN(x));
    this.arrayToCompare.forEach((index) => {
      // let object = { ID: parseInt(index), Label: this.translateSelectHelper.translateService != null && isMultilanguage == true ? this.translateSelectHelper.returnTranslateValue(enumObject[index], multilanguagePrefixKey) : enumObject[index] }
      const object = {};
      object[arrayKeyProperty] = parseInt(index);
      object[arrayValueProperty] =
        this.translateSelectHelper.translateService != null && isMultilanguage == true
          ? this.translateSelectHelper.returnTranslateValue(enumObject[index], multilanguagePrefixKey)
          : enumObject[index];
      this.arrayIterated.push(object);
    });

    //Dovendo svuotare l'arrayIterated creo un clone da passare come oggetto finale
    let clonedArray = JSON.parse(JSON.stringify(this.arrayIterated));

    this.arrayIterated = [];

    return clonedArray;
  }

  // Dato il tipo di enumeratore e il valore, restituisco l'etichetta
  getEnumLabel<T extends { [name: string]: any }>(
    enumObject: T,
    value?: number,
    isMultilanguage?: boolean,
    multilanguagePrefixKey?: string
  ) {
    let enumArray = this.getEnumArray(enumObject, isMultilanguage, multilanguagePrefixKey);
    if (value != null && value != undefined) return enumArray.find((x) => x.key == value).value;
    else return enumArray;
  }
}
