import { CurrencyEnum, EqpDashboardService } from "../eqp-dashboard.service";
import { WidgetTypeEnum } from "./widget-config.model";

/**
 * Classe per la configurazione dei Chart di tipo Pie
 */
export class PieChartOption {
    constructor(series?: PieSeries[], tooltip?: PieTooltipData, legend?: PieLegendData, isDoughnut?: boolean, currency? : CurrencyEnum) {

        if (tooltip == null || tooltip == undefined)
            tooltip = new PieTooltipData();

        if (legend == null || legend == undefined)
            legend = new PieLegendData();

        this.tooltip = tooltip;

        //Formattazione tooltip con locale settato nel servizio
        this.tooltip['formatter'] = function(params) {
          var val = EqpDashboardService.formatTooltip(params, currency, WidgetTypeEnum.PIE_CHART);
          return val;
        }

        this.legend = legend;
        this.series = series;
        this.isDoughnut = isDoughnut;

        if (this.series) {
            this.series.forEach(item => {
                if (item.type == null || item.type == undefined)
                    item.type = "pie";

                // if(isDoughnut == true)
                //     item.radius = ['40%', '70%'];
                // else 
                if (item.radius == null || item.radius == undefined)
                    item.radius = isDoughnut == true ? ['40%', '70%'] : "50%";
            });
        }
    }

    /**
     * Permette di definire il comportamento dei tooltip (valore di default: item)
     */
    public tooltip: PieTooltipData;

    /**
     * Permette di definire la configurazione per il posizionamento della legenda (valore di default: in alto a sinistra)
     */
    public legend: PieLegendData

    /**
     * Permette di definire le serie di valori da mostrare nel grafico a torta
     */
    public series: PieSeries[];

    /**
     * Se TRUE allora il grafico viene mostrato a ciambella
     */
    public isDoughnut: boolean = false;


    /**
     * Genera un oggetto PieChartOption con la configurazione per il grafico a torta.
     * Il parametro seriesData deve contenere tanti nodi quanti sono le serie diverse da dover mostrare nel chart (ogni serie mostrerà una torta).
     * Per ciascuna serie è necessario indicare una lista di elementi di tipo PieSeriesValue con indicati il nome e il valore
     * di ogni elemento della serie (il singolo elemento della serie comporrà lo spicchio della torta)
     * @param seriesData Dizionario contenente tante chiavi quante sono le serie diverse da mostrare nel grafico, per ogni serie è necessario indicare un elenco di valori che compongono i dati della serie stessa
     * @returns Restituisce un oggetto di tipo PieChartOption pronto per essere visualizzato con echarts
     */
    public static CreatePieChartModel(seriesData: Map<string, PieSeriesValue[]>, isDoughnut: boolean = false): PieChartOption {

        if(seriesData == null || seriesData == undefined) {
            seriesData = new Map<string, PieSeriesValue[]>();
        }

        let series: PieSeries[] = [];
        seriesData.forEach((seriesValue, seriesKey, map) => {
            let currentSeries: PieSeries = new PieSeries();
            currentSeries.name = seriesKey;
            currentSeries.data = seriesValue;
            currentSeries.type = "pie";
            if(isDoughnut != true)
                currentSeries.radius = "50%";
            else
                currentSeries.radius = ['40%', '70%'];

            series.push(currentSeries);
        });

        let pieChart: PieChartOption = new PieChartOption(series);


        return pieChart;
    }
};

/**
 * Classe per la configurazione della serie di valori da mostrare nel grafico a torta
 */
export class PieSeries {

    /**
     * Nome della serie
     */
    public name: string;

    /**
     * Tipo (impostato di default al valore 'pie' dentro il costruttore di PieChartOption)
     */
    public type?: string = "pie";

    /**
     * Array di valori che compone la singola serie del grafico a torta
     */
    public data: PieSeriesValue[];

    /**
     * Impostato di default col valore 50%
     */
    public radius?: any;
}

export class PieSeriesValue {
    public name: string;
    public value: number;
    public itemStyle?: PieSeriesValueColor;
}

export class PieSeriesValueColor {
    public color: string;
}

/**
 * Classe che permette la configurazione del posizionamento della legende
 */
export class PieLegendData {
    /**
     * Orientamento della legenda (default: verticale)
     */
    public orient: string = 'vertical';

    /**
     * Allineamento (default: left)
     */
    public left: string = 'left';
}

export class PieTooltipData {
    public trigger: string = 'item';
}
