import { IEvent } from './../../../projects/eqp-calendar/src/lib/interfaces/IEvent';
import { Component, OnInit } from '@angular/core';
import { ViewDateChangeEvent } from 'projects/eqp-calendar/src/lib/models/viewDateChangeEvent';
// import { IEvent } from '@eqproject/eqp-calendar';

@Component({
  selector: 'app-test-eqp-calendar',
  templateUrl: './test-eqp-calendar.component.html',
  styleUrls: ['./test-eqp-calendar.component.scss']
})
export class TestEqpCalendarComponent implements OnInit {

  eventList: Array<IEvent> = new Array<IEvent>();

  customStyle: any = { 'text-transform': 'capitalize' };
  initialView: string = "dayGridMonth";
  firstDay: number = 1;
  contentHeight: string = null;
  locale: string = "it-IT";
  monthButtonText: string = "Mese";
  weekButtonText: string = "Settimana";
  dayButtonText: string = "Giorno";
  todayButtonText: string = "Oggi";
  listButtonText: string = "Lista";
  headerToolbarStart: string = 'title';
  headerToolbarCenter: string = "dayGridMonth,timeGridWeek,timeGridDay";
  headerToolbarEnd: string = "today prev,next";
  allDayText: string = "Tutto il giorno";
  // eventOrder: Function = null;
  // eventOrder: Function = (eventA:any, eventB:any) => { return (eventA.extendedProps.Priority > eventB.extendedProps.Priority) ? -1 : ((eventB.extendedProps.Priority > eventA.extendedProps.Priority) ? 1 : 0); };

  constructor() { }

  ngOnInit(): void {
    for (let i = 0; i < 5; i++) {
      let newEvent: IEvent = {
        start: new Date(new Date().getTime() + (i * 86400000)),
        id: (i + 1).toString(),
        allDay: true,
        title: "Event_" + i,
        display: "Display_Event_" + i,
        backgroundColor: "#28a745",
        borderColor: "#28a745",
        textColor: "#fff",
        extendedProps: {
          CustomObjectPropery1: "CustomObjectPropery_1_" + i,
          CustomObjectPropery2: "CustomObjectPropery_2_" + i,
          Priority: 0
        }
      };
      this.eventList.push(newEvent);
    }

    setTimeout(() => {
      for (let i = 0; i < 2; i++) {
        let newEvent: IEvent = {
          start: new Date(new Date().getTime() - (2 * 1000 * 60 * 60 * 24)),
          end: new Date(new Date().getTime() - ((2 * 1000 * 60 * 60 * 24) - ((i + 3) * 1000 * 60 * 60))),
          id: "5",
          allDay: false,
          title: "Evento_Ritardato_" + i,
          display: "Display_Evento_Ritardato",
          backgroundColor: "#ffc107",
          borderColor: "#ffc107",
          textColor: "#343a40",
          extendedProps: {
            CustomObjectPropery1: "CustomObjectPropery_1_Evento_Ritardato",
            CustomObjectPropery2: "CustomObjectPropery_2_Evento_Ritardato",
            Priority: 1000 - (i * 10)
          }
        };
        this.eventList = this.eventList.concat([newEvent]);
      }
    }, 5000);
  }

  onViewDateChange(event: ViewDateChangeEvent) {
    console.log(event);
  }

  onDateClick(event: Date) {
    console.log(event);
  }

  onEventClick(event: IEvent) {
    console.log(event);
  }

  eventOrder(eventA: IEvent, eventB: IEvent) {
    if (eventA && eventB)
      return (eventA.extendedProps.Priority > eventB.extendedProps.Priority) ? 1 : ((eventB.extendedProps.Priority > eventA.extendedProps.Priority) ? -1 : 0);
    else
      return 0;
  }

}
