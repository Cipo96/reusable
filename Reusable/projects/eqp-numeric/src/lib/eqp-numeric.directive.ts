import {
  AfterViewInit,
  Directive,
  DoCheck,
  ElementRef,
  forwardRef,
  HostListener,
  Inject,
  KeyValueDiffer,
  KeyValueDiffers,
  Input,
  OnInit,
  Optional
} from "@angular/core";

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { NumericMaskConfig, NUMERIC_MASK_CONFIG, EqpNumericInputMode } from "./eqp-numeric.config";
import { InputHandler } from "./input.handler";

export const NUMERICMASKDIRECTIVE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => EqpNumericDirective),
  multi: true,
};

@Directive({
  selector: "[eqpNumericMask]",
  providers: [NUMERICMASKDIRECTIVE_VALUE_ACCESSOR]
})

export class EqpNumericDirective implements AfterViewInit, ControlValueAccessor, DoCheck, OnInit {

  @Input() options: Partial<NumericMaskConfig> = {};

  public inputHandler: InputHandler;
  public keyValueDiffer: KeyValueDiffer<any, any>;

  public optionsTemplate: NumericMaskConfig = {
    align: "right",
    allowNegative: true,
    allowZero: true,
    decimal: ".",
    precision: 2,
    prefix: "€ ",
    suffix: "",
    thousands: ",",
    nullable: false,
    inputMode: EqpNumericInputMode.NATURAL
  };

  constructor(@Optional() @Inject(NUMERIC_MASK_CONFIG) private numericMaskConfig: NumericMaskConfig,
    private elementRef: ElementRef,
    private keyValueDiffers: KeyValueDiffers) {
    if (numericMaskConfig) {
      this.optionsTemplate = numericMaskConfig;
    }

    this.keyValueDiffer = keyValueDiffers.find({}).create();
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.style.textAlign = this.options && this.options.align ? this.options.align : this.optionsTemplate.align;
  }

  ngDoCheck() {
    if (this.keyValueDiffer.diff(this.options)) {
      this.elementRef.nativeElement.style.textAlign = this.options.align ? this.options.align : this.optionsTemplate.align;
      this.inputHandler.updateOptions((<any>Object).assign({}, this.optionsTemplate, this.options));
    }
  }

  ngOnInit() {
    this.inputHandler = new InputHandler(this.elementRef.nativeElement, (<any>Object).assign({}, this.optionsTemplate, this.options));
  }

  @HostListener("blur", ["$event"])
  handleBlur(event: any) {
    this.inputHandler.getOnModelTouched().apply(event);
  }

  @HostListener("cut", ["$event"])
  handleCut(event: any) {
    if (!this.isChromeAndroid()) {
      !this.isReadOnly() && this.inputHandler.handleCut(event);
    }
  }

  @HostListener("input", ["$event"])
  handleInput(event: any) {
    if (this.isChromeAndroid()) {
      !this.isReadOnly() && this.inputHandler.handleInput(event);
    }
  }

  @HostListener("keydown", ["$event"])
  handleKeydown(event: any) {
    if (!this.isChromeAndroid()) {
      !this.isReadOnly() && this.inputHandler.handleKeydown(event);
    }
  }

  @HostListener("keypress", ["$event"])
  handleKeypress(event: any) {
    if (!this.isChromeAndroid()) {
      !this.isReadOnly() && this.inputHandler.handleKeypress(event);
    }
  }

  @HostListener("paste", ["$event"])
  handlePaste(event: any) {
    if (!this.isChromeAndroid()) {
      !this.isReadOnly() && this.inputHandler.handlePaste(event);
    }
  }

  @HostListener("drop", ["$event"])
  handleDrop(event: any) {
    if (!this.isChromeAndroid()) {
      event.preventDefault();
    }
  }

  isChromeAndroid(): boolean {
    return /chrome/i.test(navigator.userAgent) && /android/i.test(navigator.userAgent);
  }

  isReadOnly(): boolean {
    return this.elementRef.nativeElement.hasAttribute('readonly')
  }

  registerOnChange(callbackFunction: Function): void {
    this.inputHandler.setOnModelChange(callbackFunction);
  }

  registerOnTouched(callbackFunction: Function): void {
    this.inputHandler.setOnModelTouched(callbackFunction);
  }

  setDisabledState(value: boolean): void {
    this.elementRef.nativeElement.disabled = value;
  }

  writeValue(value: number): void {
    this.inputHandler.setValue(value);
  }
}
