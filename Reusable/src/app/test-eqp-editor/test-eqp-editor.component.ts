import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { DocumentSaveType } from '@eqproject/eqp-editor';

@Component({
    selector: 'app-test-eqp-editor',
    templateUrl: './test-eqp-editor.component.html',
    styleUrls: ['./test-eqp-editor.component.scss']
})
export class TestEqpEditorComponent implements OnInit {


    public DocumentSaveType = DocumentSaveType;
    placeholderEndPointVariable: string = "https://hseapi.eqproject.it/api/Placeholder/GetPlaceholderBySection/1/1/2/17";

    externalJsonTranslation: any = {
        INFO_TOOLTIP: "CIAO CIAO CIAO",
        INFO_TITLE: "AAAAAAAA"
    }
    ngOnInit(): void {
    }

    documentSaved($event) {

    }
}

