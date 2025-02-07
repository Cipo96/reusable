
export interface IEvent {
    start?: Date;
    end?: Date;
    startStr?: string;
    endStr?: string;
    id?: string;
    groupId?: string;
    allDay?: boolean;
    title?: string;
    url?: string;
    display?: string;
    startEditable?: boolean;
    durationEditable?: boolean;
    constraint?: any;
    overlap?: boolean;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    classNames?: Array<string>;
    extendedProps?: any;
}