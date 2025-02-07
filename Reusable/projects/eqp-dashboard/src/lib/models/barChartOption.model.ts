import { CurrencyEnum, EqpDashboardService } from "../eqp-dashboard.service";
import { LineLegend, LineSeriesData, LineTooltip, XAxisConfig, YAxisConfig } from "./lineChartOption.model";
import { WidgetTypeEnum } from "./widget-config.model";

/**
 * Classe per la configurazione dei Chart di tipo Bar
 */
export class BarChartOption {
    constructor(xAxis?: XAxisConfig | XAxisConfig[], yAxis?: YAxisConfig | YAxisConfig[], series?: LineSeriesData | LineSeriesData[], currency? : CurrencyEnum, formatWithNotation : boolean = false, seriesColors?: string[]) {
        this.xAxis = xAxis;
        this.yAxis = yAxis;

        //Formattazione e rotazione delle label dell'asse y
        this.yAxis['axisLabel'] = {
          show: true,
          formatter: function (params) {
            var val = formatWithNotation == true ? EqpDashboardService.nFormatter(params, 1) : EqpDashboardService.formatNumbers(params, currency);
            return val;
          },
          rotate : yAxis['axisLabel'] != null ? yAxis['axisLabel']['rotate'] : 0
        }
        this.series = series;

        this.tooltip = {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        }

        //Formattazione tooltip con locale settato nel servizio
        this.tooltip['formatter'] = function(params){
          var val = EqpDashboardService.formatTooltip(params, currency, WidgetTypeEnum.BARS_CHART);
          return val;
        }

        this.legend = new LineLegend();
      this.legend.data = [];

        if (this.series) {
            if (Array.isArray(this.series)) {
                let seriesIndex: number = 0;
                this.series.forEach((item: LineSeriesData) => {
                    item.type = "bar";
                    item.backgroundStyle = { color: "rgba(180, 180, 180, 0.2)" };
                    item.showBackground = true;

                    if(item.name) {
                        this.legend.data.push(item.name);
                    }

                    if(seriesColors && seriesColors.length > seriesIndex) {
                        item["color"] = seriesColors[seriesIndex];
                    }

                    seriesIndex++;
                });
            } else {
                this.series["type"] = "bar";
                this.series["backgroundStyle"] = { color: "rgba(180, 180, 180, 0.2)" };
                this.series["showBackground"] = true;
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
    * Permette di configurare il tooltip del chart. Di default è istanziato con la proprietà trigger = "axis"
    * in modo da mostrare sempre i tooltip quando si passa col mouse sul chart
    */
    public tooltip: LineTooltip;

    /**
    * Proprietà per configurare la legenda del chart
    */
    public legend: LineLegend;

    /**
     * A partire dai dati minimi per il chart, passati come parametri, restituisce un oggetto BarChartOption configurato e pronto
     * per essere mostrato con echarts.
     * @param labels Array di stringhe da utilizzare come etichette per l'asse X e come legenda del chart
     * @param seriesData Dizionario contenente la configurazione delle serie di valori da mostrare per il bar chart
     * @param yAxisPosition Stringa che permette di determinare la posizione dell'asse y (left o right)
     * @returns Restituice un oggetto di tipo BarChartOption pronto per essere visualizzato con echarts
     */
    public static CreateBarChartModel(labels: string[], seriesData: Map<string, number[]>, yAxisPosition? : string, seriesColors?: string[]): BarChartOption {

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
            currentSeries.type = "bar";
            if(seriesColors && seriesColors.length > seriesIndex)
              currentSeries["color"] = seriesColors[seriesIndex];
              
            series.push(currentSeries);

            seriesIndex++;
        });


        let barChart: BarChartOption = new BarChartOption(xAxis, yAxis, series);


        return barChart;
    }
}
