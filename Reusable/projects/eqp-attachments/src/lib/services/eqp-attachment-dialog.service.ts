import { Injectable } from "@angular/core";
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class EqpAttachmentDialogService {

    constructor() { }

    /**
     * Mostra uno sweet alert di tipo ERROR con il messaggio passato come parametro.
     * @param message Messaggio d'errore da mostrare nello sweetalert
     * @param title Titolo dello sweetalert (di default mostra 'Errore')
     */
    static Error(message: string | string[], title: string = null) {
        let currentTitle = title != null ? title : 'Errore';
        if (Array.isArray(message)) {
            currentTitle = title != null ? title : 'Errore';
            let htmlErrors: string = message.join("<br>");
            Swal.fire({
                title: currentTitle,
                html: htmlErrors,
                icon: 'error'
            });
        }
        else {
            Swal.fire(currentTitle, message, 'error');
        }
    }


    /**
     * Mostra uno sweetalert di tipo CONFIRM con il messaggio passato come parametro e se viene premuto
     * CONFERMA lancia la funzione di callback passata come parametro
     * @param message Messaggio da mostrare nello sweetalert
     * @param title Titolo dello sweetalert (di default mostra 'Info')
     */
    static Confirm(message: string | string[], confirmCallback: any, isWarning: boolean = false, title: string = null, customWidth: string = null) {

        let currentTitle = title != null ? title : 'Sei sicuro di voler procedere?';
        if (Array.isArray(message)) {
            let htmlErrors: string = message.join("<br>");
            Swal.fire({
                title: currentTitle,
                html: htmlErrors,
                width: customWidth ? customWidth : '32rem',
                icon: !isWarning ? 'question' : 'warning',
                showCancelButton: true,
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then((result) => {
                if (result.value && confirmCallback) {
                    confirmCallback();
                }
            });
        }
        else {
            Swal.fire({
                title: currentTitle,
                text: message,
                width: customWidth ? customWidth : '32rem',
                icon: !isWarning ? 'question' : 'warning',
                showCancelButton: true,
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then((result) => {
                if (result.value && confirmCallback) {
                    confirmCallback();
                }
            })
        }
    }

    /**
     * Mostra uno sweetalert di tipo INFO con il messaggio passato come parametro
     * @param message Messaggio da mostrare nello sweetalert
     * @param title Titolo dello sweetalert (di default mostra 'Info')
     */
    static Info(message: string, title: string = null, isToast: boolean = null) {
        let currentTitle = title != null ? title : "Informazione:";
        Swal.fire(currentTitle, message, 'info');
    }

    /**
     * Mostra uno sweetalert di tipo WARNING con il messaggio passato come parametro
     * @param message Messaggio da mostrare nello sweetalert
     * @param title Titolo dello sweetalert (di default mostra 'Attenzione!')
     */
    static Warning(message: string | string[], title: string = null, isToast: boolean = null) {
        let currentTitle = title != null ? title : "Attenzione!";

        if (Array.isArray(message)) {
            let htmlWarnings: string = message.join("<br>");
            Swal.fire({
                title: currentTitle,
                html: htmlWarnings,
                icon: 'warning'
            });
        } else {
            Swal.fire(currentTitle, message, 'warning');
        }
    }
}
