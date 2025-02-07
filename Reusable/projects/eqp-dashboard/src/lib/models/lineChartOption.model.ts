import { CurrencyEnum, EqpDashboardService } from "../eqp-dashboard.service";
import { WidgetTypeEnum } from "./widget-config.model";

/**
 * Classe per la configurazione dei Chart di tipo Line
 */
 export class LineChartOption {
   constructor(xAxis? :XAxisConfig | XAxisConfig[], yAxis?: YAxisConfig | YAxisConfig[], series?: LineSeriesData | LineSeriesData[], currencyEnum?: CurrencyEnum, formatWithNotation : boolean = false, seriesColors?: string[]) {

      this.xAxis = xAxis;
      this.yAxis = yAxis;

      //Gestione delle label dell'asse y
      this.yAxis['axisLabel'] = {
        show: true,
        //Nel caso sia richiesta la formattazione con le notazioni k, M, ... si usa quella funzione, altrimenti i numeri vengono formattati in base al locale e alla currency(se presenti)
        formatter: function (params) {
          var val = formatWithNotation == true ? EqpDashboardService.nFormatter(params, 1) : EqpDashboardService.formatNumbers(params, currencyEnum);
          return val;
        },
        //Gestione rotazione delle label dell'asse y
        rotate : yAxis['axisLabel'] != null ? yAxis['axisLabel']['rotate'] : 0
      }

      this.series = series;

      //Formattazione tooltip con locale settato nel servizio
      this.tooltip = {
        trigger: "axis",
        formatter: function(params) {
            return EqpDashboardService.formatTooltip(params, currencyEnum, WidgetTypeEnum.LINE_CHART);
        }
      }

      this.legend = new LineLegend();
      this.legend.data = [];

      if(this.series) {
        if (Array.isArray(this.series)) {
          let seriesIndex: number = 0;
          this.series.forEach((item: LineSeriesData) => {
            if(seriesColors && seriesColors.length > seriesIndex)
              item["color"] = seriesColors[seriesIndex];

            item.type = "line";
            if(item.name) {
              this.legend.data.push(item.name);
            }

            seriesIndex++;
          });
        } else {
          this.series["type"] = "line";
          if(seriesColors && seriesColors.length > 0)
            this.series["color"] = seriesColors[0];
        }
      }
    }

    /**
     * Proprietà per definire la configurazione dell'asse X del grafico
     */
    public xAxis: XAxisConfig | XAxisConfig[];

      /**
     * Proprietà per definire la configurazione dell'asse Y del grafico
     */
    public yAxis: YAxisConfig | YAxisConfig[];

      /**
     * Proprietà per definire le diverse serie di dati da mostrare nel grafico
     */
    public series: LineSeriesData | LineSeriesData[];

    /**
     * Proprietà per configurare la legenda del chart
     */
    public legend: LineLegend;

    /**
     * Permette di configurare il tooltip del chart. Di default è istanziato con la proprietà trigger = "axis"
     * in modo da mostrare sempre i tooltip quando si passa col mouse sul chart
     */
    public tooltip: any;

    public static CreateLineChartModel(labels: string[], seriesData: Map<string, number[]>, yAxisPosition? : string, seriesColors?: string[]) : LineChartOption {
        if(labels == null || labels == undefined)
            labels = [];

        if(seriesData == null || seriesData == undefined)
            seriesData = new Map<string, number[]>();


        let xAxis: XAxisConfig = new XAxisConfig();
        xAxis.data = labels;
        xAxis.type = "category";

        let yAxis: YAxisConfig = new YAxisConfig();
        yAxis.type = "value";
        yAxis.position = yAxisPosition != null ? yAxisPosition.toLowerCase() : '';


        let series: LineSeriesData[] = [];
        var seriesIndex: number = 0;
        seriesData.forEach((seriesValue, seriesKey, map) => {
            let currentSeries: LineSeriesData = new LineSeriesData();
            currentSeries.name = seriesKey;
            currentSeries.data = seriesValue;
            currentSeries.type = "line";

            if(seriesColors && seriesColors.length > seriesIndex)
              currentSeries["color"] = seriesColors[seriesIndex];

            series.push(currentSeries);

            seriesIndex++;
        });


        let lineChart: LineChartOption = new LineChartOption(xAxis, yAxis, series);
        return lineChart;
    }
  }


/**
 * Classe che permette di definire la configurazione delle diverse serie da mostrare nel grafico
 */
 export class LineSeriesData {

    /**
     * Nome da attribuire alla serie e che verrà usato nel tooltip di ogni barra
     */
    public name: string;

    /**
     * Array di numeri che compone la serie di dati da mostrare nel grafico
     */
    public data: any;

    /**
     * Tipo della serie. Viene settato di default a bar o line a seconda di quale dei due si sta configurando
     */
    public type?: string;

    /**
     * Viene settata di default a TRUE nei casi di BarChart, permette di mostrare il background (definito di seguito) nei
     * chart di tipo bar
     */
    public showBackground?:boolean = null;

      /**
     * Viene settata di default nei casi di chart di tipo bar, permette di definire il background di ogni barra
     */
    public backgroundStyle?: { color: string } = null;
  }


/**
 * Classe per configurare l'ascissa X
 */
 export class XAxisConfig {

    /**
     * Valore di default che non va modificato
     */
    public type: string = "category";

    /**
     * Etichette da mostrare nell'asse X
     */
    public data: string[];
  }

  /**
   * Classe per configurare l'ordinata Y
   */
  export class YAxisConfig {
    /**
     * Valore di default da non modificare
     */
    public type: string = "value";

    /**
     * Valore per decidere la posizione dell'asse y
     * Valori possibili 'left' e 'right'
     */
    public position: string = "left";
  }

  /**
   * Classe per la configurazione della legenda dei chart di tipo Line e Bar
   */
  export class LineLegend {
      /**
       * Permette di definire l'elenco delle etichette da mostrare come legenda.
       * Il numero di elementi deve coincidere con il numero di valori della serie del chart
       */
      public data: string[];
  }

  /**
   * Classe per la configurazione del trigger per la visualizzazione del tooltip del chart
   */
  export class LineTooltip {
      public trigger: string = "axis";
      public axisPointer?: any;
  }
