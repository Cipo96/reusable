import { Injectable, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})

export class TranslateSelectHelper {

  /**
   * Emitter creato per gestire la sincronia del multilanguage
   */
  eventEmitter: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Istanza del translate service, sarà necessario passare in input tutta l'istanza dal progetto dal quale lo si vuole utilizzare
   */
  translateService: TranslateService;

  constructor() { }

  /**
   * @param key data una stringa presente nel json delle traduzioni, restituisco il suo valore tradotto secondo la lingua settata in precedenza
   * @param multilanguagePrefixKey stringa dove sarà contenuto il prefisso della key, NB. è necessario inserire tutto il prefisso come scritto nel json(compresi i separatori)
   */
  returnTranslateValue(key: string, multilanguagePrefixKey: string) {
    let tempPrefixKey = (multilanguagePrefixKey != null && multilanguagePrefixKey != undefined) ? multilanguagePrefixKey + key : key;
    return this.translateService.instant(tempPrefixKey);
  }

  /**
   * Data in input tutta l'istanza del servizio, viene utilizzata all'interno del componente
   * @param translateServiceInput
   */
  loadTranslateService(translateServiceInput: TranslateService) {
    this.translateService = translateServiceInput;
    this.eventEmitter.emit();
  }

}
