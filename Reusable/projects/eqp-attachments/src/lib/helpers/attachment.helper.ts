import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class AttachmentHelperService {

    static readonly imageMimeTypes: string[] = ["image/bmp", "image/gif", "image/jpeg", "image/tiff", "image/png"];

    static readonly fileExtensionIcon: any = {
        "txt": "fas fa-file-text",
        "pdf": "fas fa-file-pdf",
        "doc": "fas fa-file-word",
        "docx": "fas fa-file-word",
        "xls": "fas fa-file-excel",
        "xlsx": "fas fa-file-excel",
        "jpg": "fas fa-file-image",
        "jpeg": "fas fa-file-image",
        "png": "fas fa-file-image",
        "bmp": "fas fa-file-image",

        "mkv": "fas fa-file-video",
        "flv": "fas fa-file-video",
        "gif": "fas fa-file-video",
        "gifv": "fas fa-file-video",
        "avi": "fas fa-file-video",
        "wmv": "fas fa-file-video",
        "mp4": "fas fa-file-video",
        "m4p": "fas fa-file-video",
        "m4v": "fas fa-file-video",
        "mpg": "fas fa-file-video",
        "mp2": "fas fa-file-video",
        "mpeg": "fas fa-file-video",
        "mpe": "fas fa-file-video",
        "mpv": "fas fa-file-video",
        "m2v": "fas fa-file-video",
        "3gp": "fas fa-file-video",
        "3g2": "fas fa-file-video",

        "mp3": "fas fa-file-audio",
    };

    static readonly dropboxCredentials: any = { 
        url: 'https://www.dropbox.com/static/api/2/dropins.js', 
        apiKey: "aj2xjzms4dl1sch",
        accessToken: "l.BbasuuUFe42u-fXvpmDEteNkGMH-yPTxD79JhRjkBcR94Fm2QLgIjEETvx8TY36HsQQsIe24ofcNjYlg9IhSB7Fguqbi7wH-Jg6bW_3Q8VemsH4pC7Iakat643EzRcw7OMObPSs"
    };

    constructor() { }

    /**
    * Restituisce TRUE se il mime type passato nel parametro corrisponde ad un mime type di un'immagine
    * @param mimeType Mime Type da verificare
    */
    static checkImageFromMimeType(mimeType: string): boolean {
        return this.imageMimeTypes.find(s => s == mimeType) != null;
    }

    /**
    * In base all'estensione passata come parametro, restituisce la FontAwesome corretta da utilizzare.
    * Se l'estensione non viene trovata nella costante riportata dentro common.model.ts restituisce un icona standard
    * @param extension Estensione del file per cui restituire l'icona corretta
    */
    static getIconFromFileExtensione(extension: string): string {
        let fileIcon = this.fileExtensionIcon[extension];
        return fileIcon ?? "fas fa-file";
    }

}
