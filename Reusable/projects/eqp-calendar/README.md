Table of contents
=================
 * [Getting started](#getting-started)
 * [API](#api)
 * [Use cases](#use-cases)
 * [Credits](#credits)

## Required
- [x] @fullcalendar/angular v5
- [x] @fullcalendar/daygrid v5
- [x] @fullcalendar/interaction v5
- [x] @fullcalendar/timegrid v5


## Getting started
This package is a wrapper for the v5 FullCalendar calendar component. It extends the basic functionalities of the undelying package simplifying the configuration process through exposing a series of input.

##### Notes
It is based on FullCalendar v5.10.0, go to this [link](https://fullcalendar.io/docs) to read the official documentation.


### Step 1: Install `eqp-calendar`:

#### NPM
```shell
npm install --save @eqproject/eqp-calendar
```

### Step 2: 
#### Import EqpCalendarModule:
```js
import { EqpCalendarModule } from '@eqproject/eqp-calendar';

@NgModule({
  declarations: [AppComponent],
  imports: [
    EqpCalendarModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

  
## API
### Inputs
| Input  | Type | Default | Required | Description |
| ---------- | ---------- | ---------- | ---------- | ---------- |
| [EventList] | `Array<IEvent>` | `new Array<IEvent>()` | no | Contains the list of events to display on the calendar. |
| [CustomStyle] | `any` | `{ 'text-transform': 'capitalize' }` | no | Style to apply to the `full-calendar` tag through [ngStyle] attribute. |
| [InitialView] | `string` | `"dayGridMonth"` | no | Sets the starting view mode of the calendar. |
| [FirstDay] | `number` | `1` | no | Sets the first day of week. |
| [ContentHeight] | `string` | `null` | no | Sets the height of the events container cell.  |
| [Locale] | `string` | `"it-IT"` | no | Sets the locale of the component and manages the translations. |
| [MonthButtonText] | `string` | `"Mese"` | no | Sets the label fot the month view mode button. |
| [WeekButtonText] | `string` | `"Settimana"` | no | Sets the label fot the week view mode button. |
| [DayButtonText] | `string` | `"Giorno"` | no | Sets the label fot the daily view mode button. |
| [TodayButtonText] | `string` | `"Oggi"` | no | Sets the label fot the button to navigate to today's date. |
| [ListButtonText] | `string` | `"Lista"` | no | Sets the label fot the month view mode button. |
| [HeaderToolbarStart] | `string` | `"title"` | no | Sets what to display in the LEFT section of the header toolbar of the full-calendar component (see notes below for more details). |
| [HeaderToolbarCenter] | `string` | `"dayGridMonth,timeGridWeek,timeGridDay"` | no | Sets what to display in the CENTER section of the header toolbar of the full-calendar component (see notes below for more details). |
| [HeaderToolbarEnd] | `string` | `"today prev,next"` | no | Sets what to display in the RIGHT section of the header toolbar of the full-calendar component (see notes below for more details). |
| [AllDayText] | `string` | `"Tutto il giorno"` | no | Sets the column name for the all-day column in the weekly and daily view mode. |
| [EventOrder] | `Function` | `null` | no | Sets the function to sort events. It is similar to the `.sort()` typescript function and has to return `-1`, `0` or `1`. |


##### Notes
The `HeaderToolbarStart`, `HeaderToolbarCenter` and `HeaderToolbarEnd` sets what to display in each portion of the header. Each piece you want to display needes to be specified in one of the input and to separate them from one another in the same section you need to use a space or a comma. Names separated with space will have some margin between them, using a comma the pieces will be rendered attached.
Open this [link](https://fullcalendar.io/docs/headerToolbar) to read the official documentation.


### Outputs
| Output  | Event Arguments | Required | Description |
| ------------- | ------------- | ------------- | ------------- |
| (OnViewDateChange) | `ViewDateChangeEvent` | no | Invoked each time the displayed date range is changed, either if the user changes the view mode or navigates between dates. Returns an object containig the new start and end dates anche the current view mode. |
| (OnDateClick) | `Date` | no | Invoked when the user clicks on a date or a time slot. Returns the selected date. |
| (OnEventClick) | `IEvent` | no | Invoked when the user clicks on an event. Returns the selected `IEvent` object. |

### Interfaces and Models used

#### IEvent Interface
| Property  | Type | Description | Examples |
| ------------- | ------------- | ------------- | ------------- |
| start? | `Date` | Sets when an event begins. | - |
| end? | `Date` | Sets when an event ends. If not specified the event will be marked as "all-day". | - |
| startStr? | `string` | An ISO8601 string representation of the start date. If the event is all-day, there will not be a time part. | - |
| endStr? | `string` | An ISO8601 string representation of the end date. If the event is all-day, there will not be a time part. | - |
| id? | `string` | A unique identifier of an event. | - |
| groupId? | `string` | Events that share a `groupId` will be dragged and resized together automatically. | - |
| allDay? | `boolean` | Determines if the event is shown in the “all-day” section of relevant views. In addition, if true the time text is not displayed with the event. | - |
| title? | `string` | The text that will appear on an event. | - |
| url? | `string` | A URL that will be visited when this event is clicked by the user. For more information on controlling this behavior, see the [eventClick](https://fullcalendar.io/docs/eventClick) callback. | - |
| display? | `string` | The rendering type of this event. Can be 'auto', 'block', 'list-item', 'background', 'inverse-background', or 'none'. See [eventDisplay](https://fullcalendar.io/docs/eventDisplay). | - |
| startEditable? | `boolean` | The value overriding the [eventStartEditable](https://fullcalendar.io/docs/eventStartEditable) setting for this specific event. | - |
| durationEditable? | `boolean` | The value overriding the [eventDurationEditable](https://fullcalendar.io/docs/eventDurationEditable) setting for this specific event. | |
| constraint? | `string` | The [eventConstraint](https://fullcalendar.io/docs/eventConstraint) override for this specific event. | - |
| overlap? | `boolean` |The value overriding the [eventOverlap](https://fullcalendar.io/docs/eventOverlap) setting for this specific event. If false, prevents this event from being dragged/resized over other events. Also prevents other events from being dragged/resized over this event. Does not accept a function. | - |
| backgroundColor? | `string` | The [eventBackgroundColor](https://fullcalendar.io/docs/eventBackgroundColor) override for this specific event. Sets the background color of the event. | - |
| borderColor? | `string` | The [eventBorderColor](https://fullcalendar.io/docs/eventBorderColor) override for this specific event. Sets the border color of the event. | - |
| textColor? | `string` | The [eventTextColor](https://fullcalendar.io/docs/eventTextColor) override for this specific event. Sets the text color of the event. | - |
| classNames? | `Array<string>` | An array of strings like [ 'myclass1', myclass2' ]. Determines which HTML classNames will be attached to the rendered event. | - |
| extendedProps? | `any` | A plain object holding miscellaneous other properties specified during parsing. Receives properties in the explicitly given extendedProps hash as well as other non-standard properties. For example if the event is based on a different object you can store the source here.  | - |

###### NOTES: 
This interface is based on the FullCalendar Event Object. To read the official documentation click [here](https://fullcalendar.io/docs/event-object).

#### ViewDateChangeEvent Model
| Property  | Type | Description | Examples |
| ------------- | ------------- | ------------- | ------------- |
| dateStart | `Date` | Represents the starting date displayed in current view mode. | - |
| dateEnd | `Date` | Represents the ending date displayed in current view mode. | - |
| viewMode | `string` | Represent the current view mode. | - |

## Use cases
### Use Example in class :

```html
<eqp-calendar [EventList]="eventList" [CustomStyle]="customStyle" [InitialView]="initialView" [FirstDay]="firstDay" [Locale]="locale"
    [EventOrder]="eventOrder" (OnViewDateChange)="onViewDateChange($event)" (OnDateClick)="onDateClick($event)"
    (OnEventClick)="onEventClick($event)">
</eqp-calendar>
```

```js   
    import { ViewDateChangeEvent } from '@eqproject/eqp-calendar';
    import { IEvent } from '@eqproject/eqp-calendar';

    eventList: Array<IEvent> = new Array<IEvent>();

    customStyle: any = { 'text-transform': 'capitalize' };
    initialView: string = "dayGridMonth";
    firstDay: number = 1;
    locale: string = "it-IT";
  
    // Example of a custom eventOrder function:
    eventOrder(eventA: IEvent, eventB: IEvent) {
        if (eventA && eventB)
            return (eventA.extendedProps.Priority > eventB.extendedProps.Priority) ? 1 : ((eventB.extendedProps.Priority > eventA.extendedProps.Priority) ? -1 : 0);
        else
            return 0;
    }
    
    onViewDateChange(event: ViewDateChangeEvent) {
        // TODO
    }

    onDateClick(event: Date) {
        // TODO
    }

    onEventClick(event: IEvent) {
        // TODO
    }
```


## Credits
This library has been developed by EqProject SRL, for more info contact: info@eqproject.it