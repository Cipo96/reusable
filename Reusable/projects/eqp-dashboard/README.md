Table of contents
=================
 * [Getting started](#getting-started)
 * [Use cases](#use-cases)
 * [API](#api)
 * [Credits](#credits)

## Required
- [x] Angular Material installed and imported
- [x] ngx-echarts installed (Check compatibility with your angular version)
- [x] @juggle/resize-observer
- [x] echarts
- [x] @angular-material-components/datetime-picker (v2.0.4)
- [x] @angular-material-components/moment-adapter
- [x] Moment.js


## Getting started
This package allows the creation of a flexible dashboard with different types of widgets. Each widget may contain various information such as graphs, statistics or entire external components

### Step 1: Install `eqp-dashboard`:

#### NPM
```shell
npm install --save @eqproject/eqp-dashboard
```

### Step 2: Import the EqpDashboardModule :
```js
import { EqpDashboardModule } from '@eqproject/eqp-dashboard';

@NgModule({
  declarations: [AppComponent],
  imports: [EqpDashboardModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
```


  
## API
### Inputs
| Input  | Type | Default | Required | Description |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| [configs] | `Array<WidgetConfig>` | `-` | yes | Array of WidgetConfig Objects|
| [saveConfigs] | `bool` | `True` | no | If TRUE then save the widget configuration in the localstorage |
| [hideTooltipLabel] | `string` | `Hide` | no | Set tooltip label of top left eye icon widget |
| [showTooltipLabel] | `string` | `Show` | no | Set tooltip label of eye icon row in modal hidden items list |
| [resizeTooltipLabel] | `string` | `Resize Widget` | no | Set tooltip label of top right tree dots icon widget |
| [showAllHiddenItemsLabel] | `string` | `Show all hidden elements` | no | Set label of settings button that shows all hidden items |
| [showListHiddenItemsLabel] | `string` | `Show hidden elements list` | no | Set label of settings button that shows modal of hidden items list |
| [settingsLabel] | `string` | `Settings` | no | Set tooltip label of top left settings icon |
| [smallLabel] | `string` | `Small` | no | Set label of small widget resize option |
| [mediumLabel] | `string` | `Medium` | no | Set label of medium widget resize option |
| [LargeLabel] | `string` | `Large` | no | Set label of large widget resize option |
| [showSpinnerLabel] | `bool` | `True` | no | If TRUE then it shows the label in the widget spinner configured for an endpoint |
| [spinnerLabel] | `string` | `Loading...` | no | Set the spinner label |
| [dashboardSettingsLabel] | `string` | `null` | no | Set label for the dashboard settings button |
| [hiddenWidgetModalTitle] | `string` | `Hidden widget list` | no | Set label for the hidden widget list modal |
| [RechargeLabel] | `string` | `Reload` | no | Set label for reload tooltip button |
| [searchTooltipLabel] | `string` | `Search` | no | Set label for endpoint search button |
| [emptyChartMessage] | `string` | `No data to show for this chart` | no | Set message to show when the chart is empty |


### Outputs
| Output  | Event Arguments | Required | Description |
| ------------- | ------------- | ------------- | ------------- |
| [widgetSizeChange] | `EventEmitter<WidgetConfig>` | no | Invoked when resizing the widget. Returns the data of the resized widget |

### Models used

####  WidgetConfig Model: class for configure each individual widget

| Property  | Description | Type | Examples |
| ------------- | ------------- | ------------- | ------------- |
| WidgetID | Unique Widget ID string | `string` | - |
| WidgetTitle | Displayed widget title string | `string` | - |
| WidgetTitleColor | Set Widget title color | `string` | 'red' or '#ff0000' |
| WidgetSizeClass | WidgetTypeEnum - define with enumerator the widget size | `WidgetSizeEnum` | XS, MD, XL |
| WidgetType | WidgetTypeEnum - define with enumerator the widget type | `WidgetTypeEnum` | PIE_CHART = 1, BARS_CHART = 2, LINE_CHART = 3, RADAR_CHART = 4, GAUGE_CHART = 5, STATISTIC_CHART = 6, CUSTOM_CHART = 7 |
| ChartOptions | If CustomComponentSelector and StatisticWidget are not defined allow to define the specific chart configuration. It can belong to one of types: LineChartOption, BarChartOption, PieChartOption, RadarChartOption, GaugeChartOption | `LineChartOption or BarChartOption or PieChartOption or RadarChartOption or GaugeChartOption` | - |
| EndPointData | Allows you to configure the endpoint data to be called to retrieve the data to show in the graph | `EndPointData` | - |
| CustomComponentSelector | Allows you to define the selector of an external component to be shown in the widget. The component will need to reside in the project where eqp-dashbaord is located | `string` | - |
| CustomComponentInputs | Allows you to define the inputs to pass to the external component, defined by CustomComponentSelector | `any` | - |
| StatisticWidget | Used to configure a statistical widget that displays numerical data | `Array<StatisticItem>` | - |
| Currency | Used to determine the currency formatting to use | `CurrencyEnum` | - |


#### EndPointData Model
| Property  | Description | Type | Required | Examples |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| Url | URL of endpoint | `string` | yes | `http://localhost:5000/api/test` |
| Token | Header token to send to endpoint | `string` | no | - |
| RequestMethod | Verb to use for endpoint | `RequestMethodEnum` | yes | A single value between: GET, POST, PUT |
| Params | Params to pass to endpoint | `EndPointDataParams[]` | no | An object of type EndPointDataParams |
| ReloadDataOnParamsChange | If TRUE then any modification of any parameter value will cause the widget updating  | `boolean` | no | Default value: null |

#### EndPointDataParams Model
| Property  | Description | Type | Required | Examples |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| PropertyLabel | Label to show for the property filter | `string` | yes | `Data inizio` |
| PropertyName | Name of the property to use as filter | `string` | yes | `StartDate` |
| PropertyValue | Value of the property to use as filter (default: null) | `any` | no | - |
| PropertyType | Type of the filter property | `EndPointDataParamType` | yes | A single value between: TEXT, NUMBER, DATE, DATETIME, CVL, EXTERNAL_TEMPLATE |
| CvlConfig | Type of the filter property | `EndpointParamCvlConfig` | no | - |
| isHidden | TRUE if you want to use the filter with default value, without showing it | `boolean` | no | - |
| ExternalTemplateConfig |  | `TemplateRef<any>` | no | - |
| ParamClass |   | `string` | no | Default value: "col-md-4 col-lg-4 col-sm-6" |


#### EndpointParamCvlConfig Model
| Property  | Description | Type | Examples |
| ------------- | ------------- | ------------- | ------------- |
| EnumData | If the CVL is based on an enumerator then in this property the type of the enumerator to be used must be defined. In this way the data source of the CVL will be the set of values ​​defined for the enumerator | `any` | - |
| ArrayData | If the CVL is based on an array then in this property the array to be shown as the data source of the CVL must be defined | `any[]` | - |
| ArrayKeyProperty | In the case of ArrayData defined it allows to indicate the property of the objects of the array to bind to the filter | `string` | - |
| ArrayValueProperty | In the case of ArrayData defined, it allows you to indicate the property of the objects to be displayed in the filter | `string` | - |
| IsSearchable | If TRUE then it shows the search field within the CVL | `boolean` | - |
| ShowCancelButton | If TRUE then it shows the button to clear the CVL selection | `boolean` | - |
| SearchText | Allows you to define the label for the search field | `string` | - |
| IsMultiSelect | It allows you to define the multi-selection of CVL values | `boolean` | - |
| BindFullObject | It allows to define if in the CVL the binding must consider the whole object or only the property defined inside ArrayKeyProperty | `boolean` | - |

##### Static exposed functions
| Name  | Returned Type | Parameters | Examples |
| ------------- | ------------- | ------------- | ------------- |
| CreateEndpointParamCVLConfig | `EndpointParamCvlConfig` | `enumData?: any, arrayData?: any, arrayKeyProperty?: any, arrayValueProperty?: any, isMultiSelect?: boolean, isSearchable?: boolean, showCancelButton?: boolean, searchText?: string, bindFullObject?: boolean` | - |

#### StatisticItem Model
| Property  | Description | Type | Required | Examples |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| Icon | Material icon tag name | `string` | no | delete or fa fa-check |
| IsFontAwesomeIcon | TRUE if you want to use font-awesome (default: FALSE - use material icons) | `boolean` | no | - |
| IconClass | A style class to apply to the icon | `string` | no | - |
| LabelClass | A style class to apply to the label | `string` | no | - |
| Label | Label of the statistic value | `string` | yes | - |
| ProgressBarColor | Color to apply to the progress bar | `string` | no | `red or #FFFFFF` |
| Value | The value to show on the statistic line | `number` | yes | - |
| MaxValue | The max value of the bar (required for percentage calculations) | `number` | no | - |
| Percentage | The percentage value of the statistic line | `string` | no | - |

#### LineChartOption Model
Describes the model for configuring LINE type charts
| Property  | Description | Type | Required | Examples |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| xAxis | The data configuration for the X Axis of the chart | `XAxisConfig` | yes | `View use cases 1` |
| yAxis | The data configuration for the Y Axis of the chart | `YAxisConfig` | yes | `View use cases 1` |
| series | The data configuration for the X Axis of the chart | `LineSeriesData | LineSeriesData[]` | yes | `View use cases 1` |
| legend | The data configuration for chart legend (automatically set to show the legend) | `LineLegend ` | no | - |
| tooltip | The data configuration for chart tooltip (automatically set to show tooltips on hover) | `LineTooltip ` | no | - |

Static exposed functions
| Name  | Returned Type | Parameters | Examples |
| ------------- | ------------- | ------------- | ------------- |
| CreateLineChartModel | `LineChartOptions` | `labels: string[], seriesData: Map<string, number[]>, yAxisPosition? : string, seriesColors?: string[]` | `labels`: list of labels for the X axis ; `seriesData`: Dictionary containing the configuration of the series of values to be shown for the bar chart; `yAxisPosition` : String that determines the position of the Y axis (left or right); `seriesColors`: Allows you to define the colors to be used for each series of the chart. The array is positional so the first color will be attributed to the first series, the second color to the second series etc ...  |

#### BarChartOption Model
Describes the model for configuring BAR type charts
| Property  | Description | Type | Required | Examples |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| xAxis | The data configuration for the X Axis of the chart | `XAxisConfig` | yes | `View use cases 2` |
| yAxis | The data configuration for the Y Axis of the chart | `YAxisConfig` | yes | `View use cases 2` |
| series | The data configuration for the X Axis of the chart | `LineSeriesData | LineSeriesData[]` | yes | `View use cases 2` |
| legend | The data configuration for chart legend (automatically set to show the legend) | `LineLegend ` | no | - |
| tooltip | The data configuration for chart tooltip (automatically set to show tooltips on hover) | `LineTooltip ` | no | - |

Static exposed functions
| Name  | Returned Type | Parameters | Examples |
| ------------- | ------------- | ------------- | ------------- |
| CreateBarChartModel | `BarChartOptions` | `labels: string[], seriesData: Map<string, number[]>, yAxisPosition? : string, seriesColors?: string[]` | `labels`: list of labels for the X axis ; `seriesData`: Dictionary containing the configuration of the series of values to be shown for the bar chart; `yAxisPosition` : String that determines the position of the Y axis (left or right); `seriesColors`: Allows you to define the colors to be used for each series of the chart. The array is positional so the first color will be attributed to the first series, the second color to the second series etc ... |

#### PieChartOption Model
Describes the model for configuring PIE type charts
| Property  | Description | Type | Required | Examples |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| tooltip | object that defines the trigger property for the tooltip configuration  | `any` | no | `View use cases 3` |
| legend | object that defines the properties orient e left for the legend configuration  | `any` | no | `View use cases 3` |
| series | Defines the series data for the chart  | `PieSeries[]` | no | `View use cases 3` |
| isDoughnut | If TRUE then show a DoughnutChart else show a PieChart  | `boolean` | no | `Default value: false` |

Static exposed functions
| Name  | Returned Type | Parameters | Examples |
| ------------- | ------------- | ------------- | ------------- |
| CreatePieChartModel | `PieChartOptions` | `seriesData: Map<string, PieSeriesValue[]>, isDoughnut: boolean` | `seriesData`: Dictionary containing as many keys as there are different series to show in the chart, for each series it is necessary to indicate a list of values that make up the data of the same series; `isDoughnut`: Allows you to decide whether to show a pie chart or a doughnut chart  |

#### PieSeries Model
Describes the model for configuring PIE series charts
| Property  | Description | Type | Required | Examples |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| name | Name of the pie chart serie  | `string` | yes | `View use cases` |
| type | Type of the pie chart serie (set by default to the 'pie' value)  | `string` | yes | `View use cases 3` |
| data | array of values that make up the single series of the graph  | `PieSeriesValue[]` | no | `View use cases 3` |
| radius | Default set with the value 50%  | `string` | yes | `View use cases 3` |

#### PieSeriesValue Model
Describes the model for configuring PIE series charts
| Property  | Description | Type | Required | Examples |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| name | Name of value of the serie  | `string` | yes | `View use cases` |
| value | Single value of the serie  | `number` | yes | `View use cases 3` |
| itemStyle | Define the color to apply for the value of the chart (default NULL: use the standard color)  | `PieSeriesValueColor` | no | An object of type PieSeriesValueColor with property color. The 'color' property is a string that can contain RGB or rgba function |

#### RadarChartOption Model
Describes the model for configuring RADAR type charts
| Property  | Description | Type | Required | Examples |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| legend | Define the configuration for the chart legend  | `RadarLegendData` | no |  `View use cases 4` |
| tooltip | Define the configuration for the chart tooltip (automatically set to show tooltips on hover) | `RadarTooltip` | no |  `View use cases 4` |
| radar | Define the indicator marker configuration for the chart | `RadarIndicator[]` | yes |  `View use cases 4` |
| series | Define the series for the chart | `RadarSeries[]` | yes |  `View use cases 4` |

Static exposed functions
| Name  | Returned Type | Parameters | Examples |
| ------------- | ------------- | ------------- | ------------- |
| CreateRadarChartModel | `RadarChartOption` | `legendLabels: string[]; radars: Map<string,RadarIndicatorData[]> ;seriesData: Map<string, PieSeriesValue[]>; radiusChartPercentage: string,showTooltip: boolean , fillChartArea: boolean ` | `legendLabels`: List of labels to be used as chart legend. If the char contains only one radar then the array must contain only one element otherwise it will contain one for each different radar;`radars`: Dictionary containing the configurations of all the radars to be shown in the chart. Each node of the dictionary must contain as a key the name to be attributed to the radar and the configuration of the radar indicators;`seriesData`: Dictionary containing the configuration of the series of values to be shown for each configured radar; `radiusChartPercentage`: Indicates the scaling percentage of the radars (default value = 75%); `showTooltip`: If TRUE then configure the tooltips for the chart (in the tooltip will be shown the values of the radar series on which you hover with the mouse); `fillChartArea`: If TRUE then for each radar it applies a style that will allow you to color the entire area drawn in the radar; |

#### RadarLegendData Model
| Property  | Description | Type | Required | Examples |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| data | Define the chart legend | `string[]` | yes |  `View use cases 4` |
| left | Define the chart legend position | `string` | yes |  `Default value: center` |

#### RadarIndicatorData Model
| Property  | Description | Type | Required | Examples |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| text | Define the indicator label | `string` | yes |  `View use cases 4` |
| max | Define the indicator max value | `number` | yes |  `View use cases 4` |

#### RadarSeries Model
| Property  | Description | Type | Required | Examples |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| name | The name of the chart | `string` | no |  `View use cases 4` |
| type | The type of the chart (default setted on "radar" value) | `string` | yes |  `View use cases 4` |
| data | The array of values for the serie | `RadarSeriesData[]` | yes |  `View use cases 4` |

#### RadarSeriesData Model
| Property  | Description | Type | Required | Examples |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| name | The name of the chart serie | `string` | no |  `View use cases 4` |
| value | The array of values for the serie | `any[]` | yes |  `View use cases 4` |


#### GaugeChartOption Model
| Property  | Description | Type | Required | Examples |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| tooltip | The tooltip configuration for gauge chart (an object that contains the formatter property (of type string) necessary to format the informative tooltip of the chart (defualt formatter: "{a} <br/> {b}: {c}") | `any` | no |  `View use cases 5` |
| series | The chart series data | `GaugeChartSeries[]` | yes |  `View use cases 5` |

Static exposed functions
| Name  | Returned Type | Parameters | Examples |
| ------------- | ------------- | ------------- | ------------- |
| CreateGaugeChartModel | `GaugeChartOptions` | `seriesData: Map<string, GaugeChartData[]>` | `seriesData`: Dictionary containing the configuration of the series of values to be shown for the gauge chart  |

#### GaugeChartSeries Model
| Property  | Description | Type | Required | Examples |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| name | The name of the chart serie | `string` | yes |  `View use cases 5` |
| type | The type of the chart serie (default setted on 'gauge' value) | `string` | yes |  `View use cases 5` |
| detail | The gauge chart detail | `GaugeChartDetailData | yes |  `View use cases 5` |
| data | The data of the series | `GaugeChartData[]` | yes |  `View use cases 5` |

#### GaugeChartDetailData Model
| Property  | Description | Type | Required | Examples |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| formatter | The formatter configuration for the gauge tooltip (default value: "{a} <br/>{b} : {c}") | `string` | yes |  `View use cases 5` |

#### GaugeChartData Model
| Property  | Description | Type | Required | Examples |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| value | The value of the chart serie | `number` | yes |  `View use cases 5` |
| name | The title of the chart serie | `string` | yes |  `View use cases 5` |

## Use cases
### Use Example in class :

Define selector in html
```html
<eqp-dashboard [configs]="chartConfigs"></eqp-dashboard>
```

Define locale in the app.component.ts in order to set it for all the charts (the default value is 'it-IT')
```js
    constructor(private eqpDashboardService : EqpDashboardService) { }
    
    ngOnInit(): void { }

    this.eqpDashboardService.setLocale('en-US')
```

CASE 1: Define variables and object to use to display a basic Line Chart Widget
```js   

    chartConfigs: WidgetConfig[];

    let lineChartConfig: WidgetConfig = new WidgetConfig();
    lineChartConfig.WidgetID = "Dashboard_LineChart";
    lineChartConfig.WidgetTitle = "Line Chart"
    lineChartConfig.WidgetSizeClass = WidgetSizeEnum.XS;
    lineChartConfig.WidgetType = WidgetTypeEnum.LINE_CHART;
    let lineSeriesData: Map<string, number[]> = new Map<string,number[]>();
    lineSeriesData.set("Serie 1", [10,25,35]);
    lineChartConfig.ChartOptions = LineChartOption.CreateLineChartModel(["Valore 1", "Valore 2", "Valore 3"], lineSeriesData);

    this.chartConfigs.push(lineChartConfig);

```

CASE 2: Define variables and object to use to display a basic Bar Chart Widget
```js   

    chartConfigs: WidgetConfig[];

    let barChartConfig: WidgetConfig = new WidgetConfig();
    barChartConfig.WidgetID = "Dashboard_BarChart";
    barChartConfig.WidgetTitle = "Bar Chart"
    barChartConfig.WidgetSizeClass = WidgetSizeEnum.XS;
    barChartConfig.WidgetType = WidgetTypeEnum.BARS_CHART;
    let barSeriesData: Map<string, number[]> = new Map<string,number[]>();
    barSeriesData.set("Serie 1", [10,25,35]);
    barChartConfig.ChartOptions = BarChartOption.CreateBarChartModel(["Valore 1", "Valore 2", "Valore 3"], barSeriesData);

    this.chartConfigs.push(barChartConfig);

```

CASE 3: Define variables and object to use to display a basic Pie Chart Widget
```js   

    
    chartConfigs: WidgetConfig[];

    let pieChartConfig: WidgetConfig = new WidgetConfig();
    pieChartConfig.WidgetID = "Dashboard_Pie";
    pieChartConfig.WidgetTitle = "Pie Chart"
    pieChartConfig.WidgetSizeClass = WidgetSizeEnum.XS;
    pieChartConfig.WidgetType = WidgetTypeEnum.PIE_CHART;
    let pieSeries: Map<string, PieSeriesValue[]> = new Map<string, PieSeriesValue[]>();
    pieSeries.set("Serie 1", [{name: "A", value: 10},{name: "B", value: 25},{name: "C", value: 37},{name: "D", value: 42}]);
    pieChartConfig.ChartOptions = PieChartOption.CreatePieChartModel(pieSeries);
    
    this.chartConfigs.push(pieChartConfig);

```

CASE 4: Define variables and object to use to display a basic Radar Chart Widget
```js   

    chartConfigs: WidgetConfig[];

    let radarChartConfig: WidgetConfig = new WidgetConfig();
    radarChartConfig.WidgetID = "Dashboard_Radar";
    radarChartConfig.WidgetTitle = "Radar chart"
    radarChartConfig.WidgetSizeClass = WidgetSizeEnum.XS;
    radarChartConfig.WidgetType = WidgetTypeEnum.RADAR_CHART;

    let seriesName: string = "Serie 1";
    let indicators: Map<string, RadarIndicatorData[]> = new Map<string,RadarIndicatorData[]>();
    indicators.set(seriesName, [{ text: "Valore 1", max: 100}, { text: "Valore 2", max: 100}, { text: "Valore 3", max: 100}, { text: "Valore 4", max: 100}, { text: "Valore 5", max: 100}]);

    let seriesData: Map<string, RadarSeriesData[]> = new Map<string,RadarSeriesData[]>();
    seriesData.set(seriesName, [{ name: "Serie 1", value: [10,25,35,40,80] }]);
    radarChartConfig.ChartOptions = RadarChartOption.CreateRadarChartModel([seriesName], indicators, seriesData);

    this.chartConfigs.push(radarChartConfig);

```

CASE 5: Define variables and object to use to display a basic Gauge Chart Widget
```js   

    
    chartConfigs: WidgetConfig[];

    let gaugeChartConfig: WidgetConfig = new WidgetConfig();
    gaugeChartConfig.WidgetID = "Dashboard_Gauge";
    gaugeChartConfig.WidgetTitle = "Gauge chart"
    gaugeChartConfig.WidgetSizeClass = WidgetSizeEnum.XS;
    gaugeChartConfig.WidgetType = WidgetTypeEnum.GAUGE_CHART;

    let gaugeSeries: Map<string, GaugeChartData[]> = new Map<string, GaugeChartData[]>();
    gaugeSeries.set("Valore 1", [ { name: "Km/h", value: 50}])
    gaugeChartConfig.ChartOptions = GaugeChartOption.CreateGaugeChartModel(gaugeSeries)

    this.chartConfigs.push(gaugeChartConfig);

```

CASE 6: Define the variables and object to use to display Chart Widget by calling a custom endpoint to fetch Chart Data
```js   

    @ViewChild('externalTemplate', { static: true }) externalTemplate: TemplateRef<any>;

    constructor() {

    }

    ngOnInit() {
      this.configureWidget();
    }

    configureWidget() {
      endPointChart: WidgetConfig = new WidgetConfig();
      chartConfigs: WidgetConfig[];

      this.endPointChart.WidgetTitle = "EndPoint Chart";
      this.endPointChart.WidgetType = WidgetTypeEnum.BARS_CHART;
      this.endPointChart.WidgetSizeClass = WidgetSizeEnum.XS;
      this.endPointChart.WidgetID = 'ID_EndPointChartTest002';
    
      this.endPointChart.EndPointData = {
        Url: "YOUR_ENDPOINT_URL",
        Token: "TOKEN",
        RequestMethod: RequestMethodEnum.GET,
        Params: {
          { 
            PropertyLabel: "Company", 
            PropertyName: "FK_Company", 
            PropertyValue: null, 
            PropertyType: EndPointDataParamType.CVL, 
            CvlConfig: EndpointParamCvlConfig.CreateEndpointParamCVLConfig(null, [{ID:1, Label: "Azienda 1"}, {ID:2, Label: "Azienda 2"}], "ID","Label", false, true, true, null, false),
          },
          { PropertyLabel: "Data inizio", PropertyName: "StartDate", PropertyValue: data1, PropertyType: EndPointDataParamType.DATE },
          { PropertyLabel: "Data fine", PropertyName: "EndDate", PropertyValue: date2, PropertyType: EndPointDataParamType.DATE },
          { PropertyLabel: "Filtro testuale", PropertyName: "Text", PropertyValue: null, PropertyType: EndPointDataParamType.TEXT },
          { PropertyLabel: "Filtro numerico", PropertyName: "Number", PropertyValue: null, PropertyType: EndPointDataParamType.NUMBER },
          { PropertyLabel: "External", PropertyName: "ExternalInput", PropertyValue: null, PropertyType: EndPointDataParamType.EXTERNAL_TEMPLATE, ExternalTemplateConfig: this.externalTemplate, ParamClass: "col-12" }
        }
      }

      this.chartConfigs = [
        this.endPointChart
      ];
    }
    
    testExternalTemplate(widget: WidgetConfig) {
      //DO SOMETHING
      //IF YOU NEED TO UPDATE THE WIDGET YOU NEED TO INVOKE runEndPointCall METHOD FROM EqpDashboardComponent (use ViewChild to access it)
    }
```

```html
  <ng-template #externalTemplate let-widget="widget" let-parameter="parameter">
      <button (click)="testExternalTemplate(widget)">Click me</button>
  </ng-template>
```


CASE 7: Define a WidgetConfig to display a component dynamically
```js   

    config: WidgetConfig = new WidgetConfig();
    chartConfigs: WidgetConfig[];
    
    //On your app.component.ts register the selector of the component you want to inject into the dashboard
    //Use this instruction
    ComponentMapperService.register("app-my-component", MyComponent);

    this.config.CustomComponentSelector = "app-my-component";
    this.config.WidgetSizeClass = WidgetSizeEnum.XS;
    this.config.WidgetTitle = 'Test Component 001';
    this.config.WidgetID = 'ID_TestComponent003';

    this.chartConfigs = [
      this.config
    ];

```

CASE 8: Define a WidgetConfig to display simple statistical data
```js   

    chartConfigs: WidgetConfig[];

    let statisticConfig: WidgetConfig = new WidgetConfig();
    statisticConfig.WidgetTitle = "Statistic Widget";
    statisticConfig.WidgetSizeClass = WidgetSizeEnum.XS;
    statisticConfig.WidgetID = 'StatisticWidget_Dashboard';
    statisticConfig.WidgetType = WidgetTypeEnum.STATISTIC_CHART;
    statisticConfig.StatisticWidget = [
      { Icon: "check_circle", Label: "Completati", Value: 70, MaxValue: 100 }
    ]

    this.chartConfigs.push(statisticConfig);

```

CASE 9: Define a WidgetConfig to display CUSTOM_CHART
```js   

    chartConfigs: WidgetConfig[];

    let customConfig: WidgetConfig = new WidgetConfig();
    customConfig.WidgetTitle = "Custom Widget";
    customConfig.WidgetSizeClass = WidgetSizeEnum.XS;
    customConfig.WidgetID = 'CustomWidget_Dashboard';
    customConfig.WidgetType = WidgetTypeEnum.CUSTOM_CHART;

    //According to the echarts library, it is possible to configure the chart option object with the information of the desired chart.
    //If an endpoint is used, the json ChartOption will be returned by the server.
    customConfig.ChartOptions = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line'
      }]
    }

    this.chartConfigs.push(statisticConfig);

```

## Credits
This library has been developed by EqProject SRL, for more info contact: info@eqproject.it
