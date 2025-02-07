import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComplexLinqPredicateDTO, LinqPredicateDTO } from './models/linqPredicate.model';
import { LookupConfigDTO, LookupCustomConfig, LookupDTO } from './models/lookup.model';

@Injectable({
  providedIn: 'root'
})
export class EqpLookupService {

  /**
   * Variabile di appoggio che restituirà le informazioni alla chiusura della lookup in aggiunta (es: ID utente appena salvato)
   */
  lookupAddingComplete: EventEmitter<any> = new EventEmitter<any>();

  constructor(private http: HttpClient) {
  }

  /**
  * Per la dinamicità delle proprietà, per utilizzare l'ordinamento di un'array data una specifica proprietà seguire questo esempio:
  * EqpLookupService.dynamicSort("NameProperty"));
  */
  static dynamicSort(property: any) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a: any, b: any) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

    /**
   * Data una stringa con il nome dell'entità, restituisce un array di LookupDTO dell'entità precedentemente passata
   * @param entityType Nome dell'entità
   */
    GetLookupEntities(entityType: string, filters: Array<LinqPredicateDTO> | null = null, complexFilters: Array<ComplexLinqPredicateDTO> | null = null, customConfig: LookupCustomConfig | null = null, fullUrlHttpCall: string): Observable<Array<LookupDTO>> {
      let config: LookupConfigDTO = new LookupConfigDTO();
      config.TypeName = entityType;
      config.Filters = filters;
      config.CustomConfig = customConfig;
      config.ComplexFilters = complexFilters;
      return this.http.post<Array<LookupDTO>>(fullUrlHttpCall, config);
    }
}
