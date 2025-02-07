/**
  * Permette di configurare un chart di tipo gauge
  */
export class GaugeChartOption {
    constructor(series?: GaugeChartSeries[], tooltip?: GaugeTooltip) {

        if(tooltip != null && tooltip.formatter != null)
            this.tooltip = tooltip;
        else
            this.tooltip = new GaugeTooltip("{a} <br/>{b} : {c}");



        this.series = series;
        if (this.series) {
            this.series.forEach(data => {
                data.type = "gauge";
                data.detail = { formatter: data.detail != null && data.detail.formatter != null ? data.detail.formatter : "{value}" };
            })
        }
    }

    /**
     * Permette di configurare il tooltip per il gauge.
     * Al momento permette la configurazione solo del formatter del tooltip (valore di default "{a} <br/>{b} : {c}")
     */
    public tooltip: GaugeTooltip;

    /**
     * Permette di configurare le diverse serie da mostrare nel chart gauge.
     * Ogni serie coinciderà con un indicatore nel chart.
     */
    public series: GaugeChartSeries[];

    /**
     * A partire dai dati minimi per il chart, passati come parametri, restituisce un oggetto BarChartOption configurato e pronto
     * per essere mostrato con echarts.
     * @param seriesData Dizionario contenente la configurazione delle serie di valori da mostrare per il gauge chart
     * @returns Restituice un oggetto di tipo BarChartOption pronto per essere visualizzato con echarts
     */
    public static CreateGaugeChartModel(seriesData: Map<string, GaugeChartData[]>): GaugeChartOption {

        if (seriesData == null || seriesData == undefined)
            seriesData = new Map<string, GaugeChartData[]>();

        let series: GaugeChartSeries[] = [];
        seriesData.forEach((seriesValue, seriesKey, map) => {
            let currentSeries: GaugeChartSeries = new GaugeChartSeries();
            currentSeries.name = seriesKey;
            currentSeries.type = "gauge";
            currentSeries.detail = new GaugeChartDetailData("{value}");
            currentSeries.data = seriesValue;
            series.push(currentSeries);
        });

        let gaugeChart: GaugeChartOption = new GaugeChartOption(series)
        return gaugeChart;
    }
};

/**
 * Classe per configurare il formatter del grafico gauge
 */
export class GaugeChartDetailData {

    constructor(formatter?: string) {
        this.formatter = formatter;
    }
    /**
     * Permette di definire il tooltip da mostrare quando si passa sull'indicatore del gauge
     */
    public formatter: string;
}

/**
 * Classe per la configurazione del valore del chart
 */
export class GaugeChartData {

    /**
     * Valore da mostrare nel gauge
     */
    public value: number;

    /**
     * Etichetta da attribuire al valore
     */
    public name: string;
}

/**
 * Configura la serie da mostrare nel gauge
 */
export class GaugeChartSeries {

    /**
     * Nome della serie
     */
    public name: string;

    /**
     * Type, definito di default nel costruttore di GaugeChartOption col valore 'gauge'
     */
    public type?: string;

    /**
     * Permette di definire la configurazione dell'etichetta da mostrare nel gauge
     */
    public detail: GaugeChartDetailData;

    /**
     * Permette di definire i dati delle serie da mostare nel chart
     */
    public data: GaugeChartData[];
}

export class GaugeTooltip {
    constructor(formatter?: string) {
        this.formatter = formatter;
    }
    public formatter: string = "{a} <br/>{b} : {c}";
}
