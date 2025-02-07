import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import { IEvent } from './interfaces/IEvent';
import { ViewDateChangeEvent } from './models/viewDateChangeEvent';

@Component({
  selector: 'eqp-calendar',
  templateUrl: './eqp-calendar.component.html',
  styleUrls: ['./eqp-calendar.component.scss'],
})
export class EqpCalendarComponent implements OnInit, AfterViewInit, OnChanges {

  @Input("EventList") eventList: Array<IEvent> = new Array<IEvent>();

  @Input("CustomStyle") customStyle: any = { 'text-transform': 'capitalize' };
  @Input("InitialView") initialView: string = "dayGridMonth";
  @Input("FirstDay") firstDay: number = 1;
  @Input("ContentHeight") contentHeight: string = null;
  @Input("Locale") locale: string = "it-IT";
  @Input("MonthButtonText") monthButtonText: string = "Mese";
  @Input("WeekButtonText") weekButtonText: string = "Settimana";
  @Input("DayButtonText") dayButtonText: string = "Giorno";
  @Input("TodayButtonText") todayButtonText: string = "Oggi";
  @Input("ListButtonText") listButtonText: string = "Lista";
  @Input("HeaderToolbarStart") headerToolbarStart: string = 'title';
  @Input("HeaderToolbarCenter") headerToolbarCenter: string = "dayGridMonth,timeGridWeek,timeGridDay";
  @Input("HeaderToolbarEnd") headerToolbarEnd: string = "today prev,next";
  @Input("AllDayText") allDayText: string = "Tutto il giorno";
  @Input("EventOrder") eventOrder: Function = null;

  @Output("OnViewDateChange") onViewDateChange: EventEmitter<ViewDateChangeEvent> = new EventEmitter<ViewDateChangeEvent>();
  @Output("OnDateClick") onDateClick: EventEmitter<Date> = new EventEmitter<Date>();
  @Output("OnEventClick") onEventClick: EventEmitter<IEvent> = new EventEmitter<IEvent>();

  calendarOptions: CalendarOptions = {};
  calendarApi: Calendar;
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  constructor() { }

  ngOnInit(): void {
    this.configureCalendar();
  }

  ngAfterViewInit(): void {
    if (this.calendarComponent)
      this.calendarApi = this.calendarComponent.getApi();
    setTimeout(() => {
      this.calendarApi.updateSize();
    }, 190);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventList'] != undefined && changes['eventList'].firstChange == false && JSON.stringify(changes['eventList'].currentValue) != JSON.stringify(changes['eventList'].previousValue)) {
      this.calendarOptions.events = this.eventList;
      this.calendarApi.refetchEvents();
    }
  }

  configureCalendar() {
    this.calendarOptions = {
      initialView: this.initialView,
      firstDay: this.firstDay,
      contentHeight: this.contentHeight,
      locale: this.locale,
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      customButtons: {
        today: {
          text: this.todayButtonText,
          click: (event) => {
            this.calendarApi.today();
            this.viewDateChange();
          }
        },
        prev: {
          click: (event) => {
            this.calendarApi.prev();
            this.viewDateChange();
          }
        },
        next: {
          click: (event) => {
            this.calendarApi.next();
            this.viewDateChange();
          }
        },
        dayGridMonth: {
          text: this.monthButtonText,
          click: (event) => {
            this.calendarApi.changeView("dayGridMonth");
            this.viewDateChange();
          }
        },
        timeGridWeek: {
          text: this.weekButtonText,
          click: (event) => {
            this.calendarApi.changeView("timeGridWeek");
            this.viewDateChange();
          }
        },
        timeGridDay: {
          text: this.dayButtonText,
          click: (event) => {
            this.calendarApi.changeView("timeGridDay");
            this.viewDateChange();
          }
        }
      },
      headerToolbar: {
        start: this.headerToolbarStart,
        center: this.headerToolbarCenter,
        end: this.headerToolbarEnd,
      },
      buttonText: {
        month: this.monthButtonText,
        week: this.weekButtonText,
        day: this.dayButtonText,
        today: this.todayButtonText,
        list: this.listButtonText
      },
      allDayText: this.allDayText,
      eventClick: (event) => { this.eventClick(event) },
      dateClick: this.dateClick.bind(this), // bind is important!
      eventOrder: (eventA: any, eventB: any) => { return ((eventA && eventB && this.eventOrder) ? this.eventOrder(eventA, eventB) : 0); }
    };

    this.calendarOptions.events = this.eventList;
    if (this.calendarApi)
      this.calendarApi.refetchEvents();
  }

  viewDateChange() {
    let newRange: ViewDateChangeEvent = {
      dateStart: this.calendarApi.view.currentStart,
      dateEnd: this.calendarApi.view.currentEnd,
      viewMode: this.calendarApi.view.type
    }
    this.onViewDateChange.emit(newRange);
  }

  dateClick(event) {
    this.onDateClick.emit(event.date);
  }

  eventClick(event) {
    this.onEventClick.emit(event.event);
  }
}
