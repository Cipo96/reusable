import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter, ViewChild, TemplateRef, ViewChildren, AfterViewInit, Type } from "@angular/core";
import { WidgetConfig, WidgetTypeEnum, WidgetSizeEnum, EndPointDataParamType, RequestMethodEnum, EndPointDataParams } from "./models/widget-config.model";
import { HttpClient } from "@angular/common/http";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DashboardHelperService, WidgetLoadingStatus } from "./helper/dashboardHelper.service";
import { RadarChartOption } from "./models/radarChartOption.model";
import { LineChartOption } from "./models/lineChartOption.model";
import { BarChartOption } from "./models/barChartOption.model";
import { GaugeChartOption } from "./models/gaugeChartOption.model";
import { PieChartOption } from "./models/pieChartOption.model";
import { NgxMasonryComponent, NgxMasonryOptions } from 'ngx-masonry';
import { CurrencyEnum, EqpDashboardService } from "./eqp-dashboard.service";
import { PickerModeEnum } from '@eqproject/eqp-datetimerangepicker';
import { COMPONENT_MAPPER } from "./helper/componentMapper.service";
// import { DynamicLoaderDirectiveData } from "./dynamicRoom/dynamic.directive";
// import { COMPONENT_MAPPER } from "./eqp-dashboard.module";

const currentWidgetSet: string = "EQP_DASHBOARD_CURRENT_WIDGETS_" + window.location.origin;

@Component({
  selector: "eqp-dashboard",
  templateUrl: "./eqp-dashboard.component.html",
  styleUrls: ["./eqp-dashboard.component.scss"],
})
export class EqpDashboardComponent implements OnInit {

  @Input("configs") configs: WidgetConfig[];
  @Input("hideTooltipLabel") hideTooltipLabel: string = "Hide";
  @Input("showTooltipLabel") showTooltipLabel: string = "Show";
  @Input("resizeTooltipLabel") resizeTooltipLabel: string = "Resize widget";
  @Input("resizeDisabledTooltipLabel") resizeDisabledTooltipLabel: string = "Widget not resizable for this size";
  @Input("showAllHiddenItemsLabel") showAllHiddenItemsLabel: string = "Show all hidden elements";
  @Input("showListHiddenItemsLabel") showListHiddenItemsLabel: string = "Show hidden elements list";
  @Input("settingsLabel") settingsLabel: string = "Settings";
  @Input("smallLabel") smallLabel: string = "Small";
  @Input("mediumLabel") mediumLabel: string = "Medium";
  @Input("LargeLabel") LargeLabel: string = "Large";
  @Input("RechargeLabel") RechargeLabel: string = "Reload";
  @Input("saveConfigs") saveConfigs: boolean = true;
  @Input("showSpinnerLabel") showSpinnerLabel: boolean = true;
  @Input("spinnerLabel") spinnerLabel: string = "Loading...";
  @Input("dashboardSettingsLabel") dashboardSettingsLabel: string = null;
  @Input("hiddenWidgetModalTitle") hiddenWidgetModalTitle: string = "Hidden widget list";
  @Input("searchTooltipLabel") searchTooltipLabel: string = "Search";
  @Input("emptyChartMessage") emptyChartMessage: string = "No data to show for this chart";

  @ViewChild('dialogHiddenElements', { static: false }) dialogHiddenElements: TemplateRef<any>;
  dialogRefHiddenElements: MatDialogRef<TemplateRef<any>>;

  //Evento di output per gestire il widget post ridimensionamento
  @Output() widgetSizeChange: EventEmitter<WidgetConfig> = new EventEmitter<WidgetConfig>();

  errorAlertMsg: string = "The object returned by the call does not match the object requested in the WidgetType parameter";
  fatchingDataerrorMsg: string = "Error during fetching widget data. Please try to call again the endpoint by clicking the reload icon on the top-right of the current card.";

  allCurrentSetItems: WidgetConfig[] = [];

  //variabile booleana che segnala la presenza di proprietà widgetID duplicate
  existDuplicatedProperties: boolean = false;

  //variabile numerica che contiene il numero degli item nascosti
  hiddenItemsLength: number = 0;

  WidgetSizeEnum = WidgetSizeEnum;
  WidgetTypeEnum = WidgetTypeEnum;

  widgetsSpinnerList: Array<string> = new Array<string>();
  widgetsErrorList: Array<string> = new Array<string>();

  allWidgetStatus: Array<WidgetCheckResult> = new Array<WidgetCheckResult>();

  customComponentSelectorMap: Array<WidgetHiddenStatus> = new Array<WidgetHiddenStatus>();

  //Variabile che contiene l'informazione riguardante il tipo del dispositivo utilizzato
  isMobileDevice = false;

  echartInstance: any;



  public paramPropertyType = EndPointDataParamType;
  public pickerModeEnum = PickerModeEnum;
  @ViewChild(NgxMasonryComponent) masonry: NgxMasonryComponent;
  /*Impostazioni per visualizzare i widget senza spazi bianchi in altezza*/
  public myOptions: NgxMasonryOptions = {
    itemSelector: '.grid-item',
    columnWidth: '.grid-sizer',
    percentPosition: true,
    horizontalOrder: true
  };

  updateMasonryLayout: boolean = false;

  constructor(private http: HttpClient, private _cdRef: ChangeDetectorRef, private dialog: MatDialog, private dashboardHelper: DashboardHelperService, private eqpDashboardService: EqpDashboardService) { }

  ngOnInit() {
    this.allWidgetStatus = new Array<WidgetCheckResult>();

    this.isMobileDevice = window.navigator.userAgent.includes('Mobile');
    //Setto a false le proprietà isHidden di tutti i configs che mi arrivano dall'esterno
    this.configs.forEach((e) => {
      e.isHidden = false;

      //Nel caso di dispositivo mobile, le label dell'asse y vengono ruotate di 90° per permettere la visualizzazione dei dati (prima erano tagliati)
      if (this.isMobileDevice == true && e.ChartOptions != null && e.ChartOptions.yAxis != null && e.ChartOptions.yAxis.axisLabel != null)
        e.ChartOptions.yAxis.axisLabel.rotate = 90

      //Gestione dei vari tipi di ridimensionamento dei widget
      if (!e.WidgetSizeTypes || e.WidgetSizeTypes.length == 0) {
        //Se la proprietà è un array vuoto allora va rimessa a null
        e.WidgetSizeTypes == null;
        e.WidgetSizeClass = e.WidgetSizeClass ? e.WidgetSizeClass : WidgetSizeEnum.XS;
      } else {
        //Se la nuova proprietà è definita allora il valore di default di WidgetSizeClass dovrà essere il primo valore presente nell'array
        e.WidgetSizeClass = e.WidgetSizeClass && e.WidgetSizeTypes.includes(e.WidgetSizeClass) ? e.WidgetSizeClass : e.WidgetSizeTypes[0];
      }


      //Nel caso di chart con grandezza XS, per evitare che le label dell'asse y vengano tagliate, si parte con la rotazione di queste di 90°
      if (e.WidgetSizeClass == WidgetSizeEnum.XS && e.ChartOptions != null && e.ChartOptions.yAxis != null && e.ChartOptions.yAxis.axisLabel != null)
        e.ChartOptions.yAxis.axisLabel.rotate = 90;

      if (e.ChartOptions != null && !e.EndPointData && !e.CustomComponentSelector && !e.StatisticWidget && (e.ChartOptions.series == null || e.ChartOptions.series.length == 0))
        this.setWidgetStatus(e.WidgetID, true, null, true);
      else
        this.setWidgetStatus(e.WidgetID, true, null);

      if (e.CustomComponentSelector) {
        let customComponentMap: WidgetHiddenStatus = new WidgetHiddenStatus(e.WidgetID);
        this.customComponentSelectorMap.push(customComponentMap);
      }

    });

    //controllo se tutti i WidgetID degli oggetti contenuti nell'array configs sono univoci. Se non c'è univocità mostro l'errore
    this.existDuplicatedProperties = this.checkAllWidgetID();
    if (this.existDuplicatedProperties) {
      this.fireErrorAlert("ERROR: The WidgetID field of each object must be unique!");
      return;
    }

    //Mi recupero i Set corrente salvato dal local storage
    let currentSetItems: WidgetConfig[] = this.getCurrentSetFromLocalStorage();
    if (currentSetItems != null && currentSetItems != undefined) {
      currentSetItems.forEach(item => {
        if (this.configs.find(c => c.WidgetID == item.WidgetID) != null) {
          var currentConfig = this.configs.find(c => c.WidgetID == item.WidgetID);

          if (currentConfig.WidgetSizeTypes) {
            currentConfig.WidgetSizeClass = currentConfig.WidgetSizeTypes.includes(item.WidgetSizeClass) ? item.WidgetSizeClass : currentConfig.WidgetSizeTypes[0];
          } else {
            currentConfig.WidgetSizeClass = item.WidgetSizeClass;
          }

          currentConfig.isHidden = item.isHidden;
        }
      })
    }

    this.allCurrentSetItems = this.configs;

    this.initConfigsCharts();
    this.saveUserConfig();
    this._cdRef.detectChanges();
    this.hiddenItemsLength = this.allCurrentSetItems.filter((x) => x.isHidden).length;

    if (this.dashboardHelper.checkWidgetLoading) {
      this.dashboardHelper.checkWidgetLoading.subscribe((res: WidgetLoadingStatus) => {

        if (res == null || res == undefined)
          return;

        if (res.IsLoading == true && this.widgetsSpinnerList.find(p => p == res.WidgetID) == null) {
          this.widgetsSpinnerList.push(res.WidgetID);
        }
        else if (res.IsLoading != true && this.widgetsSpinnerList.find(p => p == res.WidgetID) != null) {
          this.widgetsSpinnerList.splice(this.widgetsSpinnerList.indexOf(res.WidgetID), 1);
        }
      });
    }
  }

  ngAfterViewInit() {
    this.configs.forEach((e) => {
      if (e.CustomComponentSelector && e.CustomComponentInputs) {
        e.genericComponent = new DynamicLoaderDirectiveData();
        e.genericComponent.componentInstance = this.getComponent(e.CustomComponentSelector);
        e.genericComponent.inputParams = e.CustomComponentInputs;
      }
    });
  }

  getComponent(key: any) {
    let component = key;
    if (typeof key == "string") {
      component = COMPONENT_MAPPER.get(key);
    }
    return component;
  }

  /**
   * Funzione che controlla l'univocità della proprietà WidgetID in ogni oggetto contenuto in configs
   */
  checkAllWidgetID() {
    var WidgetIDArr = this.configs.map(function (item) {
      return item.WidgetID;
    });
    return WidgetIDArr.some((item, idx) => {
      return WidgetIDArr.indexOf(item) != idx;
    });
  }

  /**
   * Inizializzazione delle charts
   */
  initConfigsCharts() {
    let self = this;
    //Itero configs per impostare i parametri ci chiamata nel caso in cui, tra le configs ci sia un widget che usa l'endpoint
    this.allCurrentSetItems.forEach((config) => {

      //Nel caso di chart con grandezza XS, per evitare che le label dell'asse y vengano tagliate, si parte con la rotazione di queste di 90° (in questo caso lo si fa per i chart che erano salvati nel local storage)
      //perchè potrebbero avere un size diverso da quello di partenza (XS)
      if (this.isMobileDevice == false && config.WidgetSizeClass == WidgetSizeEnum.XS && config.ChartOptions != null && config.ChartOptions.yAxis != null && config.ChartOptions.yAxis.axisLabel != null)
        config.ChartOptions.yAxis.axisLabel.rotate = 90;

      //Per sicurezza si pone il rotate dei chart con grandezza diversa da XS a 0
      if (this.isMobileDevice == false && config.WidgetSizeClass != WidgetSizeEnum.XS && config.ChartOptions != null && config.ChartOptions.yAxis != null && config.ChartOptions.yAxis.axisLabel != null)
        config.ChartOptions.yAxis.axisLabel.rotate = 0;

      //Verifico, in caso di Endpoint o ChartOption presenti, che il type sia definito
      if ((config.EndPointData || config.ChartOptions) && (config.WidgetType == null || config.WidgetType == undefined)) {
        let widgetError = "For the widget " + config.WidgetID + " define the WidgetType";
        this.setWidgetStatus(config.WidgetID, false, widgetError);
        this.fireErrorAlert(widgetError);
        return;
      }
      if (config.EndPointData) {
        this.runEndPointCall(config);
      }
      else if (config.StatisticWidget && config.WidgetType == WidgetTypeEnum.STATISTIC_CHART) {
        this.configureStatisticWidget(config);
      }
      else {
        //per i widget diversi dall'endpoint, chiamo la funzione che mi configura le proprietà dei vari widget
        config.ChartOptions = this.createEChartOptionFromConfig(config.ChartOptions, config.WidgetType, config.Currency, config.WidgetSizeClass);
      }

      this.reloadMasonryLayout();
    });
  }


  /**
  * Configuro tutte le linee di statistiche del widget passato per settare i valori di default qualora non ci fossero
  */
  configureStatisticWidget(config: WidgetConfig) {
    config.StatisticWidget.forEach(itemStat => {
      itemStat.Icon = itemStat.Icon ? itemStat.Icon : null;
      itemStat.IconClass = itemStat.IconClass ? itemStat.IconClass : null;
      itemStat.IsFontAwesomeIcon = itemStat.IsFontAwesomeIcon ? itemStat.IsFontAwesomeIcon : null;
      itemStat.LabelClass = itemStat.LabelClass ? itemStat.LabelClass : null;
      itemStat.Label = itemStat.Label ? itemStat.Label : '';
      itemStat.ProgressBarColor = itemStat.ProgressBarColor ?? "#000000";
      itemStat.MaxValue = itemStat.MaxValue ? itemStat.MaxValue : 0;
      itemStat.Value = itemStat.Value ? itemStat.Value : 0;
      if (itemStat.MaxValue > 0 && itemStat.Value) {
        let perc = (itemStat.Value / itemStat.MaxValue) * 100;
        itemStat.Percentage = itemStat.Value == itemStat.MaxValue ? "100" : perc.toString().substring(0, 2);
      }
    });
  }

  runEndPointCall(config: WidgetConfig) {
    this.widgetsSpinnerList.push(config.WidgetID);

    var self = this;
    setTimeout(() => {
      //Compone l'URL da chiamare
      let url = `${config.EndPointData.Url}`;
      let bodyParams: any = null;

      //#region Composizione parametri da passare all'endpoint

      if (config.EndPointData.Params) {
        //Se la chiamata è in GET e sono stati definiti i parametri allora li aggiunge in query string
        if (config.EndPointData.RequestMethod == RequestMethodEnum.GET) {
          url += "?";
          for (let paramsIndex = 0; paramsIndex < config.EndPointData.Params.length; paramsIndex++) {
            if (paramsIndex != 0) {
              url += "&";
            }
            url += config.EndPointData.Params[paramsIndex].PropertyName + "=" + config.EndPointData.Params[paramsIndex].PropertyValue;
          }
        }
        //Altrimenti crea l'oggetto che verrà passato nel body della request
        else {
          bodyParams = {};
          config.EndPointData.Params.forEach(p => {
            bodyParams[p.PropertyName] = p.PropertyValue;
          })
        }
      }

      //#endregion

      self.http.request(config.EndPointData.RequestMethod, url, {
        headers: config.EndPointData.Token ? { Authorization: config.EndPointData.Token } : null,
        body: bodyParams != null && config.EndPointData.RequestMethod != RequestMethodEnum.GET ? bodyParams : null,
      })
        .subscribe(
          (res: any) => {
            self.widgetsErrorList.splice(self.widgetsErrorList.indexOf(config.WidgetID), 1);
            self.widgetsSpinnerList.splice(self.widgetsSpinnerList.indexOf(config.WidgetID), 1);
            if (config.WidgetType == WidgetTypeEnum.STATISTIC_CHART) {
              config.StatisticWidget = res;
              self.configureStatisticWidget(config);
            }
            else {
              let chartOptions = self.createEChartOptionFromConfig(res, config.WidgetType, config.Currency, config.WidgetSizeClass);

              //Controllo se l'oggetto nella risposta è dello stesso tipo dell'oggetto richiesto specificato nel WidgetType
              let checkType: WidgetCheckResult = self.checkWidgetChartOptions(config.WidgetID, chartOptions, config.WidgetType);
              if (checkType.IsValid != true) {
                self.fireErrorAlert(checkType.ErrorMessage);
                return;
              }
              config.ChartOptions = chartOptions;
            }

            self.reloadMasonryLayout();
          },
          (error) => {
            self.reloadMasonryLayout();

            if (!self.widgetsErrorList.includes(config.WidgetID)) {
              self.widgetsErrorList.push(config.WidgetID);
            }
            self.widgetsSpinnerList.splice(self.widgetsSpinnerList.indexOf(config.WidgetID), 1);
            self.setWidgetStatus(config.WidgetID, false, error.message);
            self.fireErrorAlert(error.message);
          }
        );
    }, 500);

  }

  reloadMasonryLayout() {
    setTimeout(() => {
      //Aggiorno masonry per impostare la grandezza dei widget
      if (this.masonry) {
        this.masonry.reloadItems();
      }
      this.updateMasonryLayout = !this.updateMasonryLayout;
    }, 200);
  }

  /**
   * Scatenato al change di un parametro qualsiasi, permette di richiamare la funzione che aggiorna i dati del widget
   * @param config
   * @returns
   */
  endpointPointParamsValueChanged(config: WidgetConfig) {
    if (!config || !config.EndPointData)
      return;

    //Se per l'endpoint è stato richiesto di ricaricare sempre i dati al change di un qualsiasi input allora
    //richiama la funzione che si occupa di farlo
    if (config.EndPointData.ReloadDataOnParamsChange == true)
      this.runEndPointCall(config);
  }

  /**
   * Restituisce la classe di stile da applicare per il parametro passato in input
   * @param param Oggetto contenente i dati del parametro da renderizzare
   * @returns
   */
  getParameterClass(param: EndPointDataParams): string {
    return param.ParamClass ?? "col-md-4 col-lg-4 col-sm-6";
  }

  getVisibleParams(config: WidgetConfig): Array<EndPointDataParams> {
    if (config.EndPointData == null || config.EndPointData == undefined || config.EndPointData.Params == null || config.EndPointData.Params == undefined)
      return [];

    return config.EndPointData.Params.filter(p => p.isHidden != true);
  }

  reloadWidgetData(config: WidgetConfig) {
    if (config.EndPointData)
      this.runEndPointCall(config);
    else if (config.CustomComponentSelector && this.customComponentSelectorMap && this.customComponentSelectorMap.find(p => p.WidgetID == config.WidgetID) != null) {
      this.widgetsSpinnerList.push(config.WidgetID);
      this.customComponentSelectorMap.find(p => p.WidgetID == config.WidgetID).WidgetHidden = true;
      var self = this;
      setTimeout(() => {
        self.customComponentSelectorMap.find(p => p.WidgetID == config.WidgetID).WidgetHidden = false;
        self.widgetsSpinnerList.splice(self.widgetsSpinnerList.indexOf(config.WidgetID), 1);
      }, 500);
    }
  }

  createEChartOptionFromConfig(chartConfig: any, type: WidgetTypeEnum, currency?: CurrencyEnum, size?: WidgetSizeEnum) {

    if (chartConfig == null || chartConfig == undefined)
      return null;

    let formatWithNotation: boolean = (size == WidgetSizeEnum.XS || this.isMobileDevice);
    let chartOption: any;

    switch (type) {
      case WidgetTypeEnum.BARS_CHART:
        if (!chartConfig.xAxis || !chartConfig.yAxis || !chartConfig.series)
          return {};

        chartOption = new BarChartOption(chartConfig.xAxis, chartConfig.yAxis, chartConfig.series, currency, formatWithNotation, chartConfig.seriesColors);
        break;

      case WidgetTypeEnum.LINE_CHART:
        if (!chartConfig.xAxis || !chartConfig.yAxis || !chartConfig.series)
          return {};

        chartOption = new LineChartOption(chartConfig.xAxis, chartConfig.yAxis, chartConfig.series, currency, formatWithNotation, chartConfig.seriesColors);
        break;

      case WidgetTypeEnum.PIE_CHART:
        if (!chartConfig.series)
          return {};
        chartOption = new PieChartOption(chartConfig.series, chartConfig.tooltip, chartConfig.legend, chartConfig.isDoughnut, currency);
        break;

      case WidgetTypeEnum.RADAR_CHART:
        if (!chartConfig.radar || !chartConfig.radar || !chartConfig.series)
          return {};

        chartOption = new RadarChartOption(chartConfig.radar, chartConfig.series, chartConfig.legend, currency);
        break;

      case WidgetTypeEnum.GAUGE_CHART:
        if (!chartConfig.series)
          return {};

        chartOption = new GaugeChartOption(chartConfig.series, chartConfig.tooltip);
        break;

      case WidgetTypeEnum.CUSTOM_CHART:
        return chartConfig;
    }

    return chartOption;
  }

  checkActiveSpinner(config: WidgetConfig) {
    return this.widgetsSpinnerList.includes(config.WidgetID)
  }


  checkHasErrors(config: WidgetConfig) {
    return this.widgetsErrorList.includes(config.WidgetID)
  }

  /**
   * Restituisce lo stato del widget avente ID uguale al parametro passato
   * @param widgetID ID del widget per cui recuperare lo stato
   * @returns
   */
  getWidgetStatus(widgetID): WidgetCheckResult {
    return this.allWidgetStatus.find(p => p.WidgetID == widgetID);
  }

  getCustomComponentWidgetStatus(widgetID): WidgetHiddenStatus {
    return this.customComponentSelectorMap.find(p => p.WidgetID == widgetID);
  }

  /**
   * Aggiunge o aggiorna lo stato del widget avente ID uguale al parametro passato
   * @param widgetID ID del widget per cui aggiungere o aggiornare lo stato
   * @param widgetIsValid Stato del widget
   * @param widgetError Errore da mostrare (solo se IsValid è false)
   */
  setWidgetStatus(widgetID, widgetIsValid, widgetError, isChartEmpty: boolean = false) {
    if (this.allWidgetStatus == null || this.allWidgetStatus == undefined)
      this.allWidgetStatus = new Array<WidgetCheckResult>();

    let widget = this.allWidgetStatus.find(p => p.WidgetID == widgetID);
    if (widget == null) {
      widget = new WidgetCheckResult(widgetID);
      this.allWidgetStatus.push(widget);
    }

    widget.IsValid = widgetIsValid;
    widget.ErrorMessage = widgetError;
    widget.IsChartEmpty = isChartEmpty;
  }

  /**
   * Funzione che Controlla se l'oggetto nella risposta (res) è dello stesso tipo dell'oggetto richiesto specificato nel tipo (WidgetType)
   * @param res
   * @param WidgetType
   */
  checkWidgetChartOptions(WidgetID, chartOptions, WidgetType): WidgetCheckResult {
    let checkResult: WidgetCheckResult = new WidgetCheckResult(WidgetID, true);
    checkResult.WidgetID = WidgetID;
    checkResult.IsValid = true;

    if (chartOptions == null || chartOptions == undefined || !chartOptions) {
      checkResult.IsValid = false;
      checkResult.ErrorMessage = this.errorAlertMsg;
      this.setWidgetStatus(WidgetID, checkResult.IsValid, checkResult.ErrorMessage);
      return checkResult;
    }

    if (WidgetType == WidgetTypeEnum.CUSTOM_CHART) {
      this.setWidgetStatus(WidgetID, checkResult.IsValid, checkResult.ErrorMessage);
      return checkResult;
    }

    if ((WidgetType == WidgetTypeEnum.BARS_CHART && !(chartOptions instanceof BarChartOption)) || (chartOptions instanceof BarChartOption && WidgetType != WidgetTypeEnum.BARS_CHART)) {
      checkResult.IsValid = false;
      checkResult.ErrorMessage = "The property WidgetType of widget " + WidgetID + " must be equal to BARS_CHART and the ChartOption property must be of type BarChartOption";
    }
    else if ((WidgetType == WidgetTypeEnum.LINE_CHART && !(chartOptions instanceof LineChartOption)) || (chartOptions instanceof LineChartOption && WidgetType != WidgetTypeEnum.LINE_CHART)) {
      checkResult.IsValid = false;
      checkResult.ErrorMessage = "The property WidgetType of widget " + WidgetID + " must be equal to LINE_CHART and the ChartOption property must be of type LineChartOption";
    }
    else if ((WidgetType == WidgetTypeEnum.GAUGE_CHART && !(chartOptions instanceof GaugeChartOption)) || (chartOptions instanceof GaugeChartOption && WidgetType != WidgetTypeEnum.GAUGE_CHART)) {
      checkResult.IsValid = false;
      checkResult.ErrorMessage = "The property WidgetType of widget " + WidgetID + " must be equal to GAUGE_CHART and the ChartOption property must be of type GaugeChartOption";
    }
    else if ((WidgetType == WidgetTypeEnum.PIE_CHART && !(chartOptions instanceof PieChartOption)) || (chartOptions instanceof PieChartOption && WidgetType != WidgetTypeEnum.PIE_CHART)) {
      checkResult.IsValid = false;
      checkResult.ErrorMessage = "The property WidgetType of widget " + WidgetID + " must be equal to PIE_CHART and the ChartOption property must be of type PieChartOption";
    }
    else if ((WidgetType == WidgetTypeEnum.RADAR_CHART && !(chartOptions instanceof RadarChartOption)) || (chartOptions instanceof RadarChartOption && WidgetType != WidgetTypeEnum.RADAR_CHART)) {
      checkResult.IsValid = false;
      checkResult.ErrorMessage = "The property WidgetType of widget " + WidgetID + " must be equal to RADAR_CHART and the ChartOption property must be of type RadarChartOption";
    }

    if (checkResult.IsValid == true && (chartOptions.series == null || chartOptions.series == undefined || chartOptions.series.length == 0))
      this.setWidgetStatus(WidgetID, checkResult.IsValid, checkResult.ErrorMessage, true);
    else
      this.setWidgetStatus(WidgetID, checkResult.IsValid, checkResult.ErrorMessage);

    return checkResult;
  }

  /**
   * funzione generale per la visualizzazione dell'errore passandogli come parametro il messaggio (msg)
   * @param msg
   */
  fireErrorAlert(msg) {
    throw new Error(msg);
  }

  /**
   * setto le dimensioni del widget passando come parametro il widget e la dimensione e poi salvo la nuova configurazione nel local storage
   * @param config
   * @param dimension
   */
  setDimensionToWidget(config: WidgetConfig, size: WidgetSizeEnum) {
    this.setRotateChart(config, size);
    config.WidgetSizeClass = size;
    this.saveUserConfig();
    this._cdRef.detectChanges();
    this.updateMasonryLayout = !this.updateMasonryLayout;
    this.widgetSizeChange.emit(config);
  }

  /**
   * Metodo per la gestione della rotazione delle label dell'asse y dei chart
   * Nel caso di visualizzazione in mobile, questo metodo non fa nulla in quanto le label sono già in verticale (altrimenti verrebbero tagliate).
   *
   * N.B Questo metodo ha effetto solo per i WidgetType definiti e diversi CUSTOM_CHART e STATISTIC_CHART
   */
  setRotateChart(config: WidgetConfig, size: WidgetSizeEnum) {

    //Se il widget type non è definito o non è un chart (quindi o contiene un componente custom o contiene un tipo STATISTIC_WIDGET) quindi
    //non contempla l'uso di echarts allora esce senza fare nulla
    //Altrimenti gestisce la rotazione su schermi piccoli per migliorare la leggibilità
    if (config.WidgetType == null || config.WidgetType == undefined || config.WidgetType == WidgetTypeEnum.CUSTOM_CHART || config.WidgetType == WidgetTypeEnum.STATISTIC_CHART)
      return;

    if (this.isMobileDevice == true)
      return;

    //Nel caso si passi da MD o XL a XS, le label vengono ruotate di 90°
    if (config.WidgetSizeClass != WidgetSizeEnum.XS && size == WidgetSizeEnum.XS && config.ChartOptions.yAxis != null && config.ChartOptions.yAxis.axisLabel != null) {
      config.ChartOptions.yAxis.axisLabel.rotate = 90;
      config.ChartOptions.yAxis.axisLabel.formatter = function (params) {
        var val = EqpDashboardService.nFormatter(params, 1);
        return val;
      }
      this.reRenderChart(config);
    }

    //Nel caso in cui si passi da XS a MD o XL, le label vengono riportate in orizzontale
    if (config.WidgetSizeClass == WidgetSizeEnum.XS && size != WidgetSizeEnum.XS && config.ChartOptions.yAxis != null && config.ChartOptions.yAxis.axisLabel != null) {
      config.ChartOptions.yAxis.axisLabel.rotate = 0;
      let self = this;
      config.ChartOptions.yAxis.axisLabel.formatter = function (params) {
        var val = EqpDashboardService.formatNumbers(params, config.Currency);
        return val;
      }
      this.reRenderChart(config);
    }
  }

  //Metodo per renderizzare nuovamente il chart dopo una modifica
  public reRenderChart(config: WidgetConfig) {
    config.isVisible = false;
    this._cdRef.detectChanges();
    config.isVisible = true;
  }

  //Metodo per avere le diverse istanze del chart e poter modificare le opzioni senza dover renderizzare l'intero grafico
  //TODO: echartInstance come array e piena gestione del re-render
  onChartInit(event) {
    // this.echartInstance = event;
  }

  getWidgetClassSizeFromEnum(size: WidgetSizeEnum) {
    let styleClass: string = "";
    switch (size) {
      case WidgetSizeEnum.XS:
        styleClass = "col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4";
        break;
      case WidgetSizeEnum.MD:
        styleClass = "col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8";
        break;
      case WidgetSizeEnum.XL:
        styleClass = "col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12";
        break;
      default:
        break;
    }

    return styleClass;

  }

  /**
   * ripristina la visualizzazione di tutte le charts nascoste
   */
  showAllCharts() {
    this.allCurrentSetItems.forEach((e) => {
      e.isHidden = false;
    });
    this.saveUserConfig();
    this._cdRef.detectChanges();
    this.reloadMasonryLayout();
  }

  /**
   * Salva il Set corrente nel local storage e setta la length degli items nascosti
   */
  saveUserConfig() {

    //Se è stato richiesto di non salvare la configurazione dei widget allora esce senza fare nulla
    if (this.saveConfigs != true)
      return;

    this.hiddenItemsLength = this.allCurrentSetItems.filter(
      (x) => x.isHidden
    ).length;

    let widgetSettingsToSave: Array<WidgetSavedSetting> = new Array<WidgetSavedSetting>();
    this.allCurrentSetItems.forEach(item => {
      widgetSettingsToSave.push({ WidgetID: item.WidgetID, WidgetSizeClass: item.WidgetSizeClass, isHidden: item.isHidden })
    })
    let base64Obj = window.btoa(
      encodeURIComponent(JSON.stringify(widgetSettingsToSave))
    );
    localStorage.setItem(currentWidgetSet, base64Obj);
  }

  /**
   * restituisce il currentSet degli Items salvati nel Local Storage
   */
  getCurrentSetFromLocalStorage() {

    //Se è stato richiesto di non salvare la configurazione dei widget allora svuota il localstorage (in modo da pulirlo per sicurezza)
    //e poi esce senza fare nulla
    if (this.saveConfigs != true) {
      localStorage.removeItem(currentWidgetSet);
      return;
    }

    let itemsSetToReturn = localStorage.getItem(currentWidgetSet);
    if (itemsSetToReturn) {
      let widgetParsed = JSON.parse(
        decodeURIComponent(window.atob(itemsSetToReturn))
      );
      return widgetParsed;
    }
    return undefined;
  }

  /**
   * Rimuove dal localstorage i dati persistiti.
   * E' stato incapsulato in un metodo per poter esporre all'esterno la possibilità di eliminare i dati dal localstorage
   * (Es: su beesplan e su HSE al cambio azienda deve essere svuotata la configurazione dei widget)
   */
  removeUserConfigFromLocalStorage() {
    localStorage.removeItem(currentWidgetSet);
  }

  /**
   * mostra la modale della lista degli items nascosti
   */
  showHiddenChartsModal() {
    this.dialogRefHiddenElements = this.dialog.open(this.dialogHiddenElements, {
      autoFocus: true,
      minWidth: '40%'
    });
  }

  hideItemFromMatCard(config) {
    config.isHidden = true;
    this.saveUserConfig();
  }


  showHiddenItemsFromModalList(config) {
    config.isHidden = false;
    this.saveUserConfig();
    if (this.hiddenItemsLength == 0 && this.dialogRefHiddenElements) {
      this.dialogRefHiddenElements.close()
    }
    this._cdRef.detectChanges();
    this.reloadMasonryLayout();
  }
}


// @Component({
//   selector: "dynamic-factory",
//   template: '<ng-template dynamic [data]="genericComponent" *ngIf="genericComponent"></ng-template>',
// })
// export class DynamicFactory implements OnInit {
//   @ViewChild(DynamicDirective, { static: false }) dynamic: DynamicDirective;
//   @Input() component: string;
//   @Input() componentInput: any;

//   genericComponent: DynamicLoaderDirectiveData = null;

//   constructor() { }

//   ngOnInit() {
//     this.genericComponent = new DynamicLoaderDirectiveData();
//     this.genericComponent.componentInstance = this.getComponent(this.component);
//     this.genericComponent.inputParams = this.componentInput;
//   }

//   /**
//    * Restrituisce un componente passandogli come parametro la chiave
//    * @param key
//    */
//   getComponent(key: any) {
//     let component = key;
//     if (typeof key == "string") {
//       component = COMPONENT_MAPPER.get(key);
//     }
//     return component;
//   }
// }

export class WidgetSavedSetting {
  public WidgetID: string;
  public isHidden: boolean;
  public WidgetSizeClass: WidgetSizeEnum;
}

export class WidgetCheckResult {
  constructor(id?: string, isValid?: boolean, isChartEmpty?: boolean) {
    this.WidgetID = id;
    this.IsValid = isValid;
    this.ErrorMessage = null;
    this.IsChartEmpty = isChartEmpty != null ? isChartEmpty : false;
  }

  WidgetID: string;
  IsValid: boolean;
  IsChartEmpty: boolean;
  ErrorMessage: string;
}

export class WidgetHiddenStatus {
  constructor(widgetID: string) {
    this.WidgetID = widgetID;
    this.WidgetHidden = false;
  }

  WidgetID: string;
  WidgetHidden: boolean;
}

export class DynamicLoaderDirectiveData {
  componentInstance: Type<any>;
  inputParams: any;
}
