import { DatePipe } from "@angular/common";
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnInit,
  Output
} from "@angular/core";
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR, Validators } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
import { NgbTimeStruct } from "@ng-bootstrap/ng-bootstrap";
import moment from "moment";
import { EqpDatetimerangepickerService } from "./eqp-datetimerangepicker.service";
import { EqpRangeHeaderComponent } from "./eqp-range-header/eqp-range-header.component";

@Component({
  selector: "eqp-datetimerangepicker",
  templateUrl: "./eqp-datetimerangepicker.component.html",
  styleUrls: ["./eqp-datetimerangepicker.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EqpDatetimerangepickerComponent),
      multi: true
    },
    DatePipe
  ]
})
export class EqpDatetimerangepickerComponent implements OnInit, ControlValueAccessor, AfterViewChecked {
  readonly EqpRangeHeaderComponent = EqpRangeHeaderComponent;

  //#region INPUT

  /**
   * Modalità di visualizzazione del picker.
   * @property PickerModeEnum.DATETIME [vaue = 1] - tipologia date time picker
   * @property PickerModeEnum.DATE [value = 2] - tipologia date picker
   * @property PickerModeEnum.TIME [value = 3] - tipologia time picker
   * @property PickerModeEnum.DATE_RANGE [value = 4] - tipologia date range picker
   */
  @Input("type") type: PickerModeEnum = PickerModeEnum.DATE;

  /**
   * Imposta l'input come readonly.
   * @property {boolean} [default = false]
   */
  @Input("readonlyInput") readonlyInput: boolean = false;

  /**
   * Imposta la data minima inseribile
   * @property {Date | null} [default = null]
   */
  @Input("minDate") minDate: Date | null = null;

  /**
   * Imposta la data massima inseribile
   * @property {Date | null} [default = null]
   */
  @Input("maxDate") maxDate: Date | null = null;

  /**
   * Imposta l'input come obbligatorio
   * @property {boolean} [default = false]
   */
  @Input("isRequired") isRequired: boolean = false;

  /**
   * Da specificare in caso di utilizzo di formControlName, il nome del formGroup utilizzato nel tag <form>.
   * Da utilizzare solo se non viene usato il binding tramite ngModelInput.
   * @property {FormGroup | null} [default = null]
   */
  @Input("formGroupInput") formGroupInput: FormGroup | null = null;

  /**
   * Nome del formControl da utilizzare (in tutti i casi tranne che per RANGE_DATE).
   * Da utilizzare solo se non viene usato il binding tramite ngModelInput
   * @property {string | null} [default = null]
   */
  @Input("formControlNameInput") formControlNameInput: string | null = null;

  /**
   * Nome del formControlName da utilizzare per RANGE_DATE (data inizio).
   * Da utilizzare solo se non viene usato il binding tramite ngModelInput
   * @property {string | null} [default = null]
   */
  @Input("formControlNameInputStart") formControlNameInputStart: string | null = null;

  /**
   * Nome del formControlName da utilizzare per RANGE_DATE (data fine).
   * Da utilizzare solo se non viene usato il binding tramite ngModelInput
   * @property {string | null} [default = null]
   */
  @Input("formControlNameInputEnd") formControlNameInputEnd: string | null = null;

  /**
   * ngModel da bindare per tutte le tipologie di picker. Da utilizzare solo se non viene usato il binding tramite FormGroup e FormControl
   * @property {Date | string | null} [default = null]
   */
  @Input("ngModelInput") ngModelInput: Date | string | null = null;

  /**
   * Placeholder visualizzato in caso di DATE, DATETIME, TIME.
   * @property {string} [default_DATE = "Seleziona una data"]
   * @property {string} [default_DATETIME = "Seleziona una data e un orario"]
   * @property {string} [default_TIME = "Seleziona un orario"]
   */
  @Input("placeholder") placeholder: string = "";

  /**
   * Placeholder visualizzato in caso di DARE_RANGE (data inizio).
   * @property {string} [default_DARE_RANGE_start = "Seleziona data inizio"]
   */
  @Input("startPlaceholeder") startPlaceholeder: string = "";

  /**
   * Placeholder visualizzato in caso di DARE_RANGE (data fine).
   * @property {string} [default_DARE_RANGE_end = "fine"]
   */
  @Input("endPlaceholeder") endPlaceholeder: string = "";

  /**
   * Disabilitazione dell'input
   * @property {boolean} [default = false]
   */
  @Input("disabled") disabled: boolean | (() => boolean) = false

  /**
   * Se impostato a false, l'orario può essere inserito solamente
   * tramite input numerico di tastiera.
   * Usato nei pickerdi tipo TIME e DATETIME
   * @property {boolean} [default = true]
   */
  @Input("showSpinners") showSpinners: boolean = true;

  /**
   * Visualizzazione del campo 'secondi' per i picker TIME e DATETIME
   * @property {boolean} [default = true]
   */
  @Input("showSeconds") showSeconds: boolean = true;

  /**
   * Disabilita l'inserimento del campo 'minuti' per i picker TIME e DATETIME
   * @property {boolean} [default = false]
   */
  @Input("disableMinute") disableMinute: boolean = false;

  /**
   * Intervallo di ore al momento dell'inserimento per i picker TIME e DATETIME
   * @property {number} [default = 1]
   */
  @Input("stepHour") stepHour: number = 1;

  /**
   * Intervallo di minuti al momento dell'inserimento per i picker TIME e DATETIME
   * @property {number} [default = 1]
   */
  @Input("stepMinute") stepMinute: number = 1;

  /**
   * Intervallo di secondi al momento dell'inserimento per i picker TIME e DATETIME
   * @property {number} [default = 1]
   */
  @Input("stepSecond") stepSecond: number = 1;

  /**
   * Colore della data selezionata in caso di DATE, DATETIME, DATE_RANGE.
   * @property {string} [vaue = 'primary'] - blu
   * @property {string} [vaue = 'accent'] - giallo
   * @property {string} [vaue = 'warn'] - rosso
   * @property {undefined} [default = undefined] - blu
   */
  @Input("color") color: ThemePalette = undefined;

  /**
   * Imposta l'inserimento dell'orario nel formato 24H o AM/PM per i picker TIME e DATETIME
   * @property {boolean} [default = false] - 24H
   */
  @Input("enableMeridian") enableMeridian: boolean = false;

  /**
   * Imposta la visualizzazione del picker come finestra modale per i picker DATE, DATETIME, DATE_RANGE
   * @property {boolean} [default = false]
   */
  @Input("touchUi") touchUi: boolean = false;

  /**
   * Visualzizzazione della finestra di preset per il DATE_RANGE
   * @property {boolean} [default = true]
   */
  @Input("showRangePreset") showRangePreset: boolean = true;

  /**
   * array per i custom preset del DATE_RANGE
   * @property {Array<{label, orderPosition, getRangeFunction}>} [default = []]
   */
  @Input("customRangePreset") customRangePreset: Array<{
    label: string;
    orderPosition?: number;
    getRangeFunction?: () => [Date, Date];
  }> = [];

  /**
   * tipologia di dato utilizzato in caso di TIME mode picker
   * @property {TimeTypeEnum} [default = TimeTypeEnum.STRING]
   */
  @Input("timeType") timeType: TimeTypeEnum = TimeTypeEnum.STRING;

  /**
   * Permette di definire la lingua in cui localizzare il sistema
   * @property {string} [default = "it"]
   */
  @Input("language") language: string = "it";

  /**
   * Permette di abilitare i bottoni per l'applicazione e la cancellazione del dato selezionato all'interno delle modali dei picker
   * @property {boolean} [default = false]
   */
  @Input("showButtons") showButtons: boolean = false;

  /**
   * Testo del bottone di cancellazione del dato inserito
   * @property {string} [default = "Cancella"]
   */
  @Input("cancelButtonText") cancelButtonText: string = "Cancella";

  /**
   * Testo del bottone di applicazione del dato selezionato
   * @property {string} [default = "Applica"]
   */
  @Input("applyButtonText") applyButtonText: string = "Applica";

  /**
   * funzione che viene applicata ad ogni data del calendario.
   * la funzione deve restituire true se la data è valida altrimenti false.
   * NOTA: il primo giorno della settimana è domenica : 0
   * domenica: 0
   * lunedì: 1
   * ...
   * sabato: 6
   * @property {(date: Date) => boolean | null} [default = null]
   */
  @Input("datepickerFilter") datepickerFilter: (date: Date) => boolean | null = null;

  /**
   * Utilizzo del TIME picker tramite modale o inserimento da tastiera
   * false: l'input sarà inseribile solo tramite keyboard (nel caso di form control il tipo di output sarà solo di tipo stringa)
   * true: l'input da tastiera sarà disabilitato e potrà essere inserito solo tramite la modale
   * @property {boolean} [default = true]
   */
  @Input("showTimePopover") showTimePopover: boolean = true;

  //#endregion

  //#region OUTPUT

  @Output() ngModelInputChange: EventEmitter<Date | string | number> = new EventEmitter<Date | string | number>();

  @Output() formControlChange: EventEmitter<any> = new EventEmitter<any>();

  //#endregion

  //#region INSERTED INPUT TRACKET & FLAGS
  range: { from: Date | null; to: Date | null } = { from: null, to: null };
  dateTimeInput: Date | string | NgbTimeStruct | null = null;
  innerWidth: any | null = null;
  touchUiHasBeenChanged: boolean = false;
  timeValidatorClassName: string = null;
  tmpTime: any = null;
  timeFormat: string = "HH:mm:ss";
  timeIsString: boolean = true;
  //@ViewChild("DateTimePicker") DateTimePicker: NgxMatDatetimepicker<Date>;
  //#endregion

  constructor(private cd: ChangeDetectorRef, private service: EqpDatetimerangepickerService) { }

  //#region ControlValueAccessor

  val: any = null;
  onChange: any = (event: any) => {
    this.cd.detectChanges();
  };
  onTouch: any = () => {
    this.cd.detectChanges();
  };

  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  set value(val: any) {
    if ([PickerModeEnum.DATE, PickerModeEnum.DATETIME].includes(this.type)) {
      val = this.convertDate(val);
    } else if (this.type == PickerModeEnum.DATE_RANGE && val) {
      if (val?._d) {
        var isTo = this.range.from != val && this.range.to == val;
        if (isTo) val.utc(true).add(1, "day").subtract(1, "millisecond");
        else val.utc(true);
      } else {
        val.from = this.convertDate(val.from);
        val.to = this.convertDate(val.to, true);
      }
    }

    this.val = val;
    this.onChange(val);
    this.onTouch(val);

    if (this.ngModelInputChange != null && this.type != PickerModeEnum.DATE_RANGE) {
      this.ngModelInput = this.val;
      this.ngModelInputChange.emit(this.val);
    }
  }

  //#endregion

  //#region  Angular Hooks
  ngOnInit(): void {
    this.onResize();
    this.checkValueOnInit();
    this.disableComponent();
    if (this.type == PickerModeEnum.DATE_RANGE) this.service.setField(this.customRangePreset, this.language);
    this.cd.detectChanges();
  }

  ngAfterViewChecked(): void {
    this.setPlaceholder();
  }

  ngDoCheck() {
    if (this.formControlNameInput && this.disabled) {
      this.formGroupInput.get(this.formControlNameInput).disable();
    } else if (this.formControlNameInput && !this.disabled) {
      this.formGroupInput.get(this.formControlNameInput).enable();
    }
    this.manageRequired();
    this.cd.detectChanges();
    this.onOpenDateTime();
  }

  onOpenDateTime() {
    const container = Array.from(document.getElementsByClassName("ngx-mat-calendar-body"));
    if (this.type == PickerModeEnum.DATETIME && this.datepickerFilter && container.length > 0) {
      Array.from(document.getElementsByClassName("mat-calendar-body-cell-container"))
        .map((e) => e.getElementsByClassName("mat-calendar-body-cell"))
        .forEach((c) => {
          Array.from(c).forEach((e) => {
            const date = this.convertStringToDate(e.getAttribute("aria-label"));
            if (!this.datepickerFilter(date)) {
              e.classList.add("mat-calendar-body-disabled");
              e.setAttribute("disabled", "true");
            }
          });
        });
    }
  }

  convertStringToDate(dateString: string) {
    const monthMap = {
      gennaio: 0,
      febbraio: 1,
      marzo: 2,
      aprile: 3,
      maggio: 4,
      giugno: 5,
      luglio: 6,
      agosto: 7,
      settembre: 8,
      ottobre: 9,
      novembre: 10,
      dicembre: 11
    };

    const dateParts = dateString.split(" ");
    const day = parseInt(dateParts[0], 10);
    const month = monthMap[dateParts[1].toLowerCase()];
    const year = parseInt(dateParts[2], 10);

    return new Date(year, month, day);
  }
  //#endregion

  //#region FUNCTIONS

  /**
   * Gestione della modalità di visualizzazione del picker al resize della pagina.
   * se touchUi è inizialmente false e la finestra ha width <= 450px, il valore viene settato a true
   * per abilitare la visualizzazione responsive.
   */
  @HostListener("window:resize", ["$event"])
  onResize() {
    this.innerWidth = window.innerWidth;
    if (this.touchUi && !this.touchUiHasBeenChanged) return;
    this.touchUi = this.touchUiHasBeenChanged = this.innerWidth <= 700;
    this.cd.detectChanges();
  }

  /**
   * Funzione che gestisce la modifiche del picker in base alla tipologia del picker e del binding
   */
  onInputDateChange(event: any, isOnInit: boolean = false, isFromRange: boolean = false) {
    if (!this.formGroupInput) {
      if (this.type == PickerModeEnum.DATE_RANGE) {
        if (event?.from && event?.to) {
          this.range = event;
          if (this.rangeIsValid()) this.writeValue(this.range);
        } else {
          if (this.rangeIsValid()) {
            if (event?.value) this.writeValue(event.value);
            else this.writeValue(event);
          }
        }
      } else {
        if (this.type != PickerModeEnum.TIME) {
          isOnInit ? (this.dateTimeInput = event) : (this.dateTimeInput = event?.value);
          if (this.type == PickerModeEnum.DATETIME) {
            if (this.dateTimeIsValid()) this.writeValue(this.dateTimeInput);
          } else this.writeValue(this.dateTimeInput);
        } else this.onTimeChange(null, event);
      }
    } else if ([PickerModeEnum.DATE_RANGE, PickerModeEnum.DATE, PickerModeEnum.DATETIME].includes(this.type)) {
      if (this.formControlNameInput) {
        if (this.type == PickerModeEnum.DATETIME) {
          if (this.dateTimeIsValid()) this.formGroupInput.get(this.formControlNameInput)?.value?.utc(true);
        } else this.formGroupInput.get(this.formControlNameInput)?.value?.utc(true);
      }
      if (this.formControlNameInputStart && this.formControlNameInputEnd) {
        if (this.rangeIsValid()) {
          this.formGroupInput.get(this.formControlNameInputStart)?.value?.utc(true);
          this.formGroupInput.get(this.formControlNameInputEnd)?.value?.utc(true).subtract(1, "millisecond");
        }
      }
      if (!isOnInit) {
        const emitValue = this.formControlNameInput
          ? this.formGroupInput.get(this.formControlNameInput)?.value?.utc(true)
          : this.formControlNameInputStart && this.formControlNameInputEnd && this.rangeIsValid()
            ? {
              From: this.formGroupInput.get(this.formControlNameInputStart)?.value?.utc(true),
              To: isFromRange
                ? null
                : this.formGroupInput
                  .get(this.formControlNameInputEnd)
                  ?.value?.utc(true)
                  .add(1, "day")
                  .subtract(1, "millisecond")
            }
            : null;
        this.formControlChange.emit(emitValue);
      }
    }
  }

  clearControl(isRange: boolean = false) {
    if (!isRange) {
      this.formGroupInput.get(this.formControlNameInput).patchValue(null);
      this.formControlChange.emit(this.formGroupInput.get(this.formControlNameInput).value);
    } else {
      this.formGroupInput.get(this.formControlNameInputStart).patchValue(null);
      this.formGroupInput.get(this.formControlNameInputEnd).patchValue(null);
      this.formControlChange.emit({
        From: this.formGroupInput.get(this.formControlNameInputStart).value,
        To: this.formGroupInput.get(this.formControlNameInputEnd).value
      });
    }
  }

  clearNgModel(isRange: boolean = false) {
    if (!isRange) {
      this.dateTimeInput = null;
      this.writeValue(this.dateTimeInput);
    } else {
      this.range.from = null;
      this.range.to = null;
      this.writeValue(this.range);
    }
  }

  onTimeChange(time: NgbTimeStruct = null, onInitValue: Date | string = null) {
    if (onInitValue) {
      if (typeof onInitValue == "string") {
        const split = onInitValue.split(":");
        time = {
          hour: parseInt(split[0], 10),
          minute: parseInt(split[1], 10),
          second: parseInt(split[2], 10)
        };
      } else {
        time = {
          hour: moment(onInitValue).hours(),
          minute: moment(onInitValue).minutes(),
          second: moment(onInitValue).seconds()
        };
      }
    }
    this.dateTimeInput = time;

    let value = null;
    if (time) {
      if (this.timeType == TimeTypeEnum.DATE) {
        this.timeIsString = false;
        value = new Date();
        value.setHours(
          time.hour,
          time.minute,
          !Number.isNaN(time.second) && time.second != null && time.second != undefined ? time.second : 0
        );
      } else {
        this.timeIsString = true;
        value = `${time.hour < 10 ? "0" + +time.hour : time.hour}:${time.minute < 10 ? "0" + +time.minute : time.minute
          }:${!Number.isNaN(time.second) && time.second != null && time.second != undefined
            ? time.second < 10
              ? "0" + +time.second
              : time.second
            : "00"
          }`;
      }
    }
    this.tmpTime = value;
    if (onInitValue || !this.showButtons) this.setTime();
  }

  setTime() {
    this.writeValue(this.tmpTime);
    if (this.formControlNameInput && this.formGroupInput) {
      this.formGroupInput.get(this.formControlNameInput).patchValue(this.tmpTime);
      this.formControlChange.emit(this.tmpTime);
    }
    this.manageTimePickerValidation();
  }

  manageTimePickerValidation() {
    if (!this.formControlNameInput && !this.formGroupInput)
      this.timeValidatorClassName = !this.tmpTime && this.isRequired ? "ngb-error" : "ngb-valid";
    else {
      if (
        this.formGroupInput.get(this.formControlNameInput).errors?.required &&
        !this.formGroupInput.get(this.formControlNameInput).value
      )
        this.formGroupInput.get(this.formControlNameInput).setErrors({ invalid: true });
      else this.formGroupInput.get(this.formControlNameInput).setErrors(null);

      this.timeValidatorClassName = this.formGroupInput.get(this.formControlNameInput).invalid
        ? "ngb-error"
        : "ngb-valid";
    }
  }

  rangeIsValid() {
    if ((!this.formControlNameInputEnd || !this.formControlNameInputStart) && !this.formGroupInput) {
      if (this.range.from && this.range.to && this.datepickerFilter) {
        let currentDate = new Date(this.range.from);
        let endDate = new Date(this.range.to);
        while (currentDate <= endDate) {
          if (this.datepickerFilter(currentDate)) currentDate.setDate(currentDate.getDate() + 1);
          else {
            this.clearNgModel(true);
            return false;
          }
        }
      }
    } else if (this.formControlNameInputEnd && this.formControlNameInputStart && this.formGroupInput) {
      let start = this.formGroupInput.get(this.formControlNameInputStart).value;
      let end = this.formGroupInput.get(this.formControlNameInputEnd).value;

      if (start && end && this.datepickerFilter) {
        let currentDate = new Date(start);
        let endDate = new Date(end);
        while (currentDate <= endDate) {
          if (this.datepickerFilter(currentDate)) currentDate.setDate(currentDate.getDate() + 1);
          else {
            this.clearControl(true);
            return false;
          }
        }
      }
    }
    return true;
  }

  dateTimeIsValid() {
    if (!this.formControlNameInput && !this.formGroupInput) {
      if (this.dateTimeInput && this.datepickerFilter) {
        let currentDate = new Date(this.dateTimeInput as Date);
        if (this.datepickerFilter(currentDate)) currentDate.setDate(currentDate.getDate() + 1);
        else {
          this.clearNgModel();
          return false;
        }
      }
    } else if (this.formControlNameInput && this.formGroupInput) {
      let currentDate = new Date(this.formGroupInput.get(this.formControlNameInput).value);

      if (currentDate && this.datepickerFilter) {
        if (this.datepickerFilter(currentDate)) currentDate.setDate(currentDate.getDate() + 1);
        else {
          this.clearControl();
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Funzione richiamata all'init del componente per definire i placeholder in base alla tipologia di picker.
   * Nel caso la tipologia sia DATE_RANGE e l'input isRequired = true, il placeholder avrà alla sua fine il simbolo *
   */
  setPlaceholder() {
    if (this.type != PickerModeEnum.DATE_RANGE && this.placeholder == "") {
      if (this.type == PickerModeEnum.DATE) this.placeholder = "Seleziona una data";
      else if (this.type == PickerModeEnum.DATETIME) this.placeholder = "Seleziona una data e un orario";
      else if (this.type == PickerModeEnum.TIME) this.placeholder = "Seleziona un orario";
    } else if (this.type == PickerModeEnum.DATE_RANGE) {
      if (this.startPlaceholeder == "") this.startPlaceholeder = "Data inizio";
      if (this.endPlaceholeder == "") this.endPlaceholeder = "fine";
    }
    this.cd.detectChanges();
  }

  /**
   * Funzione che gestisce la disabilitazione del componente quando è usato in un formGroup
   */
  disableComponent() {
    if (this.disabled) this.isRequired = false;
    if (this.disabled && this.formGroupInput) {
      if (this.formControlNameInput) this.formGroupInput.get(this.formControlNameInput)?.disable();
      if (this.type == PickerModeEnum.DATE_RANGE && this.formControlNameInputEnd && this.formControlNameInputStart) {
        this.formGroupInput.get(this.formControlNameInputStart)?.disable();
        this.formGroupInput.get(this.formControlNameInputEnd)?.disable();
      }
    }
  }

  manageRequired() {
    if (this.disabled) {
      this.isRequired = false;
      this.timeValidatorClassName = "ngb-valid";
    }
    if (this.formGroupInput && !this.disabled) {
      if (this.formControlNameInput) {
        if (this.formGroupInput.get(this.formControlNameInput).hasValidator(Validators.required))
          this.isRequired = true;
        else this.isRequired = false;
      } else if (this.formControlNameInputStart && this.formControlNameInputEnd) {
        if (
          this.formGroupInput.get(this.formControlNameInputStart).hasValidator(Validators.required) &&
          this.formGroupInput.get(this.formControlNameInputEnd).hasValidator(Validators.required)
        )
          this.isRequired = true;
        else this.isRequired = false;
      }
    }
  }

  /**
   * Funzione che gestisce i dati del picker in base alla tipologia del picker e del binding (all'init del compomponente)
   */
  checkValueOnInit() {
    if (!this.formGroupInput) {
      if (this.ngModelInput) {
        let initialValue: any = this.ngModelInput;
        if (this.type == PickerModeEnum.DATE_RANGE) {
          if (initialValue?.from == null) initialValue.from = ".";
          if (initialValue?.to == null) initialValue.to = ".";
        }
        this.onInputDateChange(initialValue, true);
      }
    } else {
      if (this.formControlNameInput) {
        if (this.formGroupInput.get(this.formControlNameInput)?.value) {
          if (this.type == PickerModeEnum.TIME)
            this.onTimeChange(null, this.formGroupInput.get(this.formControlNameInput)?.value);
          else
            this.formGroupInput
              .get(this.formControlNameInput)
              ?.setValue(this.convertDate(this.formGroupInput.get(this.formControlNameInput)?.value));
          if (this.type == PickerModeEnum.DATETIME) this.dateTimeIsValid();
        }
      } else if (
        this.formControlNameInputStart &&
        this.formControlNameInputEnd &&
        this.formGroupInput.get(this.formControlNameInputStart)?.value &&
        this.formGroupInput.get(this.formControlNameInputEnd)
      ) {
        try {
          this.formGroupInput
            .get(this.formControlNameInputStart)
            ?.setValue(this.convertDate(this.formGroupInput.get(this.formControlNameInputStart)?.value));

          this.formGroupInput
            .get(this.formControlNameInputEnd)
            ?.setValue(this.convertDate(this.formGroupInput.get(this.formControlNameInputEnd)?.value, true));
          this.rangeIsValid();
        } catch (error) {
          console.log("select the end date");
        }
      }
    }
    this.getTypeOfDataAndsetPipeFormat();
  }

  convertDate(date: Date | null | undefined, to: boolean = false) {
    return to ? moment(date).utc(true).add(1, "day").subtract(1, "millisecond") : moment(date).utc(true);
  }

  stopProp(e: Event) {
    e.stopPropagation();
  }

  getTypeOfDataAndsetPipeFormat() {
    this.timeFormat = this.showSeconds ? "HH:mm:ss" : "HH:mm";
    if (this.formControlNameInput && this.formGroupInput)
      this.timeIsString = typeof this.formGroupInput.get(this.formControlNameInput)?.value == "string";
    else this.timeIsString = typeof this.val == "string";
  }
  //#endregion
}

export enum PickerModeEnum {
  DATETIME = 1,
  DATE = 2,
  TIME = 3,
  DATE_RANGE = 4
}

export enum TimeTypeEnum {
  DATE = 1,
  STRING = 2
}
