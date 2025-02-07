import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import {
  PickerModeEnum,
  TimeTypeEnum
} from "projects/eqp-datetimerangepicker/src/lib/eqp-datetimerangepicker.component";

@Component({
  selector: "app-test-eqp-datetimerangepicker",
  templateUrl: "./test-eqp-datetimerangepicker.component.html",
  styleUrls: ["./test-eqp-datetimerangepicker.component.scss"]
})
export class TestEqpDatetimerangepickerComponent implements OnInit {
  @ViewChild("dialogSlot", { static: false }) dialogSlot: TemplateRef<any>;
  dialogSlotRef: MatDialogRef<TemplateRef<any>>;

  addEditSlot(element: any = null): void {
    this.dialogSlotRef = this.dialog.open(this.dialogSlot, {
      disableClose: true,
      hasBackdrop: true,
      minWidth: "50%",
      minHeight: "300px"
    });
  }
  PickerModeEnum = PickerModeEnum;
  TimeTypeEnum = TimeTypeEnum;
  disable = false;
  showSeconds = false;
  isRequired = true;
  minDate: Date = null;
  maxDate: Date = null;
  showRangePreset: boolean = true;
  customLabelIt = "due giorni fa";
  customLabelEn = "two day ago";
  customIndex = 350;
  presetLanguage: string = "en";
  customRangePreset = [
    {
      label: this.customLabelEn,
      orderPosition: this.customIndex,
      getRangeFunction: this.getTwoDayAgoFromNow
    },
    {
      label: "Today"
    },
    {
      label: "Last year"
    },
    {
      label: "This month"
    },
    {
      label: "Last week"
    },
    {
      label: "This week"
    },
    {
      label: "ghsdgjfgsdf"
    },
    {
      label: "jhsdfgjsdgf"
    },
    {
      label: "dkjfhjksd"
    },
    {
      label: "dsjfjksd"
    },
    {
      label: "dfgfgdfgdfgdf"
    }
  ];
  showSpinner: boolean = true;

  fcDD: Date = null;
  fcSS: string = null;
  fcSD: string = null;
  fcDS: Date = null;
  ngDD: Date = null;
  ngSS: string = null;
  ngSD: string = null;
  ngDS: Date = null;

  dateTimePickerWithTime: Date = new Date();
  date: Date = new Date();
  range: any = { from: new Date(), to: new Date().setDate(new Date().getDate() + 2) };
  showButtons: boolean = false;

  formGroup = new FormGroup({
    timeControl: new FormControl(this.fcDD, Validators.required),
    dateRangeControlStart: new FormControl(this.range.from, Validators.required),
    dateRangeControlEnd: new FormControl(this.range.to, Validators.required)
  });

  getTwoDayAgoFromNow() {
    return [new Date(new Date().setDate(new Date().getDate() - 2)), new Date()];
  }

  holidayDateFilter = (d: Date): boolean => {
    const day = new Date(d).getDay();
    return day !== 0 && day !== 6;
  };

  clearData() {
    this.dateTimePickerWithTime = null;
    this.date = null;
    this.range = null;
    this.cd.detectChanges();
  }

  toggleDisable() {
    this.disable = !this.disable;
  }

  toggleRequired() {
    this.isRequired = !this.isRequired;
  }

  toggleShowSeconds() {
    this.showSeconds = !this.showSeconds;
  }

  setMinDate() {
    this.minDate = this.minDate == null ? new Date(new Date().setDate(new Date().getDate() - 1)) : null;
  }

  setMaxDate() {
    this.maxDate = this.maxDate == null ? new Date(new Date().setDate(new Date().getDate() + 1)) : null;
  }

  setShowPreset() {
    this.showRangePreset = !this.showRangePreset;
  }

  closeModal() {
    this.dialogSlotRef.close();
  }

  setshowSpinnert() {
    this.showSpinner = !this.showSpinner;
  }

  constructor(private http: HttpClient, private cd: ChangeDetectorRef, private dialog: MatDialog) {}

  ngOnInit() {
    this.cd.detectChanges();
  }

  onChangeForm(event) {
    console.log(event);
  }
}
