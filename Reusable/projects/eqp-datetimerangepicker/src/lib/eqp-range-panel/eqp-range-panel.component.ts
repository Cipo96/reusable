import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from "@angular/core";
import { DateAdapter } from "@angular/material/core";
import { MatDateRangePicker } from "@angular/material/datepicker";
import { TranslateService } from "@ngx-translate/core";
import moment from "moment";
import { EqpDatetimerangepickerService } from "../eqp-datetimerangepicker.service";
import * as i18n_en from "../i18n/i18n_en.json";
import * as i18n_it from "../i18n/i18n_it.json";

@Component({
  selector: "app-eqp-range-panel",
  templateUrl: "./eqp-range-panel.component.html",
  styleUrls: ["./eqp-range-panel.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EqpRangePanelComponent<D> implements OnInit {
  //#region Fields

  defaultPresets: Array<{
    label: string;
    orderPosition?: number;
    getRangeFunction?: () => [any, any];
  }> = [
      {
        label: "Today",
        orderPosition: 100,
        getRangeFunction: () => [this.today, this.today]
      },
      {
        label: "Last 7 days",
        orderPosition: 200,
        getRangeFunction: () => [this.dateAdapter.addCalendarDays(this.today, -6), this.today]
      },
      {
        label: "This week",
        orderPosition: 300,
        getRangeFunction: () => {
          const range = this.calculateWeek(this.today);
          return [range[0], range[1]];
        }
      },
      {
        label: "This month",
        orderPosition: 400,
        getRangeFunction: () => {
          const range = this.calculateMonth(this.today);
          return [range[0], range[1]];
        }
      },
      {
        label: "This year",
        orderPosition: 500,
        getRangeFunction: () => [
          this.dateAdapter.createDate(this.dateAdapter.getYear(this.today), 0, 1),
          this.dateAdapter.createDate(this.dateAdapter.getYear(this.today), 11, 31)
        ]
      },
      {
        label: "Last week",
        orderPosition: 600,
        getRangeFunction: () => {
          const range = this.calculateWeek(this.dateAdapter.addCalendarDays(this.today, -7));
          return [range[0], range[1]];
        }
      },
      {
        label: "Last month",
        orderPosition: 700,
        getRangeFunction: () => {
          const range = this.calculateMonth(this.dateAdapter.addCalendarMonths(this.today, -1));
          return [range[0], range[1]];
        }
      },
      {
        label: "Last year",
        orderPosition: 800,
        getRangeFunction: () => [
          this.dateAdapter.createDate(this.dateAdapter.getYear(this.today) - 1, 0, 1),
          this.dateAdapter.createDate(this.dateAdapter.getYear(this.today) - 1, 11, 31)
        ]
      }
    ];

  customPreset: Array<{
    label: string;
    orderPosition?: number;
    getRangeFunction?: () => [any, any];
  }> = [];

  @HostBinding("class.touch-ui")
  isTouchUi: boolean = false;

  public translateService: TranslateService;

  public customRangePreset: Array<{
    label: string;
    orderPosition?: number;
    getRangeFunction?: () => [Date, Date];
  }> = [];

  public language: string = "it";

  //#endregion

  constructor(
    private dateAdapter: DateAdapter<D>,
    private picker: MatDateRangePicker<D>,
    dateTimeRangeService: EqpDatetimerangepickerService
  ) {
    this.translateService = dateTimeRangeService.translateService;
    this.language = dateTimeRangeService.getLanguage();
    this.customRangePreset = dateTimeRangeService.getPreset();
  }

  ngOnInit() {
    this.InitializeTranslations();
    this.customPreset = this.defaultPresets
      .filter((dp) => this.customRangePreset.some((crp) => crp.label == dp.label))
      .concat(this.customRangePreset.filter((crp) => !this.defaultPresets.some((dp) => dp.label == crp.label)))
      .sort((a, b) => this.compareFn(a.orderPosition, b.orderPosition));

    if (this.picker != null)
      this.isTouchUi = this.picker.touchUi
  }

  //#region  Manage Preset Function

  compareFn(a: number, b: number) {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  }

  selectRange(rangeName: string): void {
    const range = this.customPreset.find((i) => i.label == rangeName).getRangeFunction();
    let start = range[0];
    let end = range[1];
    if (range[0] instanceof Date && range[1] instanceof Date) {
      start = this.dateAdapter.getValidDateOrNull(moment(start.setHours(0, 0, 0, 0)).utc(true));
      end = this.dateAdapter.getValidDateOrNull(moment(end.setHours(0, 0, 0, 0)).utc(true));
    }
    this.picker.select(start);
    this.picker.select(end);
    this.picker.close();
  }

  private calculateMonth(forDay: D): [start: D, end: D] {
    const year = this.dateAdapter.getYear(forDay);
    const month = this.dateAdapter.getMonth(forDay);
    const start = this.dateAdapter.createDate(year, month, 1);
    const end = this.dateAdapter.addCalendarDays(start, this.dateAdapter.getNumDaysInMonth(forDay) - 1);
    return [start, end];
  }

  private calculateWeek(forDay: D): [start: D, end: D] {
    const deltaStart = this.dateAdapter.getFirstDayOfWeek() - this.dateAdapter.getDayOfWeek(forDay);
    const start = this.dateAdapter.addCalendarDays(forDay, deltaStart);
    const end = this.dateAdapter.addCalendarDays(start, 6);
    return [start, end];
  }

  private get today(): D {
    const today = this.dateAdapter.getValidDateOrNull(moment(new Date().setHours(0, 0, 0, 0)).utc(true));
    if (today === null) {
      throw new Error("date creation failed");
    }
    return today;
  }

  //
  buttonName(label: string) {
    const key = "EQP_DATETIMERANGEPICKER" + "." + label;
    const res = this.getTranslatedValue(key) != key ? this.getTranslatedValue(key) : label;
    return res;
  }

  //#endregion

  //#region  translate
  InitializeTranslations() {
    if (this.language.toLowerCase() == "it") {
      let currentIT_Json = i18n_it["default"];
      this.normalizeJsonTranslations(currentIT_Json, this.language.toLowerCase());
    } else if (this.language.toLowerCase() == "en") {
      let currentEN_Json = i18n_en["default"];
      this.normalizeJsonTranslations(currentEN_Json, this.language.toLowerCase());
    }
  }

  getTranslatedValue(key, params: any = null) {
    return this.translateService ? this.translateService.instant(key, params) : key;
  }

  private normalizeJsonTranslations(localJsonToUse, language) {
    if (
      this.translateService &&
      this.translateService.store &&
      this.translateService.store.translations &&
      this.translateService.store.translations[language]
    ) {
      this.translateService.store.translations[language]["EQP_DATETIMERANGEPICKER"] =
        localJsonToUse["EQP_DATETIMERANGEPICKER"];
      return;
    }
    if (this.translateService) {
      this.translateService.setTranslation(this.language.toLowerCase(), localJsonToUse, true);
      this.translateService.use(this.language.toLowerCase());
    }
  }
  //#endregion
}
