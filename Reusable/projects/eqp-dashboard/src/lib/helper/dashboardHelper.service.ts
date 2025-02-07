import { EventEmitter, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class DashboardHelperService {

    /**
     * Variabile di appoggio che restituirà le informazioni alla chiusura della lookup in aggiunta (es: ID utente appena salvato)
     */
    checkWidgetLoading: EventEmitter<WidgetLoadingStatus> = new EventEmitter<WidgetLoadingStatus>();

    constructor() { }


}

export class WidgetLoadingStatus {
    public WidgetID: string;
    public IsLoading: boolean;
}



