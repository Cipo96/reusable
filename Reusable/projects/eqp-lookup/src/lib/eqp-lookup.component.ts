import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  forwardRef
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DropdownPosition, NgSelectComponent } from "@ng-select/ng-select";
import { BehaviorSubject } from "rxjs";
import { DynamicLoaderDirectiveData } from "./directives/dynamic-loader/dynamic-loader.directive";
import { EqpLookupService } from "./eqp-lookup.service";
import { ComplexLinqPredicateDTO, LinqPredicateDTO } from "./models/linqPredicate.model";
import { LookupCustomConfig, LookupDTO } from "./models/lookup.model";

@Component({
  selector: "eqp-lookup",
  templateUrl: "./eqp-lookup.component.html",
  styleUrls: ["./eqp-lookup.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EqpLookupComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EqpLookupComponent implements OnInit, AfterViewInit, ControlValueAccessor, OnChanges {
  onChange: any = () => {};
  onTouch: any = () => {};
  val: any = null;
  interval: any = null;

  //#region VIEW CHILDS and REFS

  @ViewChild("dialogDynamic", { static: true }) dialogDynamic: TemplateRef<any> | undefined;

  /**
   * Viechild per la gestione diretta del componente di select
   */
  @ViewChild("ngselect", { static: false }) ngselect: NgSelectComponent | undefined;

  modalAdding: MatDialogRef<TemplateRef<any>> | undefined;

  //#endregion

  //#region INPUTS

  /**
   * Label che sarà visibile come etichetta della lookup
   */
  @Input("placeholder") placeholder: string | undefined;

  /**
   * Proprietà che sarà bindata sull'etichetta della lookup, default: 'label'
   */
  @Input("bindLabel") bindLabel: string = "Label";

  /**
   * Definisce la key relativa all'oggetto presente nella lookup. Di default è ID
   */
  @Input("bindKey") bindKey: string = "ID";
  /**
   * Datasource della lookup
   */
  @Input("items") items: Array<any> | null = null;

  /**
   * Testo visualizzato in caso di risultati non trovati, se non specificato viene proposto un testo di default
   */
  @Input("notFoundText") notFoundText: string = "Nessun risultato trovato";

  /**
   * Configurazione contenente il nome del componente, e gli eventuali parametri, da utilizzare
   * per la creazione di nuovi elementi dalla lookup
   */
  @Input("genericAddComponent") genericAddComponent: DynamicLoaderDirectiveData | undefined;

  /**
   * Definisce se la lookup accetta più valori, all'invio sul server sono gestiti come array di oggetti
   */
  @Input("isMultiple") isMultiple: boolean = false;

  /**
   * Definisce se è possibile digitare caratteri all'interno della lookup
   */
  @Input("isSearchable") isSearchable: boolean = true;

  /**
   * Definisce se è possibile mostrare il pulsante cancella nella lookup
   */
  @Input("isClearable") isClearable: boolean = true;

  /**
   * Render dinamico per una mole di dati elevata, utilizzare quando il datasource contiene molti elementi e risulta lento il caricamento dei dati
   */
  @Input("isVirtualScroll") isVirtualScroll: boolean = false;

  /**
   * Definisce se la lookup è solo in lettura
   */
  @Input("isReadonly") isReadonly: boolean = false;

  /**
   * Definisce se la lookup è obbligatorio che abbia un valore
   */
  @Input("isRequired") isRequired: boolean = false;

  /**
   * Proprietà per disabilitare la lookup
   */
  @Input("isDisabled") isDisabled: boolean = false;

  /**
   * Nome dell'entità di tipo LookupDTO che sarà passato nel lookup.service/GetLookupEntities
   */
  @Input("entityType") entityType: string | undefined;

  /**
   * Scrivere in caso di utilizzo di formControlName, il nome del formGroup utilizzato nel tag <form>
   */
  @Input("formGroupInput") formGroupInput: any;

  /**
   * Nome del formControlName da utilizzare
   */
  @Input("formControlNameInput") formControlNameInput: any;

  /**
   * ngModel da bindare
   */
  @Input("ngModelInput") ngModelInput: any;

  /**
   * Definisce se gli oggetti devono essere filtrati quando inizia la composizione da parte dell'utente
   */
  @Input("isSearchWhileComposing") isSearchWhileComposing: boolean = false;

  /**
   * Definisce se alla lookup deve essere bindato l'intero oggetto o semplicemente l'ID
   */
  @Input("bindCompleteObject") bindCompleteObject: boolean = true;

  /**
   * Input da utilizzare nel caso in cui la lookup è contenuta in un dialog o mat-tab
   * e si hanno problemi di visualizzazione del menù dropdown, passare come input la stringa 'body'
   */
  @Input("appendToInput") appendToInput: string | undefined;

  @Input("disableReloadOnLookupAddingCompleteParent") disableReloadOnLookupAddingCompleteParent: boolean = false;

  /**
   * Se true, rimanendo fermi sulle singole option sarà presente un tooltip con la Label intera della proprietà bindata
   */
  @Input("showOptionTooltip") showOptionTooltip: boolean = false;

  /**
   * Sorting degli elementi della lookup basato sulle Labels
   */
  @Input("sortList") sortList: boolean = false;

  /**
   * Permette di definire (in maniera opzionale) gli eventuali predicati standard da applicare nel recuperare gli item per la lookup
   */
  @Input() dataFilter: Array<LinqPredicateDTO> | null = null;

  /**
   * Permette di definire (in maniera opzionale) le etichette da visualizzare nelle options della lookup
   */
  @Input() customConfig: LookupCustomConfig | null = null;

  /**
   * Permette di definire predicati complessi per la gestione di where part con condizioni complesse messe in OR tra loro
   * (Esempio: grup pi di condizioni che contengono sia AND che OR e che devono essere messe in OR tra loro)
   */
  @Input() complexDataFilter: Array<ComplexLinqPredicateDTO> | null = null;

  /**
   * Datasource iniziale per la lookup, da usare se si vuole bypassare la chiamata al LookupController
   */
  @Input("initialItems") initialItems: Array<any> | null = null;

  /**
   * Opzioni da passare relative all'ngModel (es: {standalone: true})
   */
  @Input("ngModelOptions") ngModelOptions: any = null;

  /**
   * Definisce se è possibile modificare un elemento tramite pulsante di Edit (solo per lookup singole e non multiple)
   */
  @Input("isEditable") isEditable: boolean = false;

  /**
   * Definisce se l'etichetta dell'elemento selezionato deve essere mostrata o meno all'interno di un input multi riga
   */
  @Input("isMultiline") isMultiline: boolean = false;
  /**
   * Valori possibili auto, top e bottom
   */
  @Input("dropdownPosition") dropdownPosition: DropdownPosition = "auto";

  /**
   * Alla pressione del tab permette di selezionare l'elemento all'interno della lookup.
   */
  @Input("selectOnTab") selectOnTab: boolean = false;

  /**
   * Proprietà per effettuare le chiamate utili a popolare la lookup
   */
  @Input("fullUrlHttpCall") fullUrlHttpCall: string | undefined;

  /**
   * Determina il tooltip visualizzato quando si passa il mouse sopra il pulsante di aggiunta
   */
  @Input("addButtonText") addButtonText: string = "Crea nuovo";

  /**
   * Determina il tooltip visualizzato quando si passa il mouse sopra il pulsante di modifica
   */
  @Input("editButtonText") editButtonText: string = "Modifica";

  /**
   * Proprietà per fare in modo che ci sia una voce per selezionare tutti i dati presenti nella lookup
   */
  @Input("selectAll") selectAll: boolean = false;

  /**
   * Testo mostrato per la voce all'interno della lookup che permette di selezionare tutto
   */
  @Input("selectAllText") selectAllText: string = "Seleziona tutto";

  /**
   * Proprietà che permette di raggruppare gli oggetti in base ad una stringa o una funzione
   */
  @Input("groupBy") groupBy: string | ((value: any) => any) = "";

  /**
   * Proprietà per dare un valore tramite funzione ad un gruppo
   */
  @Input("groupValue") groupValue: (groupKey: string, children: any[]) => Object = () => true;

  /**
   * Proprietà su cui viene fatta la groupBy utile in fase di restituzione del dato tramite ngModelChange e FormControlChange
   */
  @Input("groupByProperty") groupByProperty: string;

  /**
   * Proprietà che permette di selezionare un gruppo quando è usata la groupBy
   */
  @Input("selectableGroup") selectableGroup: boolean = false;

  /**
   * Proprietà che permette di selezionare il gruppo piuttosto che tutti gli elementi singolarmente
   */
  @Input("selectableGroupAsModel") selectableGroupAsModel: boolean = false;

  /**
   * Messaggio mostrato come tooltip per il pulsante di cancellazione della selezione
   */
  @Input("clearAllText") clearAllText: string = "Elimina";

  /**
   * Template custom per le opzioni presenti all'interno del menù a tendina
   */
  @Input("customOption") customOption: TemplateRef<any>;

  /**
   * Template custom per la Label dell'elemento selezionato
   */
  @Input("customLabel") customLabel: TemplateRef<any>;

  /**
   * Funzione per manipolare i dati dopo la chiamata HTTP
   */
  @Input("manipulateDataFn") manipulateDataFn: ((items: any) => LookupDTO[]) | undefined;

  /**
   * Funzione per forzare il selected value della select
   */
  @Input("compareFunction") compareFunction = (iteratedObject, bindedObject) => {
    if (iteratedObject == null || iteratedObject.length == 0 || bindedObject == null) return true;

    const iteratedKeyProperty = iteratedObject.Key != null ? "Key" : this.bindKey;
    const bindedKeyProperty = bindedObject?.Key != null ? "Key" : this.bindKey;

    if (iteratedObject[iteratedKeyProperty] != null) {
      return (
        iteratedObject[iteratedKeyProperty] == bindedObject ||
        iteratedObject[iteratedKeyProperty] == bindedObject[bindedKeyProperty]
      );
    } else {
      return iteratedObject == bindedObject;
    }

    // let iteratedKeyProperty = iteratedObject.Key != null ? "Key" : this.bindKey;
    // let bindedKeyProperty = bindedObject?.Key != null ? "Key" : this.bindKey;

    // if (iteratedObject.Key != null || iteratedObject[this.bindKey] != null) {
    //   if (iteratedObject.Key != null)
    //     return iteratedObject != null && bindedObject != null
    //       ? iteratedObject[iteratedKeyProperty] === bindedObject[bindedKeyProperty]
    //       : iteratedObject === bindedObject;
    //   else
    //     return iteratedObject != null && bindedObject != null
    //       ? iteratedObject[iteratedKeyProperty] === bindedObject[bindedKeyProperty]
    //       : iteratedObject === bindedObject;
    // }
  };

  //#endregion

  //#region OUTPUTS
  /**
   * Evento scatenato al cambiare del valore della select
   * Se si usano i gruppi, al suo interno ci sarà il gruppo "esploso" quindi contenente tutti i suoi oggetti
   */
  @Output() ngModelInputChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Evento per tenere traccia del cambiamento avvenuto all'interno del formControl
   * Se si usano i gruppi, al suo interno ci sarà il gruppo "esploso" quindi contenente tutti i suoi oggetti
   */
  @Output() formControlChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Evento emesso quando si è conclusa la procedura di aggiunta nel componente passato tramite 'genericAddComponent'
   * e nel caso in cui 'disableReloadOnLookupAddingCompleteParent' non sia true
   */
  @Output() lookupAddingCompleteParent: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Evento emesso quando l'utente digita all'interno della lookup
   */
  @Output() searchChange: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Evento per tenere traccia della pressione dei tasti quando c'è il focus sulla lookup
   */
  @Output() keydown: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Evento scatenato al clear della select (tasto X)
   */
  @Output() clear: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Evento emesso quando un valore è selezionato
   */
  @Output("valueSelected") valueSelected: EventEmitter<LookupDTO> = new EventEmitter<LookupDTO>();

  //#endregion

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

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    if (event.target.innerWidth < 600) {
      if (!this.class.includes("mobile-view")) this.class = this.class.concat(" mobile-view");
    } else {
      if (this.class.includes("mobile-view")) this.class = this.class.replace(" mobile-view", "");
    }
  }

  guidEdit: string | undefined | null;
  entityID: number | undefined | null;
  class: string = "mat-mdc-form-field";

  constructor(
    private eqpLookupService: EqpLookupService,
    private dialog: MatDialog,
    private elementRef: ElementRef,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.onResize({ target: { innerWidth: window.innerWidth } });

    if (
      (this.fullUrlHttpCall == null || this.fullUrlHttpCall == "") &&
      (this.initialItems == null || this.initialItems == undefined)
    )
      throw new Error("Non è presente un datasource o una fonte di dati per il componente");

    //Se la lookup è obbligatoria aggiunge l'asterisco al placeholder
    if (this.isRequired == true) this.placeholder += " *";

    if (this.selectAll && this.isMultiple) {
      this.groupBy = (item) => this.selectAllText;
      this.groupValue = (groupKey: string, children: any[]) => ({
        Key: this.selectAllText,
        Label: this.selectAllText,
        Total: children.length
      });
      this.selectableGroup = true;
    }

    this.reloadData();

    if (this.isMultiline == true) this.class = "mat-mdc-form-field multiline-lookup";
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes["ngModelInput"] != undefined &&
      changes["ngModelInput"].firstChange == false &&
      JSON.stringify(changes["ngModelInput"].currentValue) != JSON.stringify(changes["ngModelInput"].previousValue)
    ) {
      this.ngModelInput = this.val;
    }
  }

  ngOnDestroy() {
    if (this.interval != null) {
      clearInterval(this.interval);
    }
  }

  ngAfterViewInit() {
    if (this.ngselect) {
      this.ngselect.handleArrowClick = function () {
        if (this.isOpen) {
          this.close();
        } else {
          this.open();
          this.filter("");
        }
      };
    }
    // Se viene passato in input il componente di add, aggiungo il pulsante di add nell'ng-select
    var self = this;

    if (this.genericAddComponent) {
      //Salvo all'interno dell'entityID l'idLookupEntity che serve in caso di possibilità sia di aggiunta che di modifica
      this.entityID = this.genericAddComponent.idLookupEntity;

      //Il pulsante di ADD viene aggiunto solo SE:
      // - In input NON è presente nessun form group
      // - In input E' PRESENTE un form group e tale form group NON RISULTA essere disabilitato
      if (
        !this.isReadonly &&
        !this.isDisabled &&
        (this.formGroupInput == null ||
          this.formGroupInput == undefined ||
          (this.formGroupInput != null && this.formGroupInput != undefined && this.formGroupInput.disabled != true))
      ) {
        let guidAdd = Math.random().toString();
        var addButton = this.elementRef.nativeElement.querySelector(".ng-select-container");
        let tooltip = this.addButtonText;
        addButton.insertAdjacentHTML(
          "beforeend",
          '<span id="' +
            guidAdd +
            '" class="lookup-add-button ng-add-wrapper ng-star-inserted" title="' +
            tooltip +
            '" style="cursor:pointer;padding-left:5px;"><span aria-hidden="true" class= "ng-add" ><i class="fa fa-plus" aria-hidden="true"></i></span></span>'
        );
        if (guidAdd && document.getElementById(guidAdd)) {
          document.getElementById(guidAdd)?.addEventListener(
            "mousedown",
            function (e) {
              e.stopPropagation();

              //Se è in sola lettura o se è disabilitato, allora al click del pulsante non succede nulla
              if (
                self.isReadonly ||
                self.isDisabled ||
                (self.formGroupInput != null && self.formGroupInput.disabled) ||
                (self.formGroupInput != null && self.formGroupInput.controls[self.formControlNameInput].disabled)
              )
                return;

              if (self.genericAddComponent) self.genericAddComponent.idLookupEntity = 0;

              //Proprietà dell'ngSelect messa a false in quanto altrimenti rompe l'add di un articolo (nuovo oggetto bindato ma label non aggiornata)
              // if (self.editableSearchTerm == true && self.ngselect)
              //   self.ngselect.editableSearchTerm = false;
              self.openModalComponent();
            },
            true
          );
        }

        //Gestione edit
        if (this.genericAddComponent.idLookupEntity != null && this.genericAddComponent.idLookupEntity != 0) {
          this.addEditButton();
        }
      }
    }
  }

  addEditButton() {
    //guidEdit è uguale a null quando il pulsante di modifica non è nella lookup
    if (
      this.guidEdit == null &&
      !this.isReadonly &&
      !this.isMultiple &&
      !this.isDisabled &&
      (this.formGroupInput == null ||
        this.formGroupInput == null ||
        (this.formGroupInput != null &&
          this.formControlNameInput != null &&
          (!this.formGroupInput.disabled || !this.formGroupInput.controls[this.formControlNameInput].disabled)))
    ) {
      var self = this;
      this.guidEdit = Math.random().toString();
      var addButton = this.elementRef.nativeElement.querySelector(".ng-select-container");
      let tooltip = this.editButtonText;
      addButton.insertAdjacentHTML(
        "beforeend",
        '<span id="' +
          this.guidEdit +
          '" class="lookup-edit-button ng-add-wrapper ng-star-inserted" title="' +
          tooltip +
          '" style="cursor:pointer;padding-left:5px;"><span aria-hidden="true" class= "ng-add" ><i class="fa fa-edit" aria-hidden="true"></i></span></span>'
      );
      if (document.getElementById(this.guidEdit)) {
        document.getElementById(this.guidEdit)?.addEventListener(
          "mousedown",
          function (e) {
            e.stopPropagation();

            if (
              self.isReadonly ||
              self.isDisabled ||
              (self.formGroupInput != null && self.formGroupInput.disabled) ||
              (self.formGroupInput != null && self.formGroupInput.controls[self.formControlNameInput].disabled)
            )
              return;

            if (self.genericAddComponent) self.genericAddComponent.idLookupEntity = self.entityID;

            //Proprietà dell'ngSelect messa a false in quanto altrimenti rompe l'add di un articolo (nuovo oggetto bindato ma label non aggiornata)
            // if (self.ngselect && self.editableSearchTerm == true)
            //   self.ngselect.editableSearchTerm = false;

            self.openModalComponent();
          },
          true
        );
      }
    }
  }

  removeEditButton() {
    if (this.guidEdit) {
      var editButton = document.getElementById(this.guidEdit);
      if (editButton != null) editButton.remove();

      this.guidEdit = null;
    }
  }

  /**
   * Al change dei valori della select, aggiorno con l'emit il valore
   * @param event
   */
  onChangeSelect(event: any) {
    let realValue = null;
    if (this.bindCompleteObject == false)
      realValue =
        event != null ? (this.isMultiple == true ? event.map((l: any) => l[this.bindKey]) : event[this.bindKey]) : null;
    else realValue = event;

    if (this.ngModelInputChange != null && !this.formGroupInput && !this.formControlNameInput) {
      this.ngModelInputChange.emit(this.createValueToEmit(event, realValue));
    }

    if (this.formGroupInput != null && this.formControlNameInput != null) {
      this.formGroupInput.controls[this.formControlNameInput].setValue(realValue);

      if (this.formControlChange != null) {
        this.formControlChange.emit(this.createValueToEmit(event, realValue));
      }
    }

    this.writeValue(realValue);
    this.cd.detectChanges();

    if (this.genericAddComponent != null && this.isEditable == true) {
      if (event != null && event[this.bindKey] != null) {
        this.entityID = event[this.bindKey];
        this.addEditButton();
      } else {
        this.removeEditButton();
      }
    }
  }

  createValueToEmit(event, realValue) {
    if (this.groupBy != null && this.groupValue != null && this.selectableGroupAsModel) {
      let explodedValue = [];

      //Caso in cui si tratta di un array con lunghezza maggiore di 0
      if (event != null && event.length > 0) {
        for (let elem of event) {
          if (elem["Key"] != null && elem["Total"] != null) {
            for (let e of this.explodeGroups(elem)) {
              explodedValue.push(e);
            }
          } else explodedValue.push(elem);
        }
      }
      //Caso in cui si può trattare o di un array vuoto oppure di un singolo elemento
      else {
        //Se
        if (event["Key"] != null && event["Total"] != null) {
          for (let e of this.explodeGroups(event)) {
            explodedValue.push(e);
          }
        } else {
          if (Array.isArray(event)) return event;
          else explodedValue.push(event);
        }
      }

      return explodedValue;
    } else {
      return realValue;
    }
  }

  explodeGroups(value: { Key: string; Label: string; Total: number }): any[] {
    if (this.selectAll && value.Key == this.selectAllText && value.Label == this.selectAllText)
      return JSON.parse(JSON.stringify(this.items));

    let selectedItem = [];

    if (this.groupByProperty != null) {
      let property = this.groupByProperty.split(".");

      for (let item of this.items) {
        if (property.reduce((a, b) => a[b], item) == value.Key) selectedItem.push(item);
      }
    }

    return selectedItem;
  }

  async reloadData(selectedItemID = null) {
    if (this.initialItems != null && this.initialItems != undefined) {
      this.items = this.initialItems;

      //Se è stato richiesto di forzare la selezione a seguito del reload allora recupera l'elemento dato l'ID e lo valorizza nel controllo (questo caso si presenta quando dopo aver
      //aggiunto un nuovo elemento dalla lookup viene ricaricato il datasource e bisogna preselezionare la lookup con l'elemento appena aggiunto)
      this.forceSelectionAfterReload(selectedItemID);

      this.cd.detectChanges();
    } else {
      if (this.entityType == null) {
        console.error("Non è stato possibile recuperare il nome dell'entità");
      } else if (this.fullUrlHttpCall) {
        this.eqpLookupService
          .GetLookupEntities(
            this.entityType,
            this.dataFilter,
            this.complexDataFilter,
            this.customConfig,
            this.fullUrlHttpCall
          )
          .subscribe((res) => {
            if (this.sortList == true) res.sort(EqpLookupService.dynamicSort(this.bindLabel));

            if (this.manipulateDataFn) {
              res = this.manipulateDataFn(res);
            }

            this.items = res;

            //Se è stato richiesto di forzare la selezione a seguito del reload allora recupera l'elemento dato l'ID e lo valorizza nel controllo (questo caso si presenta quando dopo aver
            //aggiunto un nuovo elemento dalla lookup viene ricaricato il datasource e bisogna preselezionare la lookup con l'elemento appena aggiunto)
            this.forceSelectionAfterReload(selectedItemID);

            this.cd.detectChanges();

            // if(this.ngselect)
            //   this.ngselect.editableSearchTerm = this.editableSearchTerm;
          });
      }
    }
  }

  /**
   * Funzione che forza la selezione dopo che sono stati ricaricati i dati presenti nella lookup.
   * Si occupa anche di gestire l'emissione del dato (esploso in caso di gruppi) tramite EventEmitter
   */
  forceSelectionAfterReload(selectedItemID) {
    if (selectedItemID != null && selectedItemID != undefined) {
      if (!this.isMultiple) this.entityID = selectedItemID;

      let selectedValue = this.items?.find((l) => l[this.bindKey] == selectedItemID);
      if (this.ngModelInputChange != null && (this.formGroupInput == null || this.formControlNameInput == null)) {
        //Gestione in caso di lookup con selezione multipla
        if (this.isMultiple) {
          //Se si tratta del select all, non bisogna fare nulla in quanto il dato è già selezionato
          if (
            this.val != null &&
            this.val.length > 0 &&
            this.val[0].Key != null &&
            this.val[0].Key == this.selectAllText &&
            this.val[0].Total != null
          ) {
            this.ngModelInputChange.emit(this.createValueToEmit(this.val, null));
          } else {
            //Caso in cui ci sia almeno 1 elemento selezionato e almeno 1 sia un gruppo (ha la Key)
            if (this.val != null && this.val.length > 0 && this.val.filter((v) => v.Key != null).length > 0) {
              let property = this.groupByProperty.split(".");

              //Recupero dei gruppi selezionati nell'array
              let groups = this.val.filter((v) => v.Key != null);
              let selectedGroup = null;

              //Tra tutti i gruppi si cerca quello che abbia il valore della Key uguale a quello dell'elemento selezionato
              for (let group of groups) {
                if (!selectedGroup && property.reduce((a, b) => a[b], selectedValue) == group.Key)
                  selectedGroup = JSON.parse(JSON.stringify(group));
              }

              //Se non si è trovato l'elemento selezionato:
              // - nel caso ci sia almeno 1 elemento in "val" allora si concatena al nuovo elemento selezionato
              // - se non c'è un elemento selezionato, allora l'elemento selezionato va scritto in "val" come array
              if (!selectedGroup) {
                if (this.val != null && this.val.length > 0) this.writeValue([...this.val, selectedValue]);
                else this.writeValue([selectedValue]);
              }
            } else {
              // - nel caso ci sia almeno 1 elemento in "val" allora si concatena al nuovo elemento selezionato
              // - se non c'è un elemento selezionato, allora l'elemento selezionato va scritto in "val" come array
              if (this.val != null && this.val.length > 0) this.writeValue([...this.val, selectedValue]);
              else this.writeValue([selectedValue]);
            }
          }

          this.ngModelInputChange.emit(this.createValueToEmit(this.val, null));
        }
        //Gestione in caso di lookup a selezione singola
        else {
          this.writeValue(selectedValue);
          this.ngModelInputChange.emit(this.val);
        }

        this.cd.detectChanges();
      }

      if (this.formGroupInput != null && this.formControlNameInput != null) {
        if (this.formControlChange != null) {
          //Gestione in caso di lookup con selezione multipla
          if (this.isMultiple) {
            //Se si tratta del select all, non bisogna fare nulla in quanto il dato è già selezionato
            if (
              this.selectAll &&
              this.val != null &&
              this.val.length > 0 &&
              this.val[0].Key != null &&
              this.val[0].Key == this.selectAllText &&
              this.val[0].Total != null
            ) {
              this.formControlChange.emit(this.createValueToEmit(this.val, null));
            } else {
              //Caso in cui ci sia almeno 1 elemento selezionato e almeno 1 sia un gruppo (ha la Key)
              if (this.val != null && this.val.length > 0 && this.val.filter((v) => v.Key != null).length > 0) {
                let property = this.groupByProperty.split(".");

                //Recupero dei gruppi selezionati nell'array
                let groups = this.val.filter((v) => v.Key != null);
                let selectedGroup = null;

                //Tra tutti i gruppi si cerca quello che abbia il valore della Key uguale a quello dell'elemento selezionato
                for (let group of groups) {
                  if (!selectedGroup && property.reduce((a, b) => a[b], selectedValue) == group.Key)
                    selectedGroup = JSON.parse(JSON.stringify(group));
                }

                //Se non si è trovato l'elemento selezionato:
                // - nel caso ci sia almeno 1 elemento in "val" allora si concatena al nuovo elemento selezionato
                // - se non c'è un elemento selezionato, allora l'elemento selezionato va scritto in "val" come array
                if (!selectedGroup) {
                  if (this.val != null && this.val.length > 0) this.writeValue([...this.val, selectedValue]);
                  else this.writeValue([selectedValue]);
                }
              } else {
                // - nel caso ci sia almeno 1 elemento in "val" allora si concatena al nuovo elemento selezionato
                // - se non c'è un elemento selezionato, allora l'elemento selezionato va scritto in "val" come array
                if (this.val != null && this.val.length > 0) this.writeValue([...this.val, selectedValue]);
                else this.writeValue([selectedValue]);
              }
            }

            //Emissione del valore selezionato "esploso" così da mostrare anche ciò che c'è all'interno dei gruppi
            this.formControlChange.emit(this.createValueToEmit(this.val, null));

            //Se "val" è un array, allora il form può essere popolato con il suo valore, altrimenti bisogna metterlo
            //sotto forma di array
            if (this.val != null && this.val.length > 0)
              this.formGroupInput.controls[this.formControlNameInput].setValue(this.val);
            else this.formGroupInput.controls[this.formControlNameInput].setValue([this.val]);
          }
          //Gestione in caso di lookup a selezione singola
          else {
            this.writeValue(selectedValue);
            this.formControlChange.emit(this.val);
            this.formGroupInput.controls[this.formControlNameInput].setValue(this.val);
          }

          this.cd.detectChanges();
        }
      }
      //In caso venga passato l'idLookupEntity viene aggiunto il pulsante di edit
      //Viene fatto all'interno di un setTimeout in quanto l'emit dell'ngModelInputChange è asincrono, quindi c'è la necessità di rendere asincrona anche tale aggiunta
      // setTimeout(() => {
      // }, 100);
      if (this.genericAddComponent != null && this.isEditable) {
        this.addEditButton();
      }
    }
  }

  // Sezione two way bindings: Necessario per il funzionamento corretto del ControlValueAccessor (binding ngModel tra più componenti)
  set value(val: any) {
    // if(this.val != null)
    //   this.val = this.isMultiple ? [...this.val, val] : val;
    // else
    this.val = val;

    this.onChange(val);
    this.onTouch(val);

    //Se è stato passato un evento di output allora lo invoca passando l'oggetto selezionato dalla lookup
    if (this.valueSelected) this.valueSelected.emit(this.val);
  }

  writeValue(value: any) {
    this.value = value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }
  // Fine sezione two way bindings

  openModalComponent() {
    let focusElement = <any>document.activeElement;
    focusElement.blur();

    if (this.ngselect) this.ngselect.isOpen = false;
    //SUBSCRIBE PER RICARICARE I DATI DOPO IL SALVATAGGIO SOLTANTO SULLA LOOKUP CORRENTE
    if (this.eqpLookupService.lookupAddingComplete == null)
      this.eqpLookupService.lookupAddingComplete = new EventEmitter<any>();

    var subscription = this.eqpLookupService.lookupAddingComplete.subscribe((res) => {
      subscription.unsubscribe();

      //Riaggiorno l'ID del record appena modificato/inserito (solo nel caso in cui res sia diverso da null)
      //Res è uguale a null quando si chiude la modale con il pulsante "Annulla"
      this.entityID = res != null ? res : this.entityID;

      //Chiude la modale di aggiunta elemento
      if (this.modalAdding) this.modalAdding.close();

      //Se il parametro dell'emit è popolato correttamente con l'ID dell'elemento salvato allora ricarica il datasource della lookup e seleziona in automatico l'elemento appena aggiunto
      if (res != null && res != undefined && res > 0 && this.disableReloadOnLookupAddingCompleteParent != true)
        this.reloadData(res);

      this.lookupAddingCompleteParent.emit(res);
    });

    if (this.dialogDynamic) {
      this.modalAdding = this.dialog.open(this.dialogDynamic, {
        disableClose: true,
        closeOnNavigation: false,
        minWidth: "70%",
        hasBackdrop: true
      });
    }

    if (this.modalAdding) {
      this.modalAdding.afterClosed().subscribe((result) => {
        // if(this.ngselect)
        //   this.ngselect.editableSearchTerm = this.editableSearchTerm;
      });
    }
  }

  updateInitialItems(items: Array<LookupDTO>, selectedItemID = null) {
    this.initialItems = [...items];

    if (this.genericAddComponent != null && this.isEditable == true) this.addEditButton();

    this.reloadData(selectedItemID);
  }

  /**
   * Richiamato allo svuotarsi della lookup tramite pulsante cancella
   * @param event
   */
  lookupCleared(event: any) {
    this.clear.emit(event);
  }

  searchChangeMethod(event: any) {
    this.searchChange.emit(event);
  }

  keydownEvent(event: any) {
    this.keydown.emit(event);
  }

  onBlur(event: any) {
    setTimeout(() => {
      // if (this.ngselect && this.editableSearchTerm == true)
      //   this.ngselect.editableSearchTerm = true;
    }, 100);
  }

  onFocus(event: any) {}
}
