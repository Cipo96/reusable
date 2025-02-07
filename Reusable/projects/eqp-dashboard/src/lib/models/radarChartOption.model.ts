import { CurrencyEnum, EqpDashboardService } from "../eqp-dashboard.service";
import { WidgetTypeEnum } from "./widget-config.model";

/**
* Modello per la configurazione di grafici di tipo RADAR
*/
export class RadarChartOption {
    constructor(radars?: RadarIndicator[], series?: RadarSeries[], legend?: RadarLegendData, currency? : CurrencyEnum) {

        this.legend = legend;
        this.radar = radars;
        this.series = series;
        this.tooltip = new RadarTooltip();
        this.tooltip.trigger = "axis";

        //Formattazione tooltip con locale settato nel servizio
        this.tooltip['formatter'] = function(params){
          var val = EqpDashboardService.formatTooltip(params, currency, WidgetTypeEnum.RADAR_CHART, radars);
          return val;
        }

        if (this.series) {
            this.series.forEach(item => {
                item.type = "radar";
                item.tooltip = new RadarTooltip();
                item.tooltip.trigger = "item";
            });
        }

    }


    /**
     * Proprietà che permette la configurazione del tooltip.
     */
    public tooltip: RadarTooltip;

    /**
     * Permette la configurazione della legenda del chart, definendo le etichette e la sua posizione
     */
    public legend: RadarLegendData;

    /**
     * Permette la configurazione di diversi radar chart, per ciascun chart vanno indicati: elenco di indicatori (marker) del chart ed eventuale
     * dimensione percentuale (di default = 75%)
     */
    public radar: RadarIndicator[];

    /**
     * Permette la configurazione delle serie da mostrare nei diversi chart definiti nella proprietà radar.
     * Per ciascuna serie verranno richiesti: nome, tipo (default = radar), configurazione del tooltip, dati della serie
     * e lo stile da applicare all'area del chart (di default trasparente)
     */
    public series: RadarSeries[];

    /**
     * A partire dai dati minimi per il chart, passati come parametri, restituisce un oggetto RadarChartOption configurato e pronto
     * per essere mostrato con echarts.
     * @param legendLabels Elenco delle etichette da usare come legenda del chart. Se il char contiene un solo radar allora l'array dovrà contenere un solo elemento altrimenti ne conterrà uno per ogni radar diverso
     * @param radars Dizionario contenente le configurazioni di tutti i radar da mostrare nel chart. Ogni nodo del dizionario dovrà contenere come chiave il nome da attribuire al radar e la configurazione degli indicatori del radar
     * @param seriesData Dizionario contenente la configurazione delle serie di valori da mostrare per ogni radar configurato
     * @param radiusChartPercentage Indica la percentuale di ridimensionamento dei radar (valore di default = 75%)
     * @param showTooltip Se TRUE allora configura i tooltip per il chart (nel tooltip verranno mostrati i valori della serie del radar su cui si passa con il mouse)
     * @param fillChartArea Se TRUE allora per ogni radar applica uno stile che permetterà di colorare l'intera area disegnata nel radar
     * @returns Restituice un oggetto di tipo RadarChartOption pronto per essere visualizzato con echarts
     */
    public static CreateRadarChartModel(legendLabels: string[], radars: Map<string, RadarIndicatorData[]>, seriesData: Map<string, RadarSeriesData[]>, radiusChartPercentage: string = "75%", showTooltip: boolean = true, fillChartArea: boolean = true): RadarChartOption {

        if (legendLabels == null || legendLabels == undefined)
            legendLabels = [];

        if (radars == null || radars == undefined)
            radars = new Map<string, RadarIndicatorData[]>();

        if (seriesData == null || seriesData == undefined)
            seriesData = new Map<string, RadarSeriesData[]>();

        let radarChart: RadarChartOption = new RadarChartOption(null, null, null);
        radarChart.radar = new Array<RadarIndicator>();
        radarChart.series = new Array<RadarSeries>();

        if(legendLabels != null && legendLabels.length > 0) {
            radarChart.legend = new RadarLegendData();
            radarChart.legend.data = legendLabels;
        }

        if (showTooltip == true) {
            radarChart.tooltip = new RadarTooltip();
            radarChart.tooltip.trigger = "axis";
        }

        radars.forEach((radarValue, radarKey, map) => {
            let radarIndicator: RadarIndicator = new RadarIndicator();
            radarIndicator.indicator = radarValue;
            radarIndicator.radius = radiusChartPercentage;
            radarChart.radar.push(radarIndicator);
        });

        seriesData.forEach((seriesValue, seriesKey, map) => {
            let series: RadarSeries = new RadarSeries();
            series.name = seriesKey;
            series.type = "radar";
            series.areaStyle = fillChartArea == true ? {} : null;
            series.data = seriesValue;
            if (showTooltip == true) {
                series.tooltip = new RadarTooltip();
                series.tooltip.trigger = "item";
            }

            radarChart.series.push(series);
        });



        return radarChart;
    }
};


/**
 * Classe per la configurazione della legenda del chart
 */
export class RadarLegendData {
    /**
     * Posizione legenda (default = center)
     */
    public left: string = "center";

    /**
     * Etichette della legenda
     */
    public data: string[];
}

/**
 * Classe per la configurazione degli indicatori (marker) per un singolo radar
 */
export class RadarIndicator {
    /**
     * Elenco degli indicatori (cioè i vertici del radar). PEr ciascun indicatore andranno valorizzati il nome e il valore massimo
     */
    public indicator: Array<RadarIndicatorData>;

    /**
     * Percentuale di ridimensionamento del radar (default = 75%)
     */
    public radius: string;
}

/**
 * Classe per la configurazione del singolo indicatore del chart
 */
export class RadarIndicatorData {
    /**
     * Nome da mostrare per l'indicatore (verrà visualizzato nel vertice del radar)
     */
    public text: string;

    /**
     * Valore massimo da usare come riferimento per l'indicatore
     */
    public max: number;
}

export class RadarTooltip {
    public trigger: string;
}

/**
 * Classe per la configurazione dei valori di una singola serie del chart
 */
export class RadarSeriesData {
    /**
     * Valori da mostrare per la serie.
     * Il numero di valori indicati deve essere lo stesso degli indicatori configurati, in modo che
     * la posizione di ogni valore della serie venga rappresentata nell'indicatore avente la stessa posizione dentro la proprietà indicator del radar
     */
    public value: any[];

    /**
     * Nome da attribuire alla serie del radar
     */
    public name?: string;
}

/**
 * Classe per la configurazione di tutte le serie del chart
 */
export class RadarSeries {

    /**
     * Nome del chart
     */
    public name?: string;

    public areaStyle: any;

    /**
     * Type, impostato di default al valore 'radar' nel costruttore di RadarChartOption
     */
    public type?: string = "radar";

    public tooltip: RadarTooltip;

    /**
     * Elenco delle diverse serie di valori da mostare nel grafico
     */
    public data: RadarSeriesData[];
}






