import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
// import { EqpAttachmentDialogService, EqpAttachmentsComponent, IAttachmentDTO, IOptions } from '@eqproject/eqp-attachments';
import { environment } from "src/environments/environment";
import {
  EqpAttachmentDialogService,
  EqpAttachmentsComponent,
  IAttachmentDTO,
  IOptions
} from "./../../../projects/eqp-attachments/src/public-api";

@Component({
  selector: "app-test-eqp-attachments",
  templateUrl: "./test-eqp-attachments.component.html",
  styleUrls: ["./test-eqp-attachments.component.scss"]
})
export class TestEqpAttachmentsComponent implements OnInit {
  attachmentsList: Array<IAttachmentDTO> = [
    {
      ID: 0,
      AttachmentType: 2,
      FileName: "sdfsdfsdf",
      FilePath: "qwertyyuiop"
    }
  ];

  attachmentsListMultiple: Array<IAttachmentDTO> = [];
  attachmentsColumns = null;
  // attachmentsColumns: Array<ConfigColumn> = [
  //   {
  //     key: "action", display: "",
  //     type: TypeColumn.MenuAction, buttonMenuIcon: "more_vert", styles: { flex: "0 0 6%" },
  //     actions: [
  //       { name: "Elimina", icon: "delete", fn: (element, index, col) => this.deleteMedia(element) },
  //     ],
  //   },
  //   { key: "FileName", display: "NOME" },
  // ];

  // compressionOptions: IOptions = {
  //   maxSizeMB: 0.03,
  //   maxWidthOrHeight: 5000,
  //   useWebWorker: true
  // }
  compressionOptions: IOptions = null;

  // uploadTypeEnum = UploadTypeEnum;

  @ViewChild("eqpAttachments", { static: true }) eqpAttachments: EqpAttachmentsComponent;

  constructor(private http: HttpClient) {
    this.attachmentsListMultiple = JSON.parse(JSON.stringify(this.attachmentsList));
  }

  ngOnInit() {
    // this.getAttachment().then((res) => { console.log(res); })
    // setTimeout(() => {
    //   this.attachmentsList.splice(0, 1);
    //   this.singleAttachment.splice(0, 1);
    //   this.eqpAttachments.reloadData();
    //   console.log(this.attachmentsList)
    //   console.log(this.singleAttachment)
    // }, 10000)
  }

  getAttachment() {
    return this.http.get<string>(environment.apiFullUrl + "/test/0").toPromise();
  }

  singleAttachment: IAttachmentDTO[] = [
    {
      ID: 0,
      IsImage: true,
      AttachmentType: 1,
      FileContentType: "image/png",
      FileName: "logo_eqp.png",
      FileExtension: "png",
      FileDataBase64:
        "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"
    }
  ];

  singleAttachmentWithSeparatedButtons: IAttachmentDTO[] = [];

  viewAttachment(event) {
    console.log(event);
  }

  catchAttachmentList(event) {
    console.log(event);
  }

  onDeleteAttachment(event) {
    console.log(event);
  }

  deleteMedia(media: IAttachmentDTO) {
    EqpAttachmentDialogService.Confirm(
      "Eliminare questo allegato?",
      () => {
        this.singleAttachment.splice(0, 1);
        this.attachmentsList.splice(0, 1);
        this.singleAttachmentWithSeparatedButtons.splice(0, 1);

        // this.eqpAttachments.reloadData();
        this.eqpAttachments.attachmentTable.reloadDatatable();
      },
      true,
      "Attenzione:"
    );
  }

  testDisableRow(row: any): boolean {
    return true;
  }
}
