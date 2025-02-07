// import { TranslateSelectHelper } from "../../projects/eqp-select/src/lib/helpers/translateSelect.helper";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import * as it from "../app/i18n/it.json";
import * as en from "../app/i18n/en.json";
import { EqpDatetimerangepickerService } from "projects/eqp-datetimerangepicker/src/public-api";
import { Router } from "@angular/router";

// import { EqpEditorService } from "projects/eqp-editor/src/lib/eqp-editor.service";

export enum GenderEnum {
  MALE = 1,
  FEMALE = 0
}

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

  constructor(
    // public translateHelper: TranslateSelectHelper,
    private cd: ChangeDetectorRef,
    private translateService: TranslateService,
    // private eqpEditorService: EqpEditorService
    private eqpDateTimeRangePickerservice: EqpDatetimerangepickerService,
    public route: Router
  ) {}

  // ngAfterViewInit() {
  //   this.cd.detectChanges();
  // }

  ngOnInit() {
    this.translateService.setTranslation("it", it, true);
    this.translateService.use("it");
    // this.eqpEditorService.loadTranslateService(this.translateService);
    this.eqpDateTimeRangePickerservice.loadTranslateService(this.translateService);
  }
}
