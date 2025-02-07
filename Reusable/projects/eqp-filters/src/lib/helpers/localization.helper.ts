import { registerLocaleData } from '@angular/common';
import { Injectable } from '@angular/core';
import localeIT from '@angular/common/locales/it';
import localeEN from '@angular/common/locales/en';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

  private selectedLanguage: string = "it-IT";
  private currentCultureSelected: string;
  private currentLocaleSelected: string;

  constructor() { }

  setLanguage(languageType: string) {
    if (!languageType)
      return;

    this.selectedLanguage = languageType;
  }

  getLanguage() {
    return this.selectedLanguage;
  }

  getDatePipe() {
    return this.currentCultureSelected;
  }

  getCurrentLocale() {
    return this.currentLocaleSelected;
  }

  initPossibileLanguages() {
    if (this.getLanguage() == "it-IT") {
      registerLocaleData(localeIT);
      this.currentCultureSelected = "it-IT";
      this.currentLocaleSelected = "it";
    }
    else if (this.getLanguage() == "en-US") {
      registerLocaleData(localeEN);
      this.currentCultureSelected = "en-US";
      this.currentLocaleSelected = "en";
    }
  }

}
