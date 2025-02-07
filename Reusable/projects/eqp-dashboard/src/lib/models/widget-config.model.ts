import { TemplateRef } from "@angular/core";
import { Subject } from "rxjs";
import { CurrencyEnum, EqpDashboardService } from "../eqp-dashboard.service";
import { BarChartOption } from "./barChartOption.model";
import { GaugeChartOption } from "./gaugeChartOption.model";
import { LineChartOption } from "./lineChartOption.model";
import { PieChartOption } from "./pieChartOption.model";
import { RadarChartOption } from "./radarChartOption.model";

export class WidgetConfig {
  public WidgetID: string;
  public WidgetTitle?: string;
  public WidgetTitleColor?: string;
  public WidgetSizeClass?: WidgetSizeEnum;
  public WidgetSizeTypes?: Array<WidgetSizeEnum>;
  public WidgetType?: WidgetTypeEnum;
  public ChartOptions?: LineChartOption | BarChartOption | PieChartOption | RadarChartOption | GaugeChartOption | any;

  public EndPointData?: EndPointData;
  public CustomComponentSelector?: any;
  public CustomComponentInputs?: any;

  public StatisticWidget?: Array<StatisticItem>;
  public isHidden?: boolean = false;

  public Currency?: CurrencyEnum;

  //Proprietà per renderizzare un chart quando viene modificato il size da XS o a XS per ruotare le label
  public isVisible: boolean = true;

  public genericComponent: any;
}

export class EndPointData {
  Url: string;
  Token?: string;
  RequestMethod: RequestMethodEnum;
  Params?: EndPointDataParams[];
  ReloadDataOnParamsChange?: boolean;
}

export class EndPointDataParams {
  PropertyName: string;
  PropertyLabel: string;
  PropertyValue: any = null;
  PropertyType: EndPointDataParamType;
  CvlConfig?: EndpointParamCvlConfig;
  ExternalTemplateConfig?: TemplateRef<any>;
  ParamClass?: string = "col-md-4 col-lg-4 col-sm-6";
  isHidden?: boolean = false;
}

export enum EndPointDataParamType {
  TEXT = 1,
  NUMBER = 2,
  DATE = 3,
  DATETIME = 4,
  CVL = 5,
  EXTERNAL_TEMPLATE = 6
}

export class StatisticItem {
  public Icon?: string;
  public IsFontAwesomeIcon?: boolean = null;
  public IconClass?: any;
  public LabelClass?: any;
  public Label: string;
  public ProgressBarColor?: any;
  public Value: number;
  public MaxValue?: number;
  public Percentage?: string;

}

//Enumeratore che gestisce i tipi di widget
export enum WidgetTypeEnum {
  PIE_CHART = 1,
  BARS_CHART = 2,
  LINE_CHART = 3,
  RADAR_CHART = 4,
  GAUGE_CHART = 5,
  STATISTIC_CHART = 6,
  CUSTOM_CHART = 7
}

//Enumeratore che gestisce i tipi di widget
export enum WidgetSizeEnum {
  XS = 1,
  MD = 2,
  XL = 3
}

export enum RequestMethodEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT'
}

/**
 * Classe che permette di configurare una eqp-select (CVL) per uno specifico filtro
 */
export class EndpointParamCvlConfig {
  /**
   * Se la CVL si basa su un enumeratore allora in questa proprietà va definito il type dell'enumeratore da usare.
   * In questo modo la sorgente dati della CVL sarà l'insieme dei valori definiti per l'enumeratore.
   * 
   * Se viene popolata questa proprietà allora non serve indicare ArrayData,ArrayKeyProperty e ArrayValueProperty
   */
  public EnumData?: any;

  /**
   * Se la CVL si basa su un array allora in questa proprietà va definito l'array da mostrare come sorgente dati della CVL.
   * 
   * Se viene popolata questa proprietà allora non serve indicare EnumData ma è obbligatorio indicare ArrayKeyProperty e ArrayValueProperty
   */
  public ArrayData?: any;

  /**
   * Nel caso di ArrayData definito permette di indicare la proprietà degli oggetti dell'array da bindare al filtro.
   * Obbligatoria se ArrayData risulta definito
   */
  public ArrayKeyProperty?: any;

  /**
   * Nel caso di ArrayData definito permette di indicare la proprietà degli oggetti da visualizzare nel filtro.
   * Obbligatoria se ArrayData risulta definito
   */
  public ArrayValueProperty?: any;

  /**
   * Se TRUE allora mostra il campo di ricerca all'interno della CVL (default: TRUE)
   */
  public IsSearchable?: boolean = false;

  /**
   * Se TRUE allora mostra il pulsante per pulire la selezione della CVL (default: TRUE)
   */
  public ShowCancelButton?: boolean = true;

  /**
   * Permette di definire l'etichetta per il campo di ricerca (default: 'Cerca')
   */
  public SearchText?: string = "Cerca";

  /**
   * Permette di definire la multi selezione dei valori della CVL (default: false)
   */
  public IsMultiSelect?: boolean = false;

  /**
   * Permette di definire se nella CVL il binding deve considera tutto l'oggetto o solo la proprietà
   * definita dentro ArrayKeyProperty
   * (default: true)
   */
  public BindFullObject?: boolean = true;

  /**
   * Dati gli opportuni parametri restituisce un oggetto FilterCvlConfig pronto all'uso.
   * @param enumData Type dell'enumeratore da usare nella cvl (opzionale)
   * @param arrayData Array da usare nella cvl (opzionale)
   * @param arrayKeyProperty Nome della proprietà da usare come binding (opzionale)
   * @param arrayValueProperty Nome della proprietà da mostrare nella CVL (opzionale)
   * @param isMultiSelect Attiva o disattiva la multiselezione (opzionale)
   * @param isSearchable Attiva o disattiva la ricerca nella CVL (opzionale)
   * @param showCancelButton Attiva o disattiva il pulsante per pulire la selezione nella CVL (opzionale)
   * @param searchText Definisce l'etichetta del campo di ricerca (opzionale)
   * @returns Valida i parametri e restituisce un oggetto di tipo FilterCvlConfig
   */
  static CreateEndpointParamCVLConfig(enumData?: any, arrayData?: any, arrayKeyProperty?: any, arrayValueProperty?: any, isMultiSelect?: boolean, isSearchable?: boolean, showCancelButton?: boolean, searchText?: string, bindFullObject?: boolean): EndpointParamCvlConfig {
    let cvlConfig: EndpointParamCvlConfig = new EndpointParamCvlConfig();

    if ((enumData == null || enumData == undefined) && (arrayData == null || arrayData == undefined)) {
      throw new Error("It's mandatory to define one of the enumData or enumArray properties");
    }

    cvlConfig.ArrayData = arrayData;
    cvlConfig.EnumData = enumData;
    cvlConfig.ArrayKeyProperty = arrayKeyProperty;
    cvlConfig.ArrayValueProperty = arrayValueProperty;

    if (isMultiSelect != null)
      cvlConfig.IsMultiSelect = isMultiSelect;

    if (isSearchable != null)
      cvlConfig.IsSearchable = isSearchable;

    if (showCancelButton != null)
      cvlConfig.ShowCancelButton = showCancelButton;

    if (searchText)
      cvlConfig.SearchText = searchText;

    if (bindFullObject != null)
      cvlConfig.BindFullObject = bindFullObject;

    return cvlConfig;
  }
}

