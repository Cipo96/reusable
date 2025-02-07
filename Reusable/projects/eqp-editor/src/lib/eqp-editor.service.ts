import { IPlaceholderDTO } from './models/document.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class EqpEditorService {

  /**
   * Istanza del translate service, sarà necessario passare in input tutta l'istanza dal progetto dal quale lo si vuole utilizzare
   */
   translateService: TranslateService;

  constructor(private http: HttpClient) { }

  getDocumentPlaceholders(url: string): Promise<Array<IPlaceholderDTO>> {
    return this.http.get<Array<IPlaceholderDTO>>(url).toPromise()
  }

   /**
   * Data in input tutta l'istanza del servizio, viene utilizzata all'interno del componente
   * @param translateServiceInput
   */
    loadTranslateService(translateServiceInput: TranslateService) {
      this.translateService = translateServiceInput;
    }
  
}
