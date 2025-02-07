import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

// @ts-ignore: OK
import { EnumHelper } from "@eqproject/eqp-select";

import { FormControl, FormGroup, ValidatorFn } from "@angular/forms";
import { PickerModeEnum } from "@eqproject/eqp-datetimerangepicker";
import { ConfigColumn, TypeColumn } from "@eqproject/eqp-table";
import { LocalizationService } from "./helpers/localization.helper";
import {
  FilterConfig,
  FilterMode,
  FilterResultType,
  FilterSizeClass,
  InputType,
  SavedFilterItem,
  WherePartType
} from "@eqproject/eqp-common";
import { FilterField } from "@eqproject/eqp-common";
import { LinqFilterDTO, LinqPredicateDTO } from "@eqproject/eqp-common";
import { BaseFieldModel, EqpCommonService } from "@eqproject/eqp-common";

const SAVED_FILTER_TITLE_SEPARATOR: string = "$$$";

@Component({
  selector: "eqp-dynamic-filters",
  templateUrl: "./eqp-filters.component.html",
  styleUrls: ["./eqp-filters.component.scss"]
})
export class EqpFiltersComponent implements OnInit {
  //#region Definizione INPUT del componente

  /**
   * Elenco di oggetti di tipo FilterConfig, ciascuno dei quali rappresenta uno specifico filtro da mostrare.
   * (Obbligatorio: SI)
   */
  @Input("filtersConfig") filtersConfig: Array<FilterConfig>;
  @Input("filtersField") filtersField: Array<FilterField>;

  /**
   * Permette di definire il tipo di risultato da restituire al componente chiamante, quando
   * viene premuto il pulsante "Applica Filtri"
   * (Obbligatorio: SI - Default: BASIC)
   */
  @Input("resultType") resultType: FilterResultType = FilterResultType.BASIC;

  /**
   * Permette di definire la modalità d'uso e l'aspetto grafico della direttiva.
   * WITH_CARD: viene renderizzata una card espandibile e i filtri sono visualizzati nel mat-card-content. Quando si applicano i filtri nel card-header vengono riepilogati i filtri applicati
   * WITH_BUTTON: viene renderizzato un pulsante (con lo stesso stile del card-header precedente). Alla pressione del pulsante si apre una modale contenente tutti i filtri. Quando si applicano o resettano i filtri la modale si chiude e nel pulsante vengono riepilogati i filtri applicati
   * (Obbligatorio: SI - Default: WITH_CARD)
   */
  @Input("usingMode") usingMode: FilterMode = FilterMode.WITH_CARD;

  /**
   * Permette di definire l'etichetta da mostrare come titolo per i filtri
   * (Obbligatorio: NO - Default: 'Filtri')
   */
  @Input("filterTitle") filterTitle: string = "Filtri";

  /**
   * Permette di definire l'etichetta da mostrare nell'header della card quando ci sono dei filtri applicati
   * (Obbligatorio: NO - Default: 'Filtri applicati:')
   */
  @Input("filterAppliedTitle") filterAppliedTitle: string = "Filtri applicati:";

  /**
   * Permette di definire l'etichetta del pulsante per applicare i filtri
   * (Obbligatorio: NO - Default: 'Filtra')
   */
  @Input("applyFilterLabel") applyFilterLabel: string = "Filtra";

  /**
   * Permette di definire l'etichetta del pulsante per resettare i filtri
   * (Obbligatorio: NO - Default: 'Reset')
   */
  @Input("resetAllFilterLabel") resetAllFilterLabel: string = "Reset";

  /**
   * Permette di definire l'etichetta del pulsante per ripristinare i valori iniziali dei filtri
   * (Obbligatorio: NO - Default: 'Ripristina filtri iniziali')
   */
  @Input("restoreAllFilterLabel") restoreAllFilterLabel: string = "Ripristina filtri iniziali";

  /**
   * Permette di definire il tooltip mostrato quando si passa sopra il riepilogo di uno dei filtri applicati
   * (Obbligatorio: NO - Default: 'Clicca per rimuovere')
   */
  @Input("clearFilterTooltip") clearFilterTooltip: string = "Clicca per rimuovere questo filtro";

  /**
   * Permette di definire lo stato di partenza della card (se aperta o chiusa)
   * (Obbligatorio: NO)
   */
  @Input("showExpandend") showExpandend: boolean = false;

  /**
   * Permette di definire il culture (e la relativa lingua) da usare per la localizzazione delle date
   */
  @Input("currentCultureSelected") currentCultureSelected: string = "it-IT";

  /**
   * Se TRUE allora invoca l'evento filtersSelected all'onInit del componente
   */
  @Input("applyOnInit") applyOnInit: boolean = false;

  /**
   * Se assume il valore TRUE allora sarà attiva la funzionalità di salvataggio dei filtri; l'utente potrà, dopo aver settato le diverse condizioni,
   * cliccare sul pulsante 'Salva filtri' per memorizzare lo stato del filtro corrente.
   * Tale operazione potrà essere fatta più volte in modo da poter memorizzare più filtri con diverse condizioni.
   * Se la proprietà è TRUE allora è obbligatorio definire l'input saveFilterID
   */
  @Input("saveFilter") saveFilter: boolean = false;

  /**
   * Se saveFilter è TRUE allora questo input è obbligatorio e deve contenere un nome univoco che identifica il componente.
   * Tale valore univoco sarà usato per memorizzare i diversi filtri configurati dall'utente.
   */
  @Input("saveFilterID") saveFilterID: string = null;

  /**
   * Se saveFilter è TRUE allora questo input permette di definire l'etichetta da mostrare per il pulsante di salvataggi dei filtri
   */
  @Input("saveFilterButtonLabel") saveFilterButtonLabel: string = "Salva filtro";

  /**
   * Se saveFilter è TRUE allora questo input permette di definire il titolo della modale per l'inserimento del nome del filtro da salvare
   */
  @Input("saveFilterTitle") saveFilterTitle: string = "Inserire il nome per questo filtro";

  /**
   * Se saveFilter è TRUE allora questo input permette di definire l'etichetta del pulsante di conferma per il salvataggio dei filtri
   */
  @Input("saveFilterConfirmLabel") saveFilterConfirmLabel: string = "Conferma";

  /**
   * Se saveFilter è TRUE allora questo input permette di definire l'etichetta del pulsante di annullamento per il salvataggio dei filtri
   */
  @Input("saveFilterAbortLabel") saveFilterAbortLabel: string = "Annulla";

  /**
   * Se saveFilter è TRUE allora questo input permette di definire l'etichetta della sezione che mostra tutti i filtri precedentemente salvati.
   * (valore di default: 'Filtri salvati')
   */
  @Input("savedFilterLabel") savedFilterLabel: string = "Filtri salvati";

  /**
   * Permette di definire il tooltip da mostrare per ricaricare un filtro tra quelli precedentemente salvati (valore di default: 'Ricarica filtro').
   * Quest'input è utilizzato solo quando saveFilter = TRUE
   */
  @Input("restoreSavedFilterTooltip") restoreSavedFilterTooltip: string = "Ricarica filtro";

  /**
   * Permette di definire il tooltip da mostrare per cancellare un filtro tra quelli precedentemente salvati (valore di default: 'Elimina filtro').
   * Quest'input è utilizzato solo quando saveFilter = TRUE
   */
  @Input("removeSavedFilterTooltip") removeSavedFilterTooltip: string = "Elimina filtro";

  /**
   * Se TRUE allora quando viene premuto il tasto RESET per i filtri che avevano dei valori di default di partenze
   * allora verranno reimpostati quei valori, altrimenti se FALSE tutti i filtri verranno cancellati
   */
  @Input("useInitialValueOnReset") useInitialValueOnReset: boolean = true;

  /**
   * Permette di ridefinire la label da mostrare come tooltip quando si passa con il mouse sopra un filtro
   * per il quale PreventRemoval = TRUE (cioè quando per un filtro viene impedita l'eliminazione)
   */
  @Input("filterPreventRemovalTooltip") filterPreventRemovalTooltip: string = "Non è possibile rimuovere questo filtro";

  /**
   * Se TRUE salva nel localstorage gli ultimi filtri selezionati dall'utente e li ricarica
   * nell'init del componente se il parametro applyOnInit è TRUE.
   */
  @Input("saveLastFilter") saveLastFilter: boolean = false;

  /**
   * Nome dato al set dei filtri impostati per essere salvati nel localstorage.
   */
  @Input("savedLastFilterName") savedLastFilterName: string = "Ultimi filtri usati";

  /**
   * Se TRUE e si stanno usando i filtri nella card piuttosto che nel dialog (ovvero usingMode == usingModeEnum.WITH_CARD)
   * allora posiziona il pulsante per collassare la card a sinistra, altrimenti lo posiziona a destra.
   */
  @Input("leftCollapseIcon") leftCollapseIcon: boolean = true;

  /**
   * Se TRUE mostra l'icona di un inbuto a sinistra del titolo nel riepilogo dei filtri applicati
   */
  @Input("showAppliedFiltersIcon") showAppliedFiltersIcon: boolean = false;

  //#endregion

  /**
   * Array di ConfigColumn che verranno convertiti in filtri, nel caso in cui si voglia integrare eqp-filters a una eqp-table
   */
  @Input("eqpTableConfigColumns") eqpTableConfigColumns: Array<ConfigColumn> = null;

  //#endregion

  /**
   * Array di FilterField che verranno aggiunti ai filtri ottenuti dalle ConfigColumn
   */
  @Input("eqpTableAdditionalFilters") eqpTableAdditionalFilters: Array<FilterField> = null;

  //#endregion

  //#region Definizione OUTPUT del componente

  /**
   * Evento di output invocato quando vengono premuti i pulsanti APPLICA o RESET
   */
  @Output() filtersSelected: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Evento di output invocato quando vengono ricaricati i filtri dal localstorage e il filtro corrente prevede un template esterno.
   * Tale evento viene invocato solo se il filtro ha un template esterno e solo se per eqp-filters è stata richiesta la memorizzazione dei filtri.
   * La configurazione completa del filtro viene passata come parametro dell'evento.
   */
  @Output() customFiltersSavedValueLoaded: EventEmitter<any> = new EventEmitter<any>();

  //#endregion

  //#region Proprietà per gestione salvataggio filtri

  public currentFilterName: string = null;
  public allSavedFilters: Array<SavedFilterItem> = new Array<SavedFilterItem>();
  dialogSaveFilterRef: MatDialogRef<TemplateRef<any>>;
  @ViewChild("dialogSaveFilter", { static: false }) dialogSaveFilter: TemplateRef<any>;

  //#endregion

  public usingModeEnum = FilterMode;
  public TypeEnum = InputType;
  public collapsed: boolean = true;
  public isFiltersApplied: boolean = false;

  public appliedFilters: any = null;
  public infoAppliedFilters: Array<FilterConfig> = new Array<FilterConfig>();
  public pickerModeEnum = PickerModeEnum;
  public submitted = false;
  public filtersForm: FormGroup = new FormGroup({});
  // filtersMatcher = new FiltersErrorStateMatcher(this);

  /**
   * Utilizzato per mostrare il pulsante di ripristino valore iniziale dei filtri.
   * Assume il valore TRUE se e solo se l'input useInitialValueOnReset è stato passato con valore FALSE ed esiste almeno
   * un filtro per cui è stato definito il valore di partenza.
   * Quando assume il valore TRUE allora permette di visualizzare, oltre ai tasti FILTRA e RESET, anche il tasto RIPRISTINA VALORI DI DEFAULT
   * che anzichè pulire tutti i filtri riporterà tutti i filtri col valore iniziale (solo per quei filtri per cui esiste un valore iniziale)
   */
  public showRestoreDefaultFilters: boolean = false;

  //#region Proprietà per gestione modale applicazione filtri (usate solo se usingMode = WITH_BUTTON)

  dialogModalFiltersRef: MatDialogRef<TemplateRef<any>>;
  @ViewChild("dialogModalFilters", { static: false }) dialogModalFilters: TemplateRef<any>;

  //#endregion

  constructor(
    private cd: ChangeDetectorRef,
    private localizationService: LocalizationService,
    private enumHelper: EnumHelper,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.localizationService.setLanguage(this.currentCultureSelected);
    this.localizationService.initPossibileLanguages();

    if (this.filtersField != null)
      this.checkAndConvertFilterField()

    this.collapsed = !this.showExpandend;

    if (this.eqpTableConfigColumns != null && this.eqpTableConfigColumns != undefined) {
      this.createFiltersFromConfigColumns();
    }
    this.checkFilters();

    //Setta i valori di default e in aggiunta una proprietà definita a runtime per memorizzare il valore iniziale del filtro
    //(in questo modo se qualche filtro ha un valore iniziale definito e diverso da NULL quando si clicca su RESET verrà riproposto quel valore anzichè NULL)
    this.filtersConfig.forEach((config) => {
      config.FilterClass = config.FilterClass ? config.FilterClass : FilterSizeClass.SMALL;
      config.EnumSearchText = config.EnumSearchText != null ? config.EnumSearchText : "Cerca";
      config.PreventRemoval = config.PreventRemoval != null ? config.PreventRemoval : false;
      config.IsEnumSearchable = config.IsEnumSearchable != null ? config.IsEnumSearchable : false;
      config.ShowEnumCancelButton = config.ShowEnumCancelButton != null ? config.ShowEnumCancelButton : true;
      config.IsEnumMultiSelect = config.IsEnumMultiSelect != null ? config.IsEnumMultiSelect : false;
      config.IsLookupSearchable = config.IsLookupSearchable != null ? config.IsLookupSearchable : false;
      config.ShowLookupCancelButton = config.ShowLookupCancelButton != null ? config.ShowLookupCancelButton : true;
      config.IsLookupMultiple = config.IsLookupMultiple != null ? config.IsLookupMultiple : false;
      config.BindLookupFullObject = config.BindLookupFullObject != null ? config.BindLookupFullObject : true;
      config["InitialValue"] = config.PropertyObject;
    });

    //Se ci sono dei filtri per cui è stato specificato un valore iniziale di default e se è stato specificato
    //di non settare il valore iniziale quando si preme il tasto RESET (quindi se useInitialValueOnReset è FALSE) allora mostra il pulsante
    //di RIPRISTINO VALORI INIZIALI altrimenti lo nasconde
    this.showRestoreDefaultFilters =
      this.filtersConfig.filter((f) => f["InitialValue"] != null && f["InitialValue"] != undefined).length > 0 &&
      this.useInitialValueOnReset != true;

    //Se è stato richiesto di memorizzare i filtri nel localStorage allora all'init del componente ricarica tutti i filtri, se presenti,
    //dal local storage in modo da mostrarli all'utente con i nomi precedentemente stabiliti
    if (this.saveFilter == true) {
      this.reloadAllSaveFilters();
    }

    if (this.applyOnInit == true) {
      //Se è stato richiesto di memorizzare nel localstorage gli ultimi filtri impostati dall'utente allora cerca la
      //configurazione tra i filtri salvati e se la trova la carica prima di applicare i filtri.
      if (this.saveLastFilter && this.allSavedFilters.find((f) => f.FilterName == this.savedLastFilterName))
        this.restoreSavedFilter(this.allSavedFilters.find((f) => f.FilterName == this.savedLastFilterName));

      this.applyFilters();
    }

    this.createForm();
  }

  /**
   * Verifica la validità dei filtri configurati.
   * Se riscontra degli errori interrompe la procedura e genera un'eccezione
   */
  checkFilters() {
    //Verifica che siano stati definiti i filtri
    if (this.filtersConfig == null || this.filtersConfig == undefined || this.filtersConfig.length == 0) {
      throw new Error("It's mandatory to indicate at least one filter");
    }

    //Verifica che per tutti i filtri siano stati indicati gli identificativi
    if (
      this.filtersConfig.filter((f) => f.FilterID == null || f.FilterID == undefined || f.FilterID == "").length > 0
    ) {
      throw new Error("For each configured filter it is necessary to define the unique identifier");
    }

    //Verifica che non ci siano identificativi duplicati
    if (
      this.filtersConfig.map((f) => f.FilterID).filter((v, i, a) => a.indexOf(v) === i).length !=
      this.filtersConfig.length
    ) {
      throw new Error("In the configured filters there are duplicate identifiers");
    }

    //Verifica che per i filtri di tipo ExternalTemplate sia stata definita la funzione esterna da richiamare
    if (
      this.filtersConfig.find(
        (f) =>
          f.InputType == InputType.CustomTemplate &&
          (f.CustomWherePartFunction == null || f.CustomWherePartFunction == undefined)
      ) != null
    ) {
      let errorMessage =
        "For CustomTemplate filters it is mandatory to define the external function to be called for the filter composition";
      throw new Error(errorMessage);
    }

    //Verifica che per i filtri di tipo CVL, CVL ENUM e BOOLEAN CVL sia stata indicata la configurazione della CVL
    // if (this.filtersConfig.filter(f => f.CvlConfig == null && (f.InputType == InputType.BooleanCvl || f.InputType == InputType.Cvl)).length > 0) {
    //   throw new Error("For filters of type Cvl and BooleanCvl it is mandatory to define the configuration of the cvl to show");
    // }

    //Verifica che se è stata richiesta la memorizzazione dei filtri allora deve essere indicato anche il nome da attribuire all'oggetto del localstorage per questa configurazione
    if (
      this.saveFilter == true &&
      (this.saveFilterID == null || this.saveFilterID == undefined || this.saveFilterID == "")
    ) {
      throw new Error(
        "If saveFilter is TRUE then it is mandatory to define the saveFilterID parameter. This parameter must contain the unique name to be given to the configuration in the local storage"
      );
    }

  }

  //#region Gestione FilterField

  /**
   * Controllo se è tutto configurato correttamente ed eventualmente converto l'array di FilterField nel
   * modello base utilizzato nel componente (FilterConfig)
   */
  checkAndConvertFilterField() {

    this.checkFilterField();

    //Se mi viene passato direttamente un array di BaseFieldModel, prima lo converto in un array di FilterFields
    if (EqpCommonService.isBaseField(this.filtersField))
      this.filtersField = EqpCommonService.convertAs<FilterField>(this.filtersField, FilterField, this.filtersField.map(x => x.key));

    this.filtersConfig = FilterField.createFilterConfigs(this.filtersField);
  }

  /**
   * Faccio i controlli del caso, per capire se è stato configurato bene il nuovo filtro
   */
  private checkFilterField() {
    if (this.filtersConfig != null && this.filtersField != null) {
      throw new Error(
        "Can't use simultaneously filtersConfig and filtersField"
      );
    }
  }

  //#endregion

  /**
   * Restituisce la classe CSS da applicare per dimensionare il filtro in base al valore attribuito alla proprietà
   * FilterClass del filtro configurato.
   * Se tale proprietà non è definita allora viene impostata di default la classe relativa alla dimensione SMALL
   * @param filter Filtro per cui applicare la classe di ridimensionamento
   * @returns Restituisce una classe di bootstrap da applicare per il ridimensionamento in colonne del filtro
   */
  getFilterSizeClass(filter: FilterConfig): string {
    if (filter == null || filter == undefined) return "col-4";

    if (filter.FilterClass == FilterSizeClass.SMALL) return "col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4";
    else if (filter.FilterClass == FilterSizeClass.MEDIUM) return "col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8";
    else if (filter.FilterClass == FilterSizeClass.LARGE) return "col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12";
    else if (filter.FilterClass == FilterSizeClass.CUSTOM && filter.CustomFilterClasses)
      return filter.CustomFilterClasses;
    else return "col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4";
  }

  /**
   * Funzione scatenata al click sul mat-card-header.
   * Se la modalità d'uso è WITH_BUTTON allora apre la modale per l'impostazione filtri
   * mentre se la modalità è WITH_CARD espande la card con tutti i filtri all'interno
   */
  cardHeaderClick() {
    if (this.usingMode == FilterMode.WITH_BUTTON) {
      this.dialogModalFiltersRef = this.dialog.open(this.dialogModalFilters, {
        disableClose: false,
        hasBackdrop: true,
        autoFocus: false,
        minWidth: "70%"
      });
    } else if (this.usingMode == FilterMode.WITH_CARD) this.collapsed = !this.collapsed;
  }

  //#region Gestione funzioni Applica Filtri e Reset Filtri

  /**
   * Ricostruisce l'oggetto (o l'array complesso) in base al valore impostato nei filtri e al tipo di risultato richiesto.
   * Se è stato richiesto un tipo risultato BASIC allora la funzione restituirà un oggetto avente tante proprietà quanti sono
   * i filtri popolati, ciascuna proprietà avrà lo stesso nome proprietà definito nel filtro e come valore il valore impostato dall'utente.
   * Se invece è stato richiesto un tipo risultato ADVANCED allora restituirà un array di oggetti complessi, dove per ciascun oggetto saranno indicati
   * il nome della proprietà, il tipo di operatore, il valore etc... (tale configurazione restituisce quindi un array di oggetti di tipo LinqPredicateDTO)
   * @param isReset Serve per i filtri con funzione esterna per sapere se è stato premuto il tasto FILTRA o il tasto RESET
   */
  applyFilters(filterIDToRemove: string = null, submitted = false) {
    this.submitted = submitted;

    // Se il form non è valido mi fermo
    if (this.filtersForm.invalid && this.submitted) {
      //Imposto i campi a 'touched' in modo da far vedere gli errori
      this.filtersForm.markAllAsTouched();
      return;
    }

    //Se il tipo di risultato richiesto è BASIC allora setta a null l'oggetto da restituire altrimenti
    //se ADVANCED lo istanzia come array vuoto
    if (this.resultType == FilterResultType.BASIC) this.appliedFilters = null;
    else this.appliedFilters = [];

    //Cicla l'elenco dei filtri per cui risulta definito il valore, in modo da ricostruire l'oggetto da ricostruire al componente
    //che ha richiesto l'applicazione dei filtri
    this.filtersConfig
      .filter((f) => f.FilterID != filterIDToRemove)
      .forEach((f) => {
        //Se si tratta di un filtro di tipo BooleanCvl e il valore è diverso da TRUE e FALSE allora ignora il filtro
        if (
          f.InputType == InputType.BooleanCvl &&
          f.PropertyObject &&
          f.PropertyObject[f.ArrayKeyProperty] != true &&
          f.PropertyObject[f.ArrayKeyProperty] != false
        )
          return;

        //Richiama la funzione che si occupa di ricostruire l'oggetto valido del filtro
        //in base a come è stata configurata la direttiva
        this.createFilterValue(f);
      });

    //Se è stato chiesto di salvare gli ultimi filtri selezionati dall'utente imposta come nome del filtro il
    //nome definito dallo sviluppatore tramite l'input savedLastFilterName e li salva nel localstorage.
    if (this.saveLastFilter) {
      if (
        this.appliedFilters == null ||
        this.appliedFilters.length == 0 ||
        Object.keys(this.appliedFilters).length == 0
      ) {
        if (this.allSavedFilters.find((f) => f.FilterName == this.savedLastFilterName))
          this.removeSavedFilter(this.allSavedFilters.find((f) => f.FilterName == this.savedLastFilterName));
      } else {
        this.currentFilterName = this.savedLastFilterName;
        this.saveFiltersOnLocalStorage();
      }
    }

    //Se risultato è BASIC allora risultano filtri applicati se l'oggetto è diverso da NULL
    //altrimenti i filtri saranno applicati se l'array da restituire contiene almeno un valore
    if (this.resultType == FilterResultType.BASIC) {
      //Se è stata richiesta la creazione di un filtro BASIC ma non è stato popolato nessuno filtro (caso che si presenta quando si rimuovono
      //manualmente tutti i filtri presenti) allora this.appliedFilters risulta definito ma vuoto (cioè {}) quindi per normalizzarlo
      //verifico che se è un oggetto vuoto allora lo reimposto a null
      if (this.appliedFilters != null && Object.keys(this.appliedFilters).length == 0) this.appliedFilters = null;

      this.isFiltersApplied = this.appliedFilters != null && this.appliedFilters != undefined;
    } else this.isFiltersApplied = this.appliedFilters.length > 0;

    //Invoca l'evento di output che indica il reset dei filtri avvenuto con successo
    if (this.filtersSelected) this.filtersSelected.emit(this.appliedFilters);

    this.getAllAppliedFilters();

    //Se siamo in modalità WITH_BUTTON e risulta definita la modale allora la chiude
    if (this.usingMode == FilterMode.WITH_BUTTON && this.dialogModalFiltersRef) this.dialogModalFiltersRef.close();
  }

  /**
   * Svuota le proprietà del filtro e notifica al chiamante passando NULL come oggetti LinqPredicateDTO
   */
  resetFilters() {
    //Cicla tutti i filtri e:
    // - Se il filtro ha una funzione custom allora la invoca passando il parametro isResetAll = TRUE per indicare che è stato richiesto un RESET completo
    // - Se il filtro è Standard (quindi senza funzione custom) ed aveva un valore iniziale impostata ed è stato indicato di ripristinare sempre il valore iniziale
    //   allora reimposta il PropertyObject con il valore iniziale del filtro
    // - Se invece il filtro è Standard ma non aveva un valore iniziale definito imposta direttamente la proprietà PropertyObject = null
    //Infine chiama il metodo ApplyFilters che si occuperà di costruire l'oggetto da usare per il filtro in accordo con l'operazione di reset richiesta
    this.filtersConfig.forEach((f) => {
      if (f.CustomWherePartFunction)
        f.CustomWherePartFunction(
          f,
          this.useInitialValueOnReset == true ? true : null,
          this.useInitialValueOnReset == true ? null : true
        );
      else if (f["InitialValue"] != null && f["InitialValue"] != undefined && this.useInitialValueOnReset == true) {
        this.filtersForm.controls[f.FilterID].setValue(f["InitialValue"]);
        f.PropertyObject = f["InitialValue"];
      } else {
        if (f.InputType != InputType.DateRange) {
          this.filtersForm.controls[f.FilterID].setValue(null);
        } else {
          this.filtersForm.controls[f.FilterID + "_START"].setValue(null);
          this.filtersForm.controls[f.FilterID + "_END"].setValue(null);
        }
        f.PropertyObject = null;
      }
    });

    this.applyFilters();

    this.filtersForm.markAsUntouched();
  }

  /**
   * Funzione richiamata quando si clicca per la rimozione di uno specifico filter (sull'header della card, dove viene mostrato il riepilogo dei filtri applicati).
   * Si occupa di settare a null il valore del filtro e di richiamare la funzione che riapplica tutti i filtri
   * @param appliedFilter Oggetto di tipo FilterConfig contenente il filtro che si intende rimuovere
   */
  removeFilter(appliedFilter: FilterConfig) {
    if (
      appliedFilter == null ||
      appliedFilter == undefined ||
      this.filtersConfig.find((f) => f.FilterID == appliedFilter.FilterID) == null
    )
      return;

    //Se per il filtro corrente è stato specificato di impedirne la rimozione allora esce senza fare nulla
    if (appliedFilter.PreventRemoval == true) return;

    //Se il filtro ha una funzione custom allora la invoca passando il parametro isReset a TRUE per indicare che è stata richiesta la rimozione solo per il filtro corrente
    //altrimenti se il filtro è standard imposta direttamente a null la proprietà PropertyObject
    //Inoltre tiene traccia dell'ID del filtro per cui è stata richiesta la rimozione in modo da poterlo passare al metodo applyFilters che lo ignorerà
    let filter = this.filtersConfig.find((f) => f.FilterID == appliedFilter.FilterID);
    let filterID = filter.FilterID;
    //Se il filtro ha una funzione custom definita la invoca, passando però il parametro isReset a TRUE per indicare che è stato chiesto il reset del valore
    if (filter.CustomAppliedFilterInfoFunction != null && filter.CustomAppliedFilterInfoFunction != undefined) {
      filter.CustomWherePartFunction(filter, null, true);
    }

    //Annulla la proprietà PropertyObject (usata sempre per i filtri standard)
    filter.PropertyObject = null;

    //Richiama il metodo applyFilters in modo da riapplicare tutti i filtri tranne quello per cui è stata richiesta la rimozione
    this.applyFilters(filterID);
  }

  /**
   * Se ci sono filtri per cui la proprietà InitialValue (definita a runtime sull'OnInit)
   * risulta popolata allora reimposta il PropertyObject di questi filtri con il valore della proprietà
   * InitialValue e richiama la funzione che riapplica i filtri
   */
  restoreInitialValueFilters() {
    if (
      this.useInitialValueOnReset == true ||
      this.filtersConfig.filter(
        (f) => !f.CustomWherePartFunction && f["InitialValue"] != null && f["InitialValue"] != undefined
      ).length == 0
    )
      return;

    this.filtersConfig.forEach((f) => {
      if (!f.CustomWherePartFunction)
        f.PropertyObject = f["InitialValue"] != null && f["InitialValue"] != undefined ? f["InitialValue"] : null;
      else f.CustomWherePartFunction(f, true, false);
    });

    this.applyFilters();
  }

  /**
   * A partire dal filtro passato come parametro ricostruisce un oggetto
   * da aggiungere all'elenco totale dei filtri da applicare.
   *
   * Il parametro isReset serve per per i filtri con funzione esterna, per sapere se è stato premuto il tasto FILTRA o RESET
   * @param currentFilterConfig
   * @param isReset
   * @returns
   */
  private createFilterValue(currentFilterConfig: FilterConfig) {
    if (currentFilterConfig == null || currentFilterConfig == undefined) return;

    //Se non è stata definita una funzione esterna e PropertyObject è null allora esce senza considerare il filtro corrente
    if (
      !currentFilterConfig.CustomWherePartFunction &&
      (currentFilterConfig.PropertyObject == null || currentFilterConfig.PropertyObject == undefined)
    )
      return;

    //Normalizza l'oggetto da popolare se NULL, in base al tipo richiesto
    if (this.appliedFilters == null && this.resultType == FilterResultType.BASIC) this.appliedFilters = {};
    else if (this.appliedFilters == null && this.resultType == FilterResultType.ADVANCED) this.appliedFilters = [];

    //Se per il filtro corrente è stata definita una funzione esterna da richiamare allora la invoca
    //In tal caso, se il risultato richiesto è di tipo BASIC allora prende tutte le proprietà dell'oggetto restituito
    //dalla funzione esterna e le riporta (con gli stessi valori) dentro l'oggetto da restituire.
    //Se invece è stato chiesto un risultato ADVANCED allora aggiunge all'array l'oggetto così come restituito dalla funzione esterna
    if (currentFilterConfig.CustomWherePartFunction) {
      let customWPValue = currentFilterConfig.CustomWherePartFunction(currentFilterConfig);
      if (customWPValue) {
        if (this.resultType == FilterResultType.BASIC) {
          Object.keys(customWPValue).forEach((key) => {
            this.appliedFilters[key] = customWPValue[key];
          });
        } else this.appliedFilters.push(customWPValue);
      }
      return;
    }

    //Se si arriva qui è perchè non è stata passata una funzione esterna, quindi sarà il componente a comporre l'oggetto da restituire.
    //Se risultato richiesto = BASIC e l'oggetto appliedFilters non contiene già una chiave con lo stesso nome del propertyName della config corrente
    //allora aggiunge la nuova chiave col valore impostato per il filtro
    //Se risultato richiesto = ADVANCED allora compone l'oggetto AdvancedFilterResultDTO e lo aggiunge all'array
    if (this.resultType == FilterResultType.BASIC && !(currentFilterConfig.PropertyName in this.appliedFilters)) {
      this.appliedFilters[currentFilterConfig.PropertyName] = currentFilterConfig.PropertyObject;
    } else if (this.resultType == FilterResultType.ADVANCED) {
      let predicateDTO: LinqPredicateDTO = new LinqPredicateDTO();
      predicateDTO.PropertyFilters = new Array<LinqFilterDTO>();

      if (currentFilterConfig.InputType == InputType.Cvl && currentFilterConfig.IsEnumMultiSelect == true) {
        if (currentFilterConfig.PropertyObject.length == 0) return null;

        for (let i = 0; i < currentFilterConfig.PropertyObject.length; i++) {
          let filterDTO: LinqFilterDTO = new LinqFilterDTO();
          filterDTO.PropertyName = currentFilterConfig.PropertyName;
          filterDTO.RelationType = currentFilterConfig.WherePartType;
          filterDTO.ListElementPropertyName = currentFilterConfig.ChildElementPropertyName;
          filterDTO.PropertyValue = currentFilterConfig.PropertyObject[i][currentFilterConfig.ArrayKeyProperty];
          predicateDTO.PropertyFilters.push(filterDTO);
        }
      } else if (
        (currentFilterConfig.InputType == InputType.Cvl && currentFilterConfig.IsEnumMultiSelect == false) ||
        currentFilterConfig.InputType == InputType.BooleanCvl
      ) {
        let filterDTO: LinqFilterDTO = new LinqFilterDTO();
        filterDTO.PropertyName = currentFilterConfig.PropertyName;
        filterDTO.RelationType = currentFilterConfig.WherePartType;
        filterDTO.ListElementPropertyName = currentFilterConfig.ChildElementPropertyName;
        filterDTO.PropertyValue = currentFilterConfig.PropertyObject[currentFilterConfig.ArrayKeyProperty];
        predicateDTO.PropertyFilters.push(filterDTO);
      } else if (currentFilterConfig.InputType == InputType.CvlEnum && currentFilterConfig.IsEnumMultiSelect == true) {
        if (currentFilterConfig.PropertyObject.length == 0) return null;

        for (let i = 0; i < currentFilterConfig.PropertyObject.length; i++) {
          let filterDTO: LinqFilterDTO = new LinqFilterDTO();
          filterDTO.PropertyName = currentFilterConfig.PropertyName;
          filterDTO.RelationType = currentFilterConfig.WherePartType;
          filterDTO.ListElementPropertyName = currentFilterConfig.ChildElementPropertyName;
          filterDTO.PropertyValue = currentFilterConfig.PropertyObject[i];
          predicateDTO.PropertyFilters.push(filterDTO);
        }
      } else if (currentFilterConfig.InputType == InputType.CvlEnum && currentFilterConfig.IsEnumMultiSelect == false) {
        let filterDTO: LinqFilterDTO = new LinqFilterDTO();
        filterDTO.PropertyName = currentFilterConfig.PropertyName;
        filterDTO.RelationType = currentFilterConfig.WherePartType;
        filterDTO.ListElementPropertyName = currentFilterConfig.ChildElementPropertyName;
        filterDTO.PropertyValue = currentFilterConfig.PropertyObject;
        predicateDTO.PropertyFilters.push(filterDTO);
      } else if (currentFilterConfig.InputType == InputType.Lookup && currentFilterConfig.IsLookupMultiple == true) {
        if (currentFilterConfig.PropertyObject.length == 0) return null;

        for (let i = 0; i < currentFilterConfig.PropertyObject.length; i++) {
          let filterDTO: LinqFilterDTO = new LinqFilterDTO();
          filterDTO.PropertyName = currentFilterConfig.PropertyName;
          filterDTO.RelationType = currentFilterConfig.WherePartType;
          filterDTO.ListElementPropertyName = currentFilterConfig.ChildElementPropertyName;
          filterDTO.PropertyValue = currentFilterConfig.PropertyObject[i].ID;
          predicateDTO.PropertyFilters.push(filterDTO);
        }
      } else if (currentFilterConfig.InputType == InputType.Lookup && currentFilterConfig.IsLookupMultiple == false) {
        let filterDTO: LinqFilterDTO = new LinqFilterDTO();
        filterDTO.PropertyName = currentFilterConfig.PropertyName;
        filterDTO.RelationType = currentFilterConfig.WherePartType;
        filterDTO.ListElementPropertyName = currentFilterConfig.ChildElementPropertyName;
        filterDTO.PropertyValue = currentFilterConfig.PropertyObject.ID;
        predicateDTO.PropertyFilters.push(filterDTO);
      } else if (currentFilterConfig.InputType == InputType.DateRange) {
        if (!currentFilterConfig.PropertyObject.from || !currentFilterConfig.PropertyObject.to) return;

        //Creazione LinqPredicate per la data di inizio
        let startDatePredicateDTO: LinqPredicateDTO = new LinqPredicateDTO();
        startDatePredicateDTO.PropertyFilters = new Array<LinqFilterDTO>();
        let startFilterDTO: LinqFilterDTO = new LinqFilterDTO();
        startFilterDTO.PropertyName = currentFilterConfig.PropertyName;
        startFilterDTO.RelationType = WherePartType.GreaterThanOrEqual;
        startFilterDTO.ListElementPropertyName = currentFilterConfig.ChildElementPropertyName;
        startFilterDTO.PropertyValue = currentFilterConfig.PropertyObject.from;
        startDatePredicateDTO.PropertyFilters.push(startFilterDTO);
        this.appliedFilters.push(startDatePredicateDTO);

        //Creazione LinqFilter per la data di fine
        let endFilterDTO: LinqFilterDTO = new LinqFilterDTO();
        endFilterDTO.PropertyName = currentFilterConfig.PropertyName;
        endFilterDTO.RelationType = WherePartType.LessThanOrEqual;
        endFilterDTO.ListElementPropertyName = currentFilterConfig.ChildElementPropertyName;
        endFilterDTO.PropertyValue = currentFilterConfig.PropertyObject.to;
        predicateDTO.PropertyFilters.push(endFilterDTO);
      } else {
        let filterDTO: LinqFilterDTO = new LinqFilterDTO();
        filterDTO.PropertyName = currentFilterConfig.PropertyName;
        filterDTO.RelationType = currentFilterConfig.WherePartType;
        filterDTO.ListElementPropertyName = currentFilterConfig.ChildElementPropertyName;
        filterDTO.PropertyValue = currentFilterConfig.PropertyObject;
        predicateDTO.PropertyFilters.push(filterDTO);
      }

      this.appliedFilters.push(predicateDTO);
    }
  }

  //#endregion

  //#region Funzioni per la gestione del salvataggio e recupero dei filtri nel localstorate

  /**
   * Funzione richiamata quando viene premuto il tasto "Salva filtro" e si occupa di aprire una modale
   * per l'inserimento del nome del filtro da memorizzare.
   */
  public openModalSaveFiltersOnLocalStorage(filterName: string = null) {
    if (filterName) this.currentFilterName = filterName;

    this.dialogSaveFilterRef = this.dialog.open(this.dialogSaveFilter, {
      disableClose: false,
      hasBackdrop: true,
      autoFocus: false,
      width: "40%"
    });
  }

  /**
   * Se saveFilter e saveFilterID sono definite allora memorizza nel localStorage un base64 contenente
   * l'intera configurazione dei filtri che risultano applicati
   *
   * N.B. Al momento non vengono salvati i filtri che utilizzano funzioni esterne in quanto il valore non è determinabile a priori
   * e non sarebbe possibile effettuare il binding inverso quando si chiede di ricaricare i filtri precedentemente salvati
   * @returns
   */
  public saveFiltersOnLocalStorage() {
    if (this.saveFilter != true || !this.saveFilterID) {
      return;
    }

    let filtersValueToSave: any = {};
    this.filtersConfig.forEach((f) => {
      if (f.CustomWherePartFunction) f.CustomWherePartFunction(f);
      filtersValueToSave[f.FilterID] = f.PropertyObject;
    });

    let currentDate: Date = new Date();
    let fullFilterName =
      this.saveFilterID +
      SAVED_FILTER_TITLE_SEPARATOR +
      (this.currentFilterName
        ? this.currentFilterName
        : "Filtro " + currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear());
    let cryptedFilterConfigSaved = window.btoa(encodeURIComponent(JSON.stringify(filtersValueToSave)));
    localStorage.setItem(fullFilterName, cryptedFilterConfigSaved);

    this.closeModalSaveFilterOnLocalStorage();
  }

  /**
   * Chiude la modale per la memorizzazione del filtro e svuota la stringa bindata all'input per l'inserimento del nome del filtro
   */
  public closeModalSaveFilterOnLocalStorage() {
    this.currentFilterName = null;
    if (this.dialogSaveFilterRef) this.dialogSaveFilterRef.close();
    this.reloadAllSaveFilters();
  }

  /**
   * Funzione che recupera tutti i filtri memorizzati nel localstorage associati a quest'istanza di eqp-filters
   */
  public reloadAllSaveFilters() {
    this.allSavedFilters = new Array<SavedFilterItem>();

    //Recupera tutte le chiavi presenti nel localStorage e filtra prendendo solo quelle che hanno come prefisso lo stesso valore della stringa indicata nell'input saveFilterID
    let allStorageKeysFiltered = Object.keys(localStorage).filter((p) => p.startsWith(this.saveFilterID));

    if (!allStorageKeysFiltered || allStorageKeysFiltered.length == 0) return;

    allStorageKeysFiltered.forEach((key) => {
      let filterName: string = key.split(SAVED_FILTER_TITLE_SEPARATOR)[1];
      let savedFilterItem: any = {
        FilterName: filterName,
        PreventRemoval: false
      };
      this.allSavedFilters.push(savedFilterItem);
    });
  }

  /**
   * Funzione richiamata quando viene richiesto di ricaricare uno dei filtri precedentemente salvati.
   * La funzione si occupa di recuperare dal localstorage il filtro richiesto e di mostrarne i valori dentro la form di applicazione filtri.
   *
   * Se il parametro saveFilter è diverso da TRUE allora la funzione non esegue alcun comando.
   * @param filterToRestore Oggetto relativo al filtro selezionato da ricaricare
   */
  restoreSavedFilter(filterToRestore: SavedFilterItem) {
    if (this.saveFilter != true) return;

    //Ricompone il nome completo del filtro per il localstorage concatenando l'input saveFilterID, il separatore $$$ e il nome del filtro visualizzato
    let filterFullName: string = this.saveFilterID + SAVED_FILTER_TITLE_SEPARATOR + filterToRestore.FilterName;

    //Se nel local storage non è presente la configurazione salvata allora esce senza far nulla
    let cryptedFilterConfigSaved = localStorage.getItem(filterFullName);
    if (cryptedFilterConfigSaved == null || cryptedFilterConfigSaved == undefined) return;

    //Decripta la configurazione salvata nel localStorage e la cicla per ricostruire i valori da reimpostare per i filtri
    let savedAppliedFilters = JSON.parse(decodeURIComponent(window.atob(cryptedFilterConfigSaved)));
    if (savedAppliedFilters) {
      let savedFiltersKey: string[] = Object.keys(savedAppliedFilters);
      savedFiltersKey.forEach((key) => {
        let config: FilterConfig = this.filtersConfig.find((f) => f.FilterID == key);
        if (config != null) {
          if (config.InputType != InputType.DateRange) {
            this.filtersForm.controls[key].setValue(savedAppliedFilters[key]);
          } else {
            this.filtersForm.controls[key + "_START"].setValue(savedAppliedFilters[key].from);
            this.filtersForm.controls[key + "_END"].setValue(savedAppliedFilters[key].to);
          }

          //TO DO: se si tratta di un filtro con template esterno allora invoca l'evento per notificare al componente che usa il pacchetto
          //che deve ricaricare il valore dei filtri in base a quanto memorizzato nel localstorage
          if (config.CustomWherePartFunction && config.Externaltemplate && this.customFiltersSavedValueLoaded)
            this.customFiltersSavedValueLoaded.emit(config);
        }
      });
    }
  }

  /**
   * Funzione richiamata quando viene premuto il tasto per rimuovere un filtro tra quelli salvati.
   * La funzione si occupa di eliminare dal localStorage il filtro avente come nome quello selezionato e poi ricarica l'elenco dei filtri
   * salvati.
   * Se il parametro saveFilter è diverso da TRUE allora la funzione non esegue alcun comando.
   * @param filterToRemove Oggetto relativo al filtro selezionato da eliminare
   */
  removeSavedFilter(filterToRemove: SavedFilterItem) {
    if (this.saveFilter != true) return;

    //Ricompone il nome completo del filtro per il localstorage concatenando l'input saveFilterID, il separatore $$$ e il nome del filtro visualizzato
    let filterFullName: string = this.saveFilterID + SAVED_FILTER_TITLE_SEPARATOR + filterToRemove.FilterName;

    //Rimuove dal localstorage l'elemento corrispondente
    localStorage.removeItem(filterFullName);

    //Ricarica l'elenco dei filtri salvati
    this.reloadAllSaveFilters();
  }

  //#endregion

  //#region Gestione funzioni per la composizione del riepilogo dei filtri applicati e relativa gestione

  /**
   * Restituisce l'elenco dei filtri che risultano applicati in modo da poterli mostrare nell'header della card
   * @returns Restituisce un array di oggetti di tipo FilterConfig
   */
  getAllAppliedFilters() {
    this.infoAppliedFilters = [];

    this.filtersConfig.forEach((p) => {
      //Se non è stata definita una funzione esterna e PropertyObject è null allora esce senza considerare il filtro corrente
      if (
        (!p.CustomWherePartFunction && (p.PropertyObject == null || p.PropertyObject == undefined)) ||
        (p.CustomWherePartFunction && p.CustomWherePartFunction(p, false) == null)
      )
        return;

      let filter: FilterConfig = new FilterConfig();
      filter.FilterID = p.FilterID;
      filter.InputType = p.InputType;
      if (p.InputType == InputType.DateRange) {
        if (!p.PropertyObject.from || !p.PropertyObject.to) return;

        filter.PropertyObject = { from: p.PropertyObject.from, to: p.PropertyObject.to };
      } else {
        filter.PropertyObject = p.PropertyObject;
      }
      filter.Label = p.Label;
      filter.EnumData = p.EnumData;
      filter.IsEnumMultiSelect = p.IsEnumMultiSelect;
      filter.ArrayData = p.ArrayData;
      filter.ArrayKeyProperty = p.ArrayKeyProperty;
      filter.ArrayValueProperty = p.ArrayValueProperty;
      filter.IsLookupMultiple = p.IsLookupMultiple;
      filter.BindLookupFullObject = p.BindLookupFullObject;

      filter.CustomAppliedFilterInfoFunction = p.CustomAppliedFilterInfoFunction;
      filter.PreventRemoval = p.PreventRemoval;

      if (p.InputType == InputType.Boolean && p.PropertyObject != true) return;

      this.infoAppliedFilters.push(filter);
    });
  }

  /**
   * Se il filtro corrente è di tipo CustomTemplate ed è stata definita la funzione CustomAppliedFilterInfoFunction
   * allora la invoca altrimenti restituisce il valore della proprietà PropertyObject del filtro
   * @param appliedFilter Filtro corrente
   * @returns
   */
  getCustomFilterValue(appliedFilter: FilterConfig) {
    if (appliedFilter == null || appliedFilter == undefined) return;

    if (
      appliedFilter.CustomAppliedFilterInfoFunction != null &&
      appliedFilter.CustomAppliedFilterInfoFunction != undefined
    )
      return appliedFilter.CustomAppliedFilterInfoFunction(appliedFilter);
    else return appliedFilter.PropertyObject;
  }

  /**
   * Funzione richiamata per la composizione del riepilogo (sull'header) del filtro selezionato,
   * quando quest'ultimo prevede una CVL quindi nei casi di Cvl, CvlEnum e BooleanCvl.
   * Si occupa di restituire il displayValue del valore selezionato nella tendina
   * @param appliedFilter Configurazione del filtro per cui restituire il valore selezionato normalizzato
   * @returns
   */
  getCvlValueSelected(appliedFilter: FilterConfig) {
    if (appliedFilter == null || appliedFilter == undefined) return null;

    if (appliedFilter.PropertyObject == null) return null;
    //Se è una CVL da un enumeratore allora utilizza l'enumHelper di eqp-select per ricostruire l'array dei valori possibili, per
    //poi restituire il valore associato alla key uguale al PropertyObject del filtro
    if (appliedFilter.InputType == InputType.CvlEnum) {
      let enumArrays = this.enumHelper.getEnumArray(appliedFilter.EnumData, false, null);
      return appliedFilter.IsEnumMultiSelect != true
        ? enumArrays.find((p) => p.ID == appliedFilter.PropertyObject) != null
          ? enumArrays.find((p) => p.ID == appliedFilter.PropertyObject).Label
          : null
        : enumArrays
          .filter((p) => appliedFilter.PropertyObject.includes(p.ID))
          .map((p) => p.Label)
          .join(",");
    } else if (appliedFilter.InputType == InputType.BooleanCvl) {
      return appliedFilter.ArrayData.find(
        (p) => p[appliedFilter.ArrayKeyProperty] == appliedFilter.PropertyObject[appliedFilter.ArrayKeyProperty]
      ) != null
        ? appliedFilter.ArrayData.find(
          (p) => p[appliedFilter.ArrayKeyProperty] == appliedFilter.PropertyObject[appliedFilter.ArrayKeyProperty]
        )[appliedFilter.ArrayKeyProperty]
        : null;
    } else if (appliedFilter.InputType == InputType.Cvl) {
      return appliedFilter.IsEnumMultiSelect != true
        ? appliedFilter.ArrayData.find(
          (p) => p[appliedFilter.ArrayKeyProperty] == appliedFilter.PropertyObject[appliedFilter.ArrayKeyProperty]
        ) != null
          ? appliedFilter.ArrayData.find(
            (p) => p[appliedFilter.ArrayKeyProperty] == appliedFilter.PropertyObject[appliedFilter.ArrayKeyProperty]
          )[appliedFilter.ArrayValueProperty]
          : null
        : appliedFilter.ArrayData.filter((p) =>
          appliedFilter.PropertyObject.map((p) => p[appliedFilter.ArrayKeyProperty]).includes(
            p[appliedFilter.ArrayKeyProperty]
          )
        )
          .map((p) => p[appliedFilter.ArrayValueProperty])
          .join(",");
    } else if (appliedFilter.InputType == InputType.Lookup) {
      return appliedFilter.IsLookupMultiple != true
        ? appliedFilter.PropertyObject != null
          ? appliedFilter.PropertyObject.Label
          : null
        : appliedFilter.PropertyObject.map((p) => p.Label).join(",");
    }
  }

  //#endregion

  createFiltersFromConfigColumns() {
    this.filtersConfig = [];

    this.eqpTableConfigColumns.forEach((element) => {
      if (!element.type && !element.numberPipe && element.isFilterable) {
        this.filtersConfig.push({
          FilterID: element.key + "_ID",
          Label: element.display,
          PropertyName: element.key,
          InputType: InputType.Text,
          WherePartType: WherePartType.Equal
        });
      }
      if (element.type == TypeColumn.Boolean && element.isFilterable) {
        this.filtersConfig.push({
          FilterID: element.key + "_ID",
          Label: element.display,
          PropertyName: element.key,
          InputType: InputType.Boolean,
          WherePartType: WherePartType.Equal
        });
      }
      if (element.type == TypeColumn.Enum && element.isFilterable) {
        this.filtersConfig.push({
          FilterID: element.key + "_ID",
          Label: element.display,
          PropertyName: element.key,
          InputType: InputType.CvlEnum,
          WherePartType: WherePartType.Equal,
          EnumData: element.enumModel
        });
      }
      if (element.type == TypeColumn.Date && element.isFilterable) {
        this.filtersConfig.push({
          FilterID: element.key + "_ID",
          Label: element.display,
          PropertyName: element.key,
          InputType: InputType.Date,
          WherePartType: WherePartType.Equal
        });
      }
      if (!element.type && element.numberPipe && element.isFilterable) {
        this.filtersConfig.push({
          FilterID: element.key + "_ID",
          Label: element.display,
          PropertyName: element.key,
          InputType: InputType.Number,
          WherePartType: WherePartType.Equal
        });
      }
    });
    if (this.eqpTableAdditionalFilters) {
      let convertedAdditionalFilters: Array<FilterConfig> = FilterField.createFilterConfigs(this.eqpTableAdditionalFilters);
      EqpCommonService.mergeAdditionalProps(this.filtersConfig, convertedAdditionalFilters, 'PropertyName');
    }
  }

  createForm() {
    this.filtersConfig.forEach((filter) => {
      if (filter.InputType == InputType.DateRange) {
        let areValidatorsIncorrect = this.checkIfValidatorsAreIncorrect(filter);
        this.filtersForm.addControl(filter.FilterID + "_START", new FormControl(null));
        this.filtersForm.controls[filter.FilterID + "_START"].valueChanges.subscribe((newValue) => {
          if (!filter.PropertyObject) {
            filter.PropertyObject = { from: null, to: null };
          }
          filter.PropertyObject.from = newValue;
        });
        if (areValidatorsIncorrect) {
          this.filtersForm.addControl(filter.FilterID + "_END", new FormControl(null));
        } else {
          this.filtersForm.addControl(
            filter.FilterID + "_END",
            new FormControl(null, this.customValidator(filter, true))
          );
        }
        this.filtersForm.controls[filter.FilterID + "_END"].valueChanges.subscribe((newValue) => {
          if (filter.PropertyObject) filter.PropertyObject.to = newValue;
        });
      } else {
        let areValidatorsIncorrect = this.checkIfValidatorsAreIncorrect(filter);
        if (areValidatorsIncorrect) {
          this.filtersForm.addControl(filter.FilterID, new FormControl(null));
        } else {
          this.filtersForm.addControl(filter.FilterID, new FormControl(null, this.customValidator(filter)));
        }
        this.filtersForm.controls[filter.FilterID].valueChanges.subscribe((newValue) => {
          filter.PropertyObject = newValue;
        });
      }
    });
  }

  customValidator(filter: FilterConfig, endRangeDate = false): ValidatorFn {
    if (filter.ValidationProperties) {
      return (control: FormControl): { [key: string]: any } | null => {
        var controlValue;
        switch (filter.InputType) {
          case InputType.Text:
            controlValue = control.value;
            break;
          case InputType.Number:
            controlValue = parseInt(control.value);
            break;
          case InputType.Date:
            controlValue = control.value ? new Date(new Date(control.value).toDateString()) : null;
            break;
          case InputType.Datetime:
            controlValue = control.value ? new Date(new Date(control.value).toDateString()) : null;
            break;
          case InputType.CvlEnum:
            controlValue = control.value;
            break;
          case InputType.Cvl:
            controlValue = control.value;
            break;
          case InputType.BooleanCvl:
            controlValue = control.value;
            break;
          case InputType.DateRange:
            controlValue = control.value ? new Date(new Date(control.value).toDateString()) : null;
            break;
          case InputType.Lookup:
            controlValue = control.value;
            break;
        }
        if (filter.InputType == InputType.DateRange) {
          let startRangeFilterPropertyObject = this.filtersForm.controls[filter.FilterID + "_START"]
            ? this.filtersForm.controls[filter.FilterID + "_START"].value
            : null;
          let endRangeFilterPropertyObject = endRangeDate
            ? controlValue
            : this.filtersForm.controls[filter.FilterID + "_END"]
              ? this.filtersForm.controls[filter.FilterID + "_END"].value
              : null;
          const invalid = !filter.ValidationProperties.Valid(
            new Date(new Date(startRangeFilterPropertyObject).toDateString()),
            new Date(new Date(endRangeFilterPropertyObject).toDateString())
          );
          return invalid ? { invalid: invalid } : null;
        } else {
          const invalid = !filter.ValidationProperties.Valid(controlValue);
          return invalid ? { invalid: invalid } : null;
        }
      };
    }
  }

  checkIfValidatorsAreIncorrect(filter: FilterConfig) {
    if (filter.ValidationProperties) {
      if (filter.ValidationProperties.Valid.length != 1 && filter.InputType != InputType.DateRange) {
        console.error("ValidationProperties.Valid() must have one argument");
        return true;
      }
      if (filter.ValidationProperties.Valid.length != 2 && filter.InputType == InputType.DateRange) {
        console.error("ValidationProperties.Valid() must have two arguments for a DateRange filter");
        return true;
      }
      switch (filter.InputType) {
        case InputType.Text:
          if (filter.ValidationProperties.Valid("Test") != true && filter.ValidationProperties.Valid("Test") != false) {
            console.error("ValidationProperties.Valid() must return a boolean value");
            return true;
          }
          break;
        case InputType.Number:
          if (filter.ValidationProperties.Valid(9999) != true && filter.ValidationProperties.Valid(9999) != false) {
            console.error("ValidationProperties.Valid() must return a boolean value");
            return true;
          }
          break;
        case InputType.Date:
          if (
            filter.ValidationProperties.Valid(new Date()) != true &&
            filter.ValidationProperties.Valid(new Date()) != false
          ) {
            console.error("ValidationProperties.Valid() must return a boolean value");
            return true;
          }
          break;
        case InputType.Datetime:
          if (
            filter.ValidationProperties.Valid(new Date()) != true &&
            filter.ValidationProperties.Valid(new Date()) != false
          ) {
            console.error("ValidationProperties.Valid() must return a boolean value");
            return true;
          }
          break;
        case InputType.CvlEnum:
          if (filter.ValidationProperties.Valid({}) != true && filter.ValidationProperties.Valid({}) != false) {
            console.error("ValidationProperties.Valid() must return a boolean value");
            return true;
          }
          break;
        case InputType.Cvl:
          if (filter.ValidationProperties.Valid({}) != true && filter.ValidationProperties.Valid({}) != false) {
            console.error("ValidationProperties.Valid() must return a boolean value");
            return true;
          }
          break;
        case InputType.BooleanCvl:
          if (filter.ValidationProperties.Valid({}) != true && filter.ValidationProperties.Valid({}) != false) {
            console.error("ValidationProperties.Valid() must return a boolean value");
            return true;
          }
          break;
        case InputType.DateRange:
          if (
            filter.ValidationProperties.Valid(new Date()) != true &&
            filter.ValidationProperties.Valid(new Date()) != false &&
            filter.ValidationProperties.Valid(new Date(), new Date()) != true &&
            filter.ValidationProperties.Valid(new Date(), new Date()) != false
          ) {
            console.error("ValidationProperties.Valid() must return a boolean value");
            return true;
          }
          break;
        case InputType.Lookup:
          if (filter.ValidationProperties.Valid({}) != true && filter.ValidationProperties.Valid({}) != false) {
            console.error("ValidationProperties.Valid() must return a boolean value");
            return true;
          }
          break;
      }
    } else {
      return true;
    }
  }

  get f() {
    return this.filtersForm.controls;
  }
}
