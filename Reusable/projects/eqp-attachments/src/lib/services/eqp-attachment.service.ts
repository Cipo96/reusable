import { Injectable } from "@angular/core";
import { AttachmentHelperService } from "../helpers/attachment.helper";

@Injectable({
  providedIn: "root"
})
export class EqpAttachmentService {
  constructor() {}

  loadDropboxScript() {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = AttachmentHelperService.dropboxCredentials.url;
    script.id = "dropboxjs";
    script.dataset.appKey = AttachmentHelperService.dropboxCredentials.apiKey;
    document.body.appendChild(script);
  }
}
