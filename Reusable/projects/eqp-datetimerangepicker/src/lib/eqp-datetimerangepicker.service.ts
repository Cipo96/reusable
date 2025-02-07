import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: "root"
})
export class EqpDatetimerangepickerService {
  private parentInputLanguage: string;

  private parentInputCustomRangePreset: Array<{
    label: string;
    orderPosition?: number;
    getRangeFunction?: () => [Date, Date];
  }>;

  constructor() {}

  setField(
    CustomRangePreset: Array<{
      label: string;
      orderPosition?: number;
      getRangeFunction?: () => [Date, Date];
    }>,
    language: string
  ) {
    this.parentInputCustomRangePreset = CustomRangePreset;
    this.parentInputLanguage = language;
  }

  getLanguage() {
    return this.parentInputLanguage;
  }

  getPreset() {
    return this.parentInputCustomRangePreset;
  }

  /**
   * Istanza del translate service, sarà necessario passare in input tutta l'istanza dal progetto dal quale lo si vuole utilizzare
   */
  translateService: TranslateService;

  /**
   * Data in input tutta l'istanza del servizio, viene utilizzata all'interno del componente
   * @param translateServiceInput
   */
  loadTranslateService(translateServiceInput: any) {
    this.translateService = translateServiceInput;
  }
}
