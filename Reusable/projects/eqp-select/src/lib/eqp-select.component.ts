import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  forwardRef
} from "@angular/core";
import { ControlValueAccessor, FormBuilder, FormControlStatus, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";

import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { EnumHelper } from "./helpers/enum.helper";
import { TranslateSelectHelper } from "./helpers/translateSelect.helper";
import { EqpLookupComponent } from "@eqproject/eqp-lookup";

@Component({
  selector: "eqp-select",
  templateUrl: "./eqp-select.component.html",
  styleUrls: ["./eqp-select.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EqpSelectComponent),
      multi: true
    }
  ]
})
export class EqpSelectComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  onChange: any = (v) => {
    if (this.formGroupInput) {
      if (v == null) {
        this.formGroupInput.controls[this.formControlNameInput].setValue(null);
      } else {
        var value;
        if (Array.isArray(v)) {
          if (this.arrayData != null)
            value = v.map((val) =>
              this.isPrimitiveArray && val[this.arrayKeyProperty] != null ? val[this.arrayKeyProperty] : val
            );
          else value = v.map((val) => val[this.arrayKeyProperty]);
        } else {
          if (this.arrayData != null)
            value = this.isPrimitiveArray && v[this.arrayKeyProperty] ? v[this.arrayKeyProperty] : v;
          else value = v[this.arrayKeyProperty] != null ? v[this.arrayKeyProperty] : v;
        }

        this.formGroupInput.controls[this.formControlNameInput].setValue(value);
      }

      this.cd.detectChanges();
    }
  };
  onTouch: any = () => {};
  val = ""; // this is the updated value that the class accesses

  /**
   * Etichetta che sarà mostrata nella select come placeholder
   */
  @Input("placeholder") placeholder: any;

  /**
   * Data una proprietà di tipo enumeratore, viene ricostruito un'array key value
   */
  @Input("enumData") enumData: any;

  /**
   * Permette di indicare i valori di uno specifico enumeratore (richiesto nel parametro enumData)
   * che si intende nascondere dalla select
   */
  @Input("enumDataToExclude") enumDataToExclude: Array<any> = null;

  /**
   * Datasource della select con le proprietà da mostrare, è necessario che venga definito un'array di oggetti con le proprietà 'key', 'value'
   */
  @Input("arrayData") arrayData: any;

  /**
   * Dell'arrayData definito, scrivere la proprietà che sarà la chiave (string)
   */
  @Input("arrayKeyProperty") arrayKeyProperty: string = "ID";

  /**
   * Dell'arrayData definito, scrivere la proprietà che sarà il valore (string)
   */
  @Input("arrayValueProperty") arrayValueProperty: string = "Label";

  /**
   * Options da utilizzare, default value: {standalone: true}
   */
  @Input("ngModelOptions") ngModelOptions: any;

  /**
   * ngModel da bindare
   */
  @Input("ngModelInput") ngModelInput: any;

  /**
   * Scrivere in caso di utilizzo di formControlName, il nome del formGroup utilizzato nel tag <form>
   */
  @Input("formGroupInput") formGroupInput: any;

  /**
   * Nome del formControlName da utilizzare
   */
  @Input("formControlNameInput") formControlNameInput: any;

  /**
   * Definisce se il campo è obbligatorio
   * @type {boolean}
   * @memberof EqpSelectComponent
   */
  @Input("isRequired") isRequired: boolean = false;

  /**
   *
   * @type {boolean}
   * @memberof EqpSelectComponent
   */
  @Input("isDisabled") isDisabled: boolean = false;

  /**
   * Se true, allora verrà utilizzato un emitter all'interno del translateHelper per gestire la sincronia delle chiamate con l'enumhelper
   * che si dovrà occupare di ritornare (nel caso di enumeratore) l'elenco tradotto
   */
  @Input("isMultiLanguage") isMultiLanguage: boolean = false;

  /**
   * input di tipo stringa dove sarà contenuto il prefisso della key
   * NB. è necessario inserire tutto il prefisso come scritto nel json(compresi gli eventuali separatori)
   */
  @Input("multilanguagePrefixKey") multilanguagePrefixKey: string = null;

  /**
   * Se true, allora l'elenco della select sarà ordinato alfabeticamente
   */
  @Input("isAlphabeticalOrderable") isAlphabeticalOrderable: boolean = false;

  /**
   * input di tipo stringa dove sarà contenuta l'icona da aggiungere alla SELECT come suffisso
   */
  @Input("suffixIcon") suffixIcon: string = null;

  /**
   * input di tipo stringa dove sarà contenuta l'icona da aggiungere alla SELECT come prefisso
   */
  @Input("prefixIcon") prefixIcon: string = null;

  /**
   * Se true, allora verrà utilizzata la select con scelta multipla
   */
  @Input("isMultiSelect") isMultiSelect: boolean = false;

  /**
   * Se TRUE allora permette di bindare alla selezione l'intero elemento dell'array usato come datasource
   */
  // @Input("includeFullObject") includeFullObject: boolean = true;

  /**
   * Se TRUE allora mostra il pulsante per annullare la selezione, altrimenti lo nasconde.
   * In caso di selezione multipla il cancelButton svuota l'array senza metterlo a NULL, invece in
   * caso di selezione singola mette a null l'ngModel
   */
  @Input("showCancelButton") showCancelButton: boolean = true;

  /**
   * Se TRUE allora viene mostrato un input per la ricerca altrimenti viene nascosto.
   *
   */
  @Input("isSearchable") isSearchable: boolean = false;

  /**
   * Permette di ridefinire il messaggio da mostrare quando la ricerca nella mat-select non ha ottenuto risultati
   */
  @Input("noResultSearchText") noResultSearchText: string = "Nessun elemento trovato";

  /**
   * Definisce se la select è in sola lettura o meno
   */
  @Input("isReadonly") isReadonly: boolean = false;

  /**
   * Proprietà per specificare se gli elementi devono essere filtrati mentre si scrive
   */
  @Input("isSearchWhileComposing") isSearchWhileComposing: boolean = true;

  /**
   * Proprietà per definire a quale elemento bisogna aggiungere la select usando i selettori CSS
   */
  @Input("appendToInput") appendToInput: string | undefined;

  /**
   * Posizione del dropdown. Valori possibili: 'bottom', 'top', 'auto'
   */
  @Input("dropdownPosition") dropdownPosition: "bottom" | "top" | "auto" = "auto";

  /**
   * Possibilità di selezionare un elemento usando il tasto TAB
   */
  @Input("selectOnTab") selectOnTab: boolean = true;

  /**
   * Aggiunge la possibilità di selezionare tutti gli elementi
   */
  @Input("selectAll") selectAll: boolean = false;

  /**
   * Testo visualizzato per l'opzione di SelectAll
   */
  @Input("selectAllText") selectAllText: string = "Seleziona tutto";

  /**
   * Indica se, alla selezione di un gruppo, viene preso il valore del gruppo stesso o dei singoli elementi
   */
  @Input("selectableGroupAsModel") selectableGroupAsModel: boolean = false;

  /**
   * Testo visualizzato in fase di hover del pulsante per eliminare gli elementi selezionati
   */
  @Input("clearAllText") clearAllText: string = "Elimina";

  /**
   * Template custom per definire il modo in cui gli elementi vengono visualizzati nel dropdown (oltre alla semplice Label)
   */
  @Input("customOption") customOption: TemplateRef<any>;

  /**
   * Template custom per definire il modo in cui gli elementi vengono visualizzati una volta selezionati (oltre alla semplice Label)
   */
  @Input("customLabel") customLabel: TemplateRef<any>;

  /**
   * Classe con cui poter indicare un selector CSS per la select
   */
  @Input("class") class: string;

  //#endregion

  //#region OUTPUTS

  /**
   * Evento scatenato al cambiare del valore della select
   */
  @Output() ngModelInputChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Evento scatenato al cambiare del valore della select
   */
  @Output() formControlChange: EventEmitter<any> = new EventEmitter<any>();

  //#endregion

  @ViewChild("customTemplateForSuffixAndPrefix") customTemplateForSuffixAndPrefix: TemplateRef<any>;

  @ViewChild("eqpLookup", { static: false }) eqpLookup: EqpLookupComponent;

  //Proprietà che permette di visualizzare lo spinner durante la ricerca nella select (solo se isSearchable è TRUE)
  public onSearching: boolean = false;

  private isPrimitiveArray: boolean = false;

  private _data = new BehaviorSubject<any[]>([]);

  // change data to use getter and setter
  @Input()
  set data(value) {
    // set the latest value for _data BehaviorSubject
    this._data.next(value);
  }

  get data() {
    // get the latest value from _data BehaviorSubject
    return this._data.getValue();
  }

  /**
   * dataSource
   */
  listOfElements: Array<any> = new Array<any>();

  tmpFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private enumHelper: EnumHelper,
    public translateSelectHelper: TranslateSelectHelper,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.enumData && !this.arrayKeyProperty) {
      throw new Error("La proprietà arrayKeyProperty è obbligatoria");
    }

    if (
      this.isMultiLanguage == true &&
      (this.translateSelectHelper.translateService == null || this.translateSelectHelper.translateService == undefined)
    ) {
      throw new Error("Configurazione multilingua errata. Passare l'istanza del translateService");
    }

    if (this.formGroupInput && this.formControlNameInput) {
      const formControl = this.formGroupInput.get(this.formControlNameInput);
      if (!formControl) {
        throw new Error("E' necessario passare un formControl valido");
      } else {
        this.tmpFormGroup = this.formBuilder.group({
          tmpFormControl: [this.formGroupInput.controls[this.formControlNameInput].value]
        });

        formControl?.valueChanges.subscribe((value) => {
          this.tmpFormGroup.get("tmpFormControl").setValue(value);
        });

        formControl.statusChanges.subscribe((status: FormControlStatus) => {
          if (status == "DISABLED") this.tmpFormGroup.get("tmpFormControl").disable();
          else if (status == "INVALID") {
            this.tmpFormGroup.get("tmpFormControl").enable();
            if (formControl.touched) this.tmpFormGroup.get("tmpFormControl").markAsTouched();

            this.tmpFormGroup.get("tmpFormControl").setErrors({ incorrect: true });
          } else {
            this.tmpFormGroup.get("tmpFormControl").enable();
            this.tmpFormGroup.get("tmpFormControl").setErrors(null);
          }
        });
      }
    }

    this.selectMethod();
    this.cd.detectChanges();
  }

  ngAfterViewInit(): void {
    this.checkInitialValues();
  }

  // In caso di chiamata asincrona, aggiorno il datasource come arrivano i dati
  ngOnChanges(changes: SimpleChanges) {
    // only run when property "arrayData" changed
    // controllo l'uguaglianza tra il currentValue e il previousValue per evitare elementi duplicati
    if (
      changes["arrayData"] != undefined &&
      changes["arrayData"].firstChange == false &&
      JSON.stringify(changes["arrayData"].currentValue) != JSON.stringify(changes["arrayData"].previousValue)
    ) {
      this.arrayData = changes.arrayData.currentValue;
      this.selectMethod();
    }
    //Al cambio dell'ngModelInput, viene riportato il valore a quello presente all'interno di val (ossia un LookupDTO)
    if (
      changes["ngModelInput"] != undefined &&
      changes["ngModelInput"].firstChange == false &&
      JSON.stringify(changes["ngModelInput"].currentValue) != JSON.stringify(changes["ngModelInput"].previousValue)
    ) {
      this.ngModelInput = this.val;
    }
  }

  checkInitialValues() {
    //Se si tratta di un array fatto di elementi primitivi, bisogna manipolare il dato iniziale in modo tale che sia un oggetto
    const isPrimitiveArray =
      this.arrayData != null &&
      Array.isArray(this.arrayData) &&
      this.arrayData.length > 0 &&
      this.arrayData.filter((a) => typeof a == "object" || typeof a == "function").length == 0;

    if (this.formGroupInput) {
      // const formValue = this.formGroupInput?.controls[this.formControlNameInput].value;
      // //In caso di form, bisogna sovrascrivere il valore (ciò presuppone che il form abbia già un valore) quando esso non presenta
      // //già l'ID popolato perchè si deve adattare a LookupDTO
      // if (formValue != null) {
      //   const obj = this.createObjFromValue(formValue);
      //   this.writeValue(this.isMultiSelect && !Array.isArray(obj) ? [obj] : obj);
      //   this.formGroupInput?.controls[this.formControlNameInput].setValue(
      //     this.isMultiSelect && !Array.isArray(obj) ? [obj] : obj
      //   );
      // }
    } else {
      //In caso di ngModel, bisogna recuperare il valore effettivo (key) e filtrare la lista degli elementi per prendere l'elemento dato alla lookup
      if (this.ngModelInput != null) {
        var finalValue;
        const obj = this.createObjFromValue(this.ngModelInput);
        if (Array.isArray(obj)) {
          finalValue = this.listOfElements.filter((l) => obj.includes(l[this.arrayKeyProperty]));
        } else {
          finalValue = this.listOfElements.filter((l) => l[this.arrayKeyProperty] == obj);
        }

        if (isPrimitiveArray) {
          finalValue = finalValue.map((f) => f[this.arrayKeyProperty]);
        }

        this.eqpLookup.ngselect.writeValue(Array.isArray(obj) ? finalValue : finalValue[0]);
        this.eqpLookup.ngModelInput = Array.isArray(obj) ? finalValue : finalValue[0];
      }
    }
  }

  createObjFromValue(value) {
    let obj;
    if (Array.isArray(value)) {
      obj =
        this.arrayData != null
          ? value.map((v) => (v[this.arrayKeyProperty] != null ? v[this.arrayKeyProperty] : v))
          : value;
    } else {
      obj = this.arrayData && value[this.arrayKeyProperty] != null ? value[this.arrayKeyProperty] : value;
    }
    return obj;
  }

  /**
   * Al change dei valori della select, aggiorno con l'emit il valore
   * @param event
   */
  onChangeSelect(event) {
    // this.ngModelInput = event != null ? event : (this.isMultiSelect != true ? null : []);
    this.writeValue(event);
    this.cd.detectChanges();
  }

  /**
   * Metodo che in caso di array si occupa di popolare il datasource, altrimenti in caso di enumeratore viene recuperato l'elenco degli enumeratori disponibili
   */
  selectMethod() {
    if (this.arrayData) {
      //Se l'arrayData è popolato, mi assicuro di svuotare l'array precedente
      this.listOfElements = new Array<any>();
      //Se si tratta di un array fatto di elementi primitivi, bisogna creare un datasource che abbia ID e Label uguali a l'elemento i-esimo dell'array
      if (
        this.arrayData.length > 0 &&
        this.arrayData.filter((a) => typeof a == "object" || typeof a == "function").length == 0
      ) {
        this.isPrimitiveArray = true;
        this.arrayData.forEach((element) => {
          this.listOfElements.push({
            ID: element,
            Label: element
          });
        });
      } else {
        for (let element of this.arrayData) {
          // element.keyProperty = this.arrayKeyProperty;
          var object = { ...element };
          if (this.arrayValueProperty.includes(".")) {
            object = this.expandObjectFromDotNotation(
              this.arrayValueProperty,
              this.getValue(element, this.arrayValueProperty)
            );
          } else {
            object[this.arrayValueProperty] = this.getValue(element, this.arrayValueProperty);
          }
          object[this.arrayKeyProperty] = element[this.arrayKeyProperty];
          object = { ...object, ...element };
          // object[this.arrayValueProperty] = this.getValue(element, this.arrayValueProperty);
          this.listOfElements.push(object);
        }
      }
    } else if (this.enumData) {
      this.listOfElements = this.enumHelper.getEnumLabel(
        this.enumData,
        null,
        this.isMultiLanguage,
        this.multilanguagePrefixKey
      );

      //Se è stata richiesta l'applicazione di un filtro ai valori da mostrare per l'enum allora lo applica
      if (this.enumDataToExclude != null && this.enumDataToExclude.length > 0) {
        this.listOfElements = this.listOfElements.filter(
          (l) => !this.enumDataToExclude.includes(l[this.arrayKeyProperty])
        );
      }
    }

    if (this.isAlphabeticalOrderable == true && (this.arrayData != null || this.enumData != null))
      this.sortArrayAlphabetically();
  }

  /**
   * Funzione che si occupa dell'aggiornamento del datasource della select prendendo la lista degli elementi e quella degli elementi esclusi (in caso di enum)
   */
  reloadData() {
    this.selectMethod();

    setTimeout(() => {
      this.cd.detectChanges();
      this.eqpLookup.reloadData();
    }, 50);
  }

  /**
   * Funzione per la creazione di un oggetto a partire da una stringa che contiene un "."
   * E' necessario in quanto ALTRIMENTI la stringa di esempio "Company.Denomination" messa all'interno di un oggetto non restituisce la proprietà "Denomination" presente dentro "Company"
   */
  expandObjectFromDotNotation(str, defaultVal = {}) {
    return str.split(".").reduceRight((acc, currentVal) => {
      return {
        [currentVal]: acc
      };
    }, defaultVal);
  }

  emitCorrectValue(value: any) {
    if (!this.isMultiSelect) {
      if (value == null) return null;

      if (this.arrayData != null) {
        return this.isPrimitiveArray && value[this.arrayKeyProperty] ? value[this.arrayKeyProperty] : value;
      }

      return value[this.arrayKeyProperty] != null ? value[this.arrayKeyProperty] : value;
    }

    if (value == null) return [];

    return value.map((v) => {
      if (this.arrayData == null && v[this.arrayKeyProperty] != null) return v[this.arrayKeyProperty];

      if (this.arrayData != null && this.isPrimitiveArray && v[this.arrayKeyProperty] != null)
        return v[this.arrayKeyProperty];

      return v;
    });
  }

  sortArrayAlphabetically() {
    this.listOfElements.sort((a, b) => a.value.localeCompare(b.value));
  }

  /**
   * Ricostruisco il valore in caso di oggetti complessi o casi booleani/enum
   * altrimenti in caso di valore diretto ritorno direttamente il valore stesso
   */
  getValue(element, arrayValueProperty) {
    if (arrayValueProperty) {
      return arrayValueProperty.split(".").reduce(this.getRealValue, element);
    } else {
      return element[arrayValueProperty];
    }
  }

  getRealValue(initialValue, currentValue) {
    return initialValue != null && initialValue != undefined ? initialValue[currentValue] : null;
  }

  /**
   * ControlValueAccessor implementation (two way binding)
   */

  set value(val) {
    // this value is updated by programmatic changes if( val !== undefined && this.val !== val){
    this.val = val;
    this.onChange(val);
    this.onTouch(val);

    if (this.formGroupInput) {
      this.formControlChange.emit(val != null ? this.emitCorrectValue(val) : val);
    } else this.ngModelInputChange.emit(val != null ? this.emitCorrectValue(val) : val);
  }

  // this method sets the value programmatically
  writeValue(value: any) {
    this.value = value;
  }
  // upon UI element value changes, this method gets triggered
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  // upon touching the element, this method gets triggered
  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  /**
   * Funzione per forzare il selected value della mat-select
   */
  compareFunction(iteratedObject, bindedObject): boolean {
    if (iteratedObject == null || iteratedObject.length == 0) return true;
    //EnumData - Caso tipi primitivi
    if (iteratedObject.keyProperty == null || iteratedObject.keyProperty == undefined) {
      if (iteratedObject[this.arrayKeyProperty] != null) return iteratedObject[this.arrayKeyProperty] == bindedObject;

      return iteratedObject === bindedObject;
    }

    //Caso tipi complessi
    if (iteratedObject.keyProperty != null || iteratedObject.keyProperty != undefined)
      return iteratedObject != null && bindedObject != null
        ? iteratedObject[iteratedObject.keyProperty] === bindedObject[iteratedObject.keyProperty]
        : iteratedObject === bindedObject;
  }

  /**
   * Funzione richiamata quando l'utente interviene sull'input di ricerca all'interno della mat-select.
   * Permette di filtrare la sorgente dati (sia nel caso di enumeratore sia nel caso di datasource esterno)
   * @param filterValue Stringa di ricerca inserita dall'utente
   * @returns
   */
  filterOptions(filterValue) {
    //Se la ricerca è disabilitata o se per qualche motivo non risultano definiti ne enumArray ne enumData esce senza fare niente
    if (this.isSearchable != true) return;

    if (!this.arrayData && !this.enumData) return;

    //Crea varibiale d'appoggio che assumerà valore TRUE se nel 'CERCA' è stato inserito almeno un carattere
    let hasFilter = filterValue != null && filterValue != undefined && filterValue != "";

    this.onSearching = true;

    //Se si sta usando la select con sorgente dati esterna allora applica il filtro sulla sorgente dati esterna
    //altrimenti la applica alla sorgente derivante dall'enumeratore
    if (this.arrayData != null && this.arrayData != undefined && this.arrayData.length > 0) {
      this.listOfElements = [];
      this.arrayData
        .filter(
          (p) =>
            hasFilter == false ||
            this.getSearchingValue(p, this.arrayValueProperty).toLowerCase().includes(filterValue.toLowerCase())
        )
        .forEach((element) => {
          // element.keyProperty = this.arrayKeyProperty;
          const object = {};
          object[this.arrayKeyProperty] = element[this.arrayKeyProperty];
          object[this.arrayValueProperty] = this.getValue(element, this.arrayValueProperty);
          this.listOfElements.push(object);
        });
    } else if (this.enumData != null && this.enumData != undefined) {
      let allEnumValues = this.enumHelper.getEnumLabel(
        this.enumData,
        null,
        this.isMultiLanguage,
        this.multilanguagePrefixKey
      );
      this.listOfElements = allEnumValues.filter(
        (p) => hasFilter == false || p.value.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    this.onSearching = false;
    this.cd.detectChanges();

    //Se richiesto l'ordinamento alfabetico allora riapplica il filtro sulla sorgente dati post-applicazione del filtro
    if (this.isAlphabeticalOrderable == true) this.sortArrayAlphabetically();
  }

  /**
   * Funzione che ispeziona tutti i possibili livelli di gerarchia scritti all'interno dell'input
   * arrayValueProperty del componente e restituisce il valore della proprietà identificata dal path.
   * @param item Elemento per cui ispezionare il property path
   * @param valueProperty Property path da utilizzare per recuperare il valore
   * @returns Restituisce il valore dell'ultima proprietà indicata nel property path (se definita altrimenti restituisce una stringa vuota)
   */
  private getSearchingValue(item, valueProperty): string {
    if (!valueProperty || !item) return "";

    let initialValue = item;
    let splittedProperties: string[] = valueProperty.split(".");
    if (!splittedProperties || splittedProperties.length == 0) return "";

    //Se è composta da una sola proprietà allora la restituisce direttamente
    if (splittedProperties.length == 1) return initialValue[splittedProperties[0]];

    //Altrimenti cicla tutte le componenti del property path ispezionando di volta in volta la gerarchia di nodi
    for (let i = 0; i < splittedProperties.length; i++) {
      initialValue = initialValue[splittedProperties[i]];
      if (!initialValue || initialValue == "") break;
    }

    return initialValue ? initialValue.toString() : "";
  }
}
