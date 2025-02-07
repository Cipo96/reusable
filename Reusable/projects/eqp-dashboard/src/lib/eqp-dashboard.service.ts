import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { RadarIndicator, WidgetTypeEnum } from '../public-api';

@Injectable({
  providedIn: 'root'
})
export class EqpDashboardService {

  private static selectedLocale: string = "it-IT";

  constructor() { }

  /**
   * Metodo per settare il locale all'interno di tutti i chart della dashboard
   */
  setLocale(locale: string) {
    if (!locale)
      return;

    EqpDashboardService.selectedLocale = locale;

  }

  getLocale() {
    return EqpDashboardService.selectedLocale;
  }

  /**
   * Metodo per la formattazione del tooltip dei chart in modo da formattare i numeri nel modo desiderato aggiungendo anche lo stile currency
   * @param params Parametri passati dal chart per la formattazione
   * @param currency Stringa che determina il tipo di currency da utilizzare
   * @param widgetType Enum che permette di formattare il tooltip in modo specifico per ogni chart
   * @param indicators Indicatori presenti all'interno del radarChart
   * @returns
   */
  public static formatTooltip(params, currency, widgetType : WidgetTypeEnum, indicators? : RadarIndicator[]){
    let html = '';
    if(Array.isArray(params)){
      //I chart bar e line sono gli unici con i valori sull'asse per cui riprendo da quelli il nome
      if(widgetType == WidgetTypeEnum.BARS_CHART || widgetType == WidgetTypeEnum.LINE_CHART)
        html += `<div style="font-size:14px;color: #666; font-weight: 400; line-height:1;">${params[0].axisValue}</div>`

      params.forEach(v => {
        html += EqpDashboardService.createHTMLTooltip(v, currency, widgetType, indicators);
        })
    }
    else {
      if(widgetType == WidgetTypeEnum.BARS_CHART || widgetType == WidgetTypeEnum.LINE_CHART)
        html += `<div style="font-size:14px;color: #666; font-weight: 400; line-height:1;">${params.axisValue}</div>`

      html += EqpDashboardService.createHTMLTooltip(params, currency, widgetType, indicators);
    }

    return html
  }

  /**
   * Metodo privato che si occupa della vera e propria formattazione del tooltip attraverso stringhe di html
   * @returns
   */
  private static createHTMLTooltip(param, currency, widgetType : WidgetTypeEnum, indicators? : RadarIndicator[]){
    let html = '';
    let value;
    let name;

    switch(widgetType){

      case WidgetTypeEnum.PIE_CHART: {
        if(currency != null){
          try{
            value = param.value.toLocaleString(EqpDashboardService.selectedLocale, {style: 'currency', currency: currency, minimumFractionDigits: 2})
          }catch(e){
            throw new Error("ERROR: invalid local instance");
          }
        }
        else{
          try{
            value = param.value.toLocaleString(EqpDashboardService.selectedLocale, {minimumFractionDigits: 2})
          }catch(e){
            throw new Error("ERROR: invalid local instance");
          }
        }
        html += `<div style="font-size:14px;color: #666; font-weight: 400; line-height:1;">${param.seriesName}</div>`
        html += `<div style="margin: 0px 0 0;line-height: 1;" class="mt-2">
        <span style="display:inline-block; margin-right:4px; border-radius:10px; width: 10px; height:10px; background-color: ${param.color}"></span>
        <span style="font-size: 14px;font-weight:400;margin-left:2px;">${param.name}</span>
        <span style="float:right; margin-left:20px; font-size:14px;color: #666; font-weight:900">${value}</span>
        </div>`;
        break;
      }

      case WidgetTypeEnum.RADAR_CHART: {
        html += `<div style="font-size:14px;color: #666; font-weight: 400; line-height:1;">${param.seriesName}</div>`

        //Caso in cui param.value è costituito da un array di valori
        //Viene fatto un forEach di tutti i valori e popolato il tooltip con la coppia nome(indicatore) - valore
        if(Array.isArray(param.value)){
          let i = 0;
          param.value.forEach(v => {
            if(currency != null){
              try{
                value = v.toLocaleString(EqpDashboardService.selectedLocale, {style: 'currency', currency: currency, minimumFractionDigits: 2})
              }catch(e){
                throw new Error("ERROR: invalid local instance");
              }
            }
            else{
              try{
                value = v.toLocaleString(EqpDashboardService.selectedLocale, {minimumFractionDigits: 2})
              }catch(e){
                throw new Error("ERROR: invalid local instance");
              }
            }

            //Nel caso di widgetType RADAR, bisogna utilizzare gli indicatori passati in fase di costruzione del chart perchè non possono essere recuperati da param
            //La variabile name è popolata da questi indicatori, altrimenti da param.name che solitamente corrisponde al nome della serie
            if(widgetType == WidgetTypeEnum.RADAR_CHART)
              name = indicators.length > 0 && indicators[0].indicator != null && indicators[0].indicator.length > 0 && indicators[0].indicator.length > i && indicators[0].indicator[i] != null ? indicators[0].indicator[i].text : param.name;

            i++;

          html += `<div style="margin: 0px 0 0;line-height: 1;" class="mt-2">
            <span style="display:inline-block; margin-right:4px; border-radius:10px; width: 10px; height:10px; background-color: ${param.color}"></span>
            <span style="font-size: 14px;font-weight:400;margin-left:2px;">${name}</span>
            <span style="float:right; margin-left:20px; font-size:14px;color: #666; font-weight:900">${value}</span>
          </div>`;
          })
        }

        break;
      }

      case WidgetTypeEnum.BARS_CHART:
      case WidgetTypeEnum.LINE_CHART: {

        if(currency != null){
          try{
            value = param.value.toLocaleString(EqpDashboardService.selectedLocale, {style: 'currency', currency: currency, minimumFractionDigits: 2})
          }catch(e){
            throw new Error("ERROR: invalid local instance");
          }
        }
        else{
          try{
            value = param.value.toLocaleString(EqpDashboardService.selectedLocale, {minimumFractionDigits: 2})
          }catch(e){
            throw new Error("ERROR: invalid local instance");
          }
        }

        name = param.seriesName;

        html += `<div style="margin: 0px 0 0;line-height: 1;" class="mt-2">
          <span style="display:inline-block; margin-right:4px; border-radius:10px; width: 10px; height:10px; background-color: ${param.color}"></span>
          <span style="font-size: 14px;font-weight:400;margin-left:2px;">${name}</span>
          <span style="float:right; margin-left:20px; font-size:14px;color: #666; font-weight:900">${value}</span>
        </div>`;

        break;
      }

    }

    return html
  }

  /**
   * Metodo per la formattazione dei numeri utilizzando le notazioni per i diversi ordini di numeri (k per le migliaia, M per i milioni,...)
   */
  public static nFormatter(num, digits) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function(item) {
      return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  }

  /**
   * Metodo per la formattazione dei numeri in base al locale e alla currency passate
   */
  public static formatNumbers(data, currency){
        data = parseFloat(data);

        if(currency != null){
          try{
            return data.toLocaleString(EqpDashboardService.selectedLocale, {style: 'currency', currency: currency, minimumFractionDigits: 2});
          }catch(e){
            throw new Error("ERROR invalid local instance")
          }
        }
        else{
          try{
            return data.toLocaleString(EqpDashboardService.selectedLocale, {minimumFractionDigits: 2});
          }catch(e){
            throw new Error("ERROR invalid local instance")
          }
        }
  }
}

export enum CurrencyEnum {
  EUR = 'EUR',
  USD = 'USD'
}
