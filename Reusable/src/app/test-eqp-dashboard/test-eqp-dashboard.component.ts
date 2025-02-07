import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { BarChartOption, ComponentMapperService, CurrencyEnum, EndPointData, EndPointDataParamType, EndpointParamCvlConfig, EqpDashboardComponent, EqpDashboardService, GaugeChartData, GaugeChartOption, LineChartOption, PieChartOption, PieSeriesValue, RadarChartOption, RadarIndicatorData, RadarSeriesData, RequestMethodEnum, WidgetConfig, WidgetSizeEnum, WidgetTypeEnum, XAxisConfig } from '@eqproject/eqp-dashboard';

@Component({
  selector: 'app-test-eqp-dashboard',
  templateUrl: './test-eqp-dashboard.component.html',
  styleUrls: ['./test-eqp-dashboard.component.scss']
})
export class TestEqpDashboardComponent implements OnInit {

  @ViewChild('externalTemplate', { static: true }) externalTemplate: TemplateRef<any>;
  @ViewChild('eqpDashboard', { static: false }) eqpDashboard: EqpDashboardComponent;
  config: WidgetConfig = new WidgetConfig();
  chartConfigs: WidgetConfig[] = [];
  testEnum = TestEnum;
  constructor(private eqpDashboardService: EqpDashboardService) {
    // ComponentMapperService.register("ciao", TestppComponent);
    // this.config.CustomComponentSelector = "ciao";
    // this.config.CustomComponentInputs = {
    //   ciaoPP: "Scheda Tecnica",
    // };
  }

  ngOnInit(): void {

    this.config.WidgetSizeClass = WidgetSizeEnum.XS;
    this.config.WidgetTitle = 'Test Componente prova';
    this.config.WidgetID = 'test0';

    this.chartConfigs.push(this.config);

    //#region Configurazione line chart
    this.eqpDashboardService.setLocale('en-US')

    let lineChartConfig: WidgetConfig = new WidgetConfig();
    lineChartConfig.WidgetID = "Dashboard_LineChart";
    lineChartConfig.WidgetTitle = "Line Chart"
    lineChartConfig.WidgetSizeClass = WidgetSizeEnum.XS;
    lineChartConfig.WidgetType = WidgetTypeEnum.BARS_CHART;

    let lineSeriesData: Map<string, number[]> = new Map<string, number[]>();
    lineSeriesData.set("Serie 1", [10000, 25000, 35000]);
    lineSeriesData.set("Serie 2", [20000, 15000, 30000]);
    // lineChartConfig.EndPointData = this.getRisksChartEndPointData();
    lineChartConfig.ChartOptions = BarChartOption.CreateBarChartModel(["Valore 1", "Valore 2", "Valore 3"], lineSeriesData, 'RIGHT', ['red', 'green']);


    // lineChartConfig.Locale = 'it-IT';
    lineChartConfig.Currency = CurrencyEnum.EUR;
    // lineChartConfig.ChartOptions = option;
    this.chartConfigs.push(lineChartConfig);

    //#endregion

    //#region Configurazione bar chart

    let barChartConfig: WidgetConfig = new WidgetConfig();
    barChartConfig.WidgetID = "Dashboard_BarChart";
    barChartConfig.WidgetTitle = "Bar Chart"
    barChartConfig.WidgetSizeClass = WidgetSizeEnum.XS;
    barChartConfig.WidgetType = WidgetTypeEnum.BARS_CHART;
    // barChartConfig.EndPointData = this.getRisksChartEndPointData();
    let barSeriesData: Map<string, number[]> = new Map<string, number[]>();
    barSeriesData.set("Serie 1", [10000.50, 25000, 35000]);
    barSeriesData.set("serie 2", [50000.30, 20000, 40000])
    barChartConfig.ChartOptions = BarChartOption.CreateBarChartModel(["Valore 1", "Valore 2", "Valore 3"], barSeriesData, 'right');
    barChartConfig.Currency = CurrencyEnum.USD;
    this.chartConfigs.push(barChartConfig);

    //#endregion

    //#region Configurazione Pie Chart

    let pieChartConfig: WidgetConfig = new WidgetConfig();
    pieChartConfig.WidgetID = "Dashboard_Pie";
    pieChartConfig.WidgetTitle = "Pie Chart"
    pieChartConfig.WidgetSizeClass = WidgetSizeEnum.XS;
    pieChartConfig.WidgetType = WidgetTypeEnum.PIE_CHART;
    let pieSeries: Map<string, PieSeriesValue[]> = new Map<string, PieSeriesValue[]>();
    pieSeries.set("Serie 1", [{ name: "A", value: 100000, itemStyle: { color: '#64c900' } }, { name: "B", value: 250000, itemStyle: { color: '#ffc700' } }, { name: "C", value: 370000, itemStyle: { color: '#ff0000' } }]);
    pieChartConfig.ChartOptions = PieChartOption.CreatePieChartModel(pieSeries, false);
    pieChartConfig.Currency = CurrencyEnum.EUR;
    this.chartConfigs.push(pieChartConfig);

    //#endregion

    //#region Configurazione Radar Chart

    let radarChartConfig: WidgetConfig = new WidgetConfig();
    radarChartConfig.WidgetID = "Dashboard_Radar";
    radarChartConfig.WidgetTitle = "Radar chart"
    radarChartConfig.WidgetSizeClass = WidgetSizeEnum.XS;
    radarChartConfig.WidgetType = WidgetTypeEnum.RADAR_CHART;
    // radarChartConfig.Currency = CurrencyEnum.EUR;

    let seriesName: string = "Serie 1";
    let indicators: Map<string, RadarIndicatorData[]> = new Map<string, RadarIndicatorData[]>();
    indicators.set(seriesName, [{ text: "Att", max: 100 }, { text: "Vel", max: 100 }, { text: "Tir", max: 100 }, { text: "Dif", max: 100 }, { text: "Fis", max: 100 }]);
    indicators.set("serie 2", [{ text: "Att", max: 100 }, { text: "Vel", max: 100 }, { text: "Tir", max: 100 }, { text: "Dif", max: 100 }, { text: "Fis", max: 100 }]);


    let seriesData: Map<string, RadarSeriesData[]> = new Map<string, RadarSeriesData[]>();
    seriesData.set(seriesName, [{ name: "Serie 1", value: [10, 25, 35, 40, 80] }]);
    seriesData.set("serie 2", [{ name: "serie 2", value: [90, 70, 87, 62, 71] }]);
    radarChartConfig.ChartOptions = RadarChartOption.CreateRadarChartModel([seriesName], indicators, seriesData);

    this.chartConfigs.push(radarChartConfig);

    //#endregion

    //#region Configurazione Gauge Chart

    let gaugeChartConfig: WidgetConfig = new WidgetConfig();
    gaugeChartConfig.WidgetID = "Dashboard_Gauge";
    gaugeChartConfig.WidgetTitle = "Gauge chart"
    gaugeChartConfig.WidgetSizeClass = WidgetSizeEnum.XS;
    gaugeChartConfig.WidgetType = WidgetTypeEnum.GAUGE_CHART;

    let gaugeSeries: Map<string, GaugeChartData[]> = new Map<string, GaugeChartData[]>();
    gaugeSeries.set("Valore 1", [{ name: "Km/h", value: 50 }])
    gaugeChartConfig.ChartOptions = GaugeChartOption.CreateGaugeChartModel(gaugeSeries)
    // gaugeChartConfig.EndPointData = this.getWbsProgressEndPoint();

    this.chartConfigs.push(gaugeChartConfig);

    //#endregion

    //#region Configurazione statistic Chart

    let statisticConfig: WidgetConfig = new WidgetConfig();
    statisticConfig.WidgetTitle = "Statistic Widget";
    statisticConfig.WidgetSizeClass = WidgetSizeEnum.XS;
    statisticConfig.WidgetID = 'StatisticWidget_Dashboard';
    statisticConfig.WidgetType = WidgetTypeEnum.STATISTIC_CHART;
    statisticConfig.StatisticWidget = [
      { Icon: "check_circle", Label: "Completati", Value: 100, MaxValue: 100 }
    ]

    this.chartConfigs.push(statisticConfig);

    //#endregion
  }

  getWbsProgressEndPoint(): EndPointData {


    let endPointDataWbsProgress: EndPointData = new EndPointData();
    endPointDataWbsProgress.Url = "http://localhost:5000/api/Dashboard/GetWbsProgress";
    endPointDataWbsProgress.Params = [
      { PropertyLabel: "FK_Wbs", PropertyName: "FK_Wbs", PropertyValue: 52, ParamClass: "col-12", PropertyType: EndPointDataParamType.NUMBER, isHidden: true },
    ];

    endPointDataWbsProgress.ReloadDataOnParamsChange = true;
    endPointDataWbsProgress.RequestMethod = RequestMethodEnum.POST;

    return endPointDataWbsProgress;
  }

  onSizeChange(widget) {
    // console.log(widget);
    //this.cd.detectChanges();
  }


  getHealthSurveillanceChartEndPointData(): EndPointData {

    let fk_company = 2;

    let data1 = new Date(2021, 0, 1);
    let date2 = new Date(2021, 11, 31);

    let endPointData: EndPointData = new EndPointData()
    endPointData.Url = "http://localhost:5000/api/dashboard/HealthSurveillanceChartData";
    endPointData.RequestMethod = RequestMethodEnum.POST;
    endPointData.Params = [
      { PropertyLabel: "Company", PropertyName: "FK_Company", PropertyValue: fk_company, PropertyType: EndPointDataParamType.NUMBER, isHidden: true },
      { PropertyLabel: "Data inizio", PropertyName: "StartDate", PropertyValue: data1, PropertyType: EndPointDataParamType.DATE },
      { PropertyLabel: "Data fine", PropertyName: "EndDate", PropertyValue: date2, PropertyType: EndPointDataParamType.DATE }
    ];

    return endPointData;
  }

  getMaintenanceChartEndPointData(): EndPointData {
    let data1 = new Date(2021, 0, 1);
    let date2 = new Date(2021, 11, 31);
    let fk_company = 2;
    let endPointData: EndPointData = new EndPointData()
    endPointData.Url = "http://localhost:5000/api/dashboard/MaintenanceChartData";
    endPointData.RequestMethod = RequestMethodEnum.POST;
    endPointData.Params = [
      { PropertyLabel: "Company", PropertyName: "FK_Company", PropertyValue: fk_company, PropertyType: EndPointDataParamType.NUMBER, isHidden: true },
      { PropertyLabel: "Data inizio", PropertyName: "StartDate", PropertyValue: data1, PropertyType: EndPointDataParamType.DATE },
      { PropertyLabel: "Data fine", PropertyName: "EndDate", PropertyValue: date2, PropertyType: EndPointDataParamType.DATE }
    ];

    return endPointData;
  }

  getToDoActivitiesEndPointData(): EndPointData {

    let fk_company = 2;

    let endPointData: EndPointData = new EndPointData()
    endPointData.Url = "http://localhost:5000/api/dashboard/ToDoActivities";
    endPointData.RequestMethod = RequestMethodEnum.GET;
    endPointData.Params = [{ PropertyLabel: "AAA", PropertyName: "FK_Company", PropertyValue: fk_company, PropertyType: EndPointDataParamType.NUMBER, isHidden: true }];

    return endPointData;
  }

  getRisksChartEndPointData(): EndPointData {

    let fk_company = 1;

    let data1 = new Date(2021, 0, 1, 0, 0, 0, 1);//"2021-01-01 00:00:00";//new Date(2021, 0, 1);
    let date2 = "2021-12-31 00:00:00";//new Date(2021, 11, 31);


    let endPointData: EndPointData = new EndPointData()
    endPointData.Url = "http://localhost:5000/api/dashboard/RisksChartData";
    endPointData.RequestMethod = RequestMethodEnum.POST;
    endPointData.ReloadDataOnParamsChange = true;
    endPointData.Params = [
      { PropertyLabel: "Company", PropertyName: "FK_Company", PropertyValue: fk_company, PropertyType: EndPointDataParamType.CVL, CvlConfig: EndpointParamCvlConfig.CreateEndpointParamCVLConfig(null, [{ ID: 1, Label: "Azienda 1" }, { ID: 2, Label: "Azienda 2" }], "ID", "Label", false, true, true, null, false) },
      { PropertyLabel: "Data inizio", PropertyName: "StartDate", PropertyValue: data1, PropertyType: EndPointDataParamType.DATE },
      { PropertyLabel: "Data fine", PropertyName: "EndDate", PropertyValue: date2, PropertyType: EndPointDataParamType.DATE },
      { PropertyLabel: "Text", PropertyName: "Text", PropertyValue: "abcde", PropertyType: EndPointDataParamType.TEXT },
      { PropertyLabel: "Number", PropertyName: "Number", PropertyValue: null, PropertyType: EndPointDataParamType.NUMBER },
      { PropertyLabel: "External", PropertyName: "AAA", PropertyValue: null, PropertyType: EndPointDataParamType.EXTERNAL_TEMPLATE, ExternalTemplateConfig: this.externalTemplate, ParamClass: "col-12" }
    ];

    return endPointData;
  }

  getValutationAcceptableValuesEndPointData(): EndPointData {

    let fk_company = 2;

    let data1 = new Date(2021, 0, 1);
    let date2 = new Date(2021, 11, 31);


    let endPointData: EndPointData = new EndPointData()
    endPointData.Url = "http://localhost:5000/api/dashboard/ValutationAcceptableValuesChartData";
    endPointData.RequestMethod = RequestMethodEnum.POST;
    endPointData.Params = [
      { PropertyLabel: "AAA", PropertyName: "FK_Company", PropertyValue: fk_company, PropertyType: EndPointDataParamType.NUMBER, isHidden: true },
      { PropertyLabel: "Data inizio", PropertyName: "StartDate", PropertyValue: data1, PropertyType: EndPointDataParamType.DATE },
      { PropertyLabel: "Data fine", PropertyName: "EndDate", PropertyValue: date2, PropertyType: EndPointDataParamType.DATE }
    ];

    return endPointData;

  }

  testExternalTemplate(widget: WidgetConfig) {
    if (this.eqpDashboard)
      this.eqpDashboard.runEndPointCall(widget);
  }
}



export enum TestEnum {
  Italia = 1,
  Spagna = 2,
  Germania = 3,
  Inghilterra = 4,
  Francia = 5
}
