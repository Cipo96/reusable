import { TemplateRef } from "@angular/core";
import { LinqPredicateDTO } from './linqFilterResult.model';

/**
 * Classe utilizzata per la configurazione di filtri custom
 */
export class FilterConfig {
  constructor(filterID?: string,
    filterClass?: FilterSizeClass,
    label?: string,
    propertyName?: string,
    propertyValue?: any,
    inputType?: InputType,
    wherePartType?: WherePartType,
    cvlConfig?: FilterCvlConfig,
    preventRemoval?: boolean) {

    this.FilterID = filterID;
    if (filterClass) this.FilterClass = filterClass;

    this.Label = label;
    this.PropertyName = propertyName;
    this.PropertyObject = propertyValue;
    this.InputType = inputType;
    this.WherePartType = wherePartType;
    this.PreventRemoval = preventRemoval;
    this.EnumData = cvlConfig?.EnumData;
    this.ArrayData = cvlConfig?.ArrayData;
    this.ArrayKeyProperty = cvlConfig?.ArrayKeyProperty;
    this.ArrayValueProperty = cvlConfig?.ArrayValueProperty;
    this.IsEnumSearchable = cvlConfig?.IsSearchable;
    this.ShowEnumCancelButton = cvlConfig?.ShowCancelButton;
    this.EnumSearchText = cvlConfig?.SearchText;
    this.IsEnumMultiSelect = cvlConfig?.IsMultiSelect;
    this.BindLookupFullObject = cvlConfig?.BindFullObject;
  }

  /**
   * Identificativo univoco del filtro
   */
  public FilterID: string;

  /**
   * Permette di definire la classe css da applicare
   * al filtro
   */
  public FilterClass?: FilterSizeClass = FilterSizeClass.SMALL;

  /**
   *
   */
  public CustomFilterClasses?: string;

  /**
   * Etichetta da mostrare per il filtro
   */
  public Label: string;

  /**
   * Valore della proprietà dell'oggetto su cui andrà applicato il filtro
   */
  public PropertyName?: string;

  /**
   * Valore da usare per il filtro.
   */
  public PropertyObject?: any;

  /**
   * Definisce il tipo di filtro da applicare (valori ammessi in base all'enumeratore InputType)
   */
  public InputType: InputType;

  /**
   * Definisce il tipo di operatore logico da utilizzare per la where part
   */
  public WherePartType?: WherePartType;

  /**
   * Se il filtro è di tipo CVL o CVLEnum allora in questa proprietà ci va definita la configurazione della cvl.
   * La cvl verrà renderizzata con una eqp-select
   */
  public CvlConfig?: FilterCvlConfig;

  /**
   * Permette di definire il template esterno da renderizzare come filtro.
   */
  public Externaltemplate?: TemplateRef<any>;

  /**
   * Permette di disabilitare la cancellazione del filtro all'utente.
   * Di default assume il valore FALSE (se true allora nel riepilogo dei filtri applicati non sarà mostrato il pulsante X)
   */
  public PreventRemoval?: boolean = false;

  /**
   * Permette di definire una funzione custom esterna da richiamare per il filtro corrente quando vengono premuti i pulsanti APPLICA FILTRI
   * o RESET
   */
  public CustomWherePartFunction?: (filterConfig: FilterConfig, isResetAll?: boolean, isRemoveFilter?: boolean) => any;

  /**
   * Permette di definire la funzione custom per restituire il valore del filtro applicato, da mostrare nell'header della card
   *
   */
  public CustomAppliedFilterInfoFunction?: (
    filterConfig: FilterConfig,
    isResetAll?: boolean,
    isRemoveFilter?: boolean
  ) => any;

  /**
   * Per i filtri di tipo ContainsElement e NotContainsElement che si basano sull'applicazione di una where part con l'operatore
   * Linq ANY allora questa proprietà permette di definire il nome della proprietà degli oggetti figli su cui applicare la where part.
   * In questo caso dentro PropertyName ci andrà il nome della proprietà contenente la lista di child.
   *
   * (Es: PropertyName = 'Users' e ChildElementPropertyName = 'Role' per filtrare i record che contengono una lista di utenti con uno specifico)
   */
  public ChildElementPropertyName?: string;

  public static CreateStandardFilterConfig(
    filterID: string,
    label: string,
    propertyName: string,
    type: InputType,
    wherePartType: WherePartType,
    filterClass?: FilterSizeClass,
    filterCvlConfig?: FilterCvlConfig,
    externaltemplate?: TemplateRef<any>,
    customWherePartFunction?: (filterConfig: FilterConfig, isResetAll?: boolean, isRemoveFilter?: boolean) => any,
    childElementPropertyName?: string,
    filterValue?: any,
    preventRemoval?: boolean
  ): FilterConfig {
    let filter: FilterConfig = new FilterConfig(
      filterID,
      filterClass,
      label,
      propertyName,
      null,
      type,
      wherePartType,
      filterCvlConfig,
      preventRemoval
    );

    if (externaltemplate) filter.Externaltemplate = externaltemplate;

    if (customWherePartFunction) filter.CustomWherePartFunction = customWherePartFunction;

    if (childElementPropertyName) filter.ChildElementPropertyName = childElementPropertyName;

    if (filterValue) filter.PropertyObject = filterValue;

    return filter;
  }

  /**
   * Se la CVL si basa su un enumeratore allora in questa proprietà va definito il type dell'enumeratore da usare.
   * In questo modo la sorgente dati della CVL sarà l'insieme dei valori definiti per l'enumeratore
   */
  public EnumData?: any;

  /**
   * Se la CVL si basa su un array allora in questa proprietà va definito l'array da mostrare come sorgente dati della CVL
   */
  public ArrayData?: any;

  /**
   * Nel caso di ArrayData definito permette di indicare la proprietà degli oggetti dell'array da bindare al filtro
   */
  public ArrayKeyProperty?: any;

  /**
   * Nel caso di ArrayData definito permette di indicare la proprietà degli oggetti da visualizzare nel filtro
   */
  public ArrayValueProperty?: any;

  /**
   * Se TRUE allora mostra il campo di ricerca all'interno della CVL (default: TRUE)
   */
  public IsEnumSearchable?: boolean = false;

  /**
   * Se TRUE allora mostra il pulsante per pulire la selezione della CVL (default: TRUE)
   */
  public ShowEnumCancelButton?: boolean = true;

  /**
   * Permette di definire l'etichetta per il campo di ricerca della CVL (default: 'Cerca')
   */
  public EnumSearchText?: string = "Cerca";

  /**
   * Permette di definire la multi selezione dei valori della CVL (default: false)
   */
  public IsEnumMultiSelect?: boolean = false;

  /**
   * Se TRUE allora mostra il campo di ricerca all'interno della lookup (default: TRUE)
   */
  public IsLookupSearchable?: boolean = false;

  /**
   * Se TRUE allora mostra il pulsante per pulire la selezione della lookup (default: TRUE)
   */
  public ShowLookupCancelButton?: boolean = true;

  /**
   * Permette di definire l'etichetta per il campo di ricerca della Lookup (default: 'Cerca')
   */
  public LookupSearchText?: string = "Cerca";

  /**
   * Permette di definire la multi selezione dei valori della lookup (default: false)
   */
  public IsLookupMultiple?: boolean = false;

  /**
   * Permette di definire se nella lookup il binding deve considerare tutto l'oggetto
   * (default: true)
   */
  public BindLookupFullObject?: boolean = true;

  /**
   * Permette di definire l'entità della lookup
   */
  public LookupEntityType?: string = null;

  /**
   * Permette di definire l'url per effettuare la chiamata che popola la lookup
   */
  public LookupFullUrlHttpCall?: string = null;

  /**
   * Permette di definire (in maniera opzionale) gli eventuali predicati standard da applicare nel recuperare gli item per la lookup
   */
  public DataFilter?: Array<LinqPredicateDTO> | null = null;

  /**
   * Permette di definire un oggetto contenente la funzione di validazione e la label del suggerimento per validare il campo del filtro
   */
  public ValidationProperties?: ValidationObject;
}

/**
 * Classe che permette di configurare una eqp-select (CVL) per uno specifico filtro
 */
export class FilterCvlConfig {
  /**
   * Se la CVL si basa su un enumeratore allora in questa proprietà va definito il type dell'enumeratore da usare.
   * In questo modo la sorgente dati della CVL sarà l'insieme dei valori definiti per l'enumeratore
   */
  public EnumData?: any;

  /**
   * Se la CVL si basa su un array allora in questa proprietà va definito l'array da mostrare come sorgente dati della CVL
   */
  public ArrayData?: any;

  /**
   * Nel caso di ArrayData definito permette di indicare la proprietà degli oggetti dell'array da bindare al filtro
   */
  public ArrayKeyProperty?: any;

  /**
   * Nel caso di ArrayData definito permette di indicare la proprietà degli oggetti da visualizzare nel filtro
   */
  public ArrayValueProperty?: any;

  /**
   * Se TRUE allora mostra il campo di ricerca all'interno della CVL (default: TRUE)
   */
  public IsSearchable?: boolean = false;

  /**
   * Se TRUE allora mostra il pulsante per pulire la selezione della CVL (default: TRUE)
   */
  public ShowCancelButton?: boolean = true;

  /**
   * Permette di definire l'etichetta per il campo di ricerca (default: 'Cerca')
   */
  public SearchText?: string = "Cerca";

  /**
   * Permette di definire la multi selezione dei valori della CVL (default: false)
   */
  public IsMultiSelect?: boolean = false;

  /**
   * Permette di definire se nella CVL il binding deve considera tutto l'oggetto o solo la proprietà
   * definita dentro ArrayKeyProperty
   * (default: true)
   */
  public BindFullObject?: boolean = true;

  /**
   * Dati gli opportuni parametri restituisce un oggetto FilterCvlConfig pronto all'uso.
   * @param enumData Type dell'enumeratore da usare nella cvl (opzionale)
   * @param arrayData Array da usare nella cvl (opzionale)
   * @param arrayKeyProperty Nome della proprietà da usare come binding (opzionale)
   * @param arrayValueProperty Nome della proprietà da mostrare nella CVL (opzionale)
   * @param isMultiSelect Attiva o disattiva la multiselezione (opzionale)
   * @param isSearchable Attiva o disattiva la ricerca nella CVL (opzionale)
   * @param showCancelButton Attiva o disattiva il pulsante per pulire la selezione nella CVL (opzionale)
   * @param searchText Definisce l'etichetta del campo di ricerca (opzionale)
   * @returns Valida i parametri e restituisce un oggetto di tipo FilterCvlConfig
   */
  static CreateFilterCVLConfig(
    enumData?: any,
    arrayData?: any,
    arrayKeyProperty?: any,
    arrayValueProperty?: any,
    isMultiSelect?: boolean,
    isSearchable?: boolean,
    showCancelButton?: boolean,
    searchText?: string,
    bindFullObject?: boolean
  ): FilterCvlConfig {
    let cvlConfig: FilterCvlConfig = new FilterCvlConfig();

    if ((enumData == null || enumData == undefined) && (arrayData == null || arrayData == undefined)) {
      throw new Error("It's mandatory to define one of the enumData or enumArray properties");
    }

    cvlConfig.ArrayData = arrayData;
    cvlConfig.EnumData = enumData;
    cvlConfig.ArrayKeyProperty = arrayKeyProperty;
    cvlConfig.ArrayValueProperty = arrayValueProperty;

    if (isMultiSelect != null) cvlConfig.IsMultiSelect = isMultiSelect;

    if (isSearchable != null) cvlConfig.IsSearchable = isSearchable;

    if (showCancelButton != null) cvlConfig.ShowCancelButton = showCancelButton;

    if (searchText) cvlConfig.SearchText = searchText;

    if (bindFullObject != null) cvlConfig.BindFullObject = bindFullObject;

    return cvlConfig;
  }
}

/**
 * Classe utilizzata per memorizzare le informazioni sui filtri salvati nel local storage.
 * Utilizzata solo se per la direttiva eqp-filters è stato richiesto il salvataggio dei filtri
 */
export class SavedFilterItem {
  public FilterName: string;
  public PreventRemoval: boolean;
}

export enum InputType {
  Text = 1,
  Number = 2,
  Date = 3,
  Datetime = 4,
  CvlEnum = 5,
  Cvl = 6,
  Boolean = 7,
  BooleanCvl = 8,
  CustomTemplate = 9,
  DateRange = 10,
  Lookup = 11
}

export enum WherePartType {
  Equal = 1,
  NotEqual = 2,
  StringContains = 3,
  StringNotContains = 4,
  GreaterThan = 5,
  GreaterThanOrEqual = 6,
  LessThan = 7,
  LessThanOrEqual = 8,
  ContainsElement = 9,
  NotContainsElement = 10
}

export enum FilterSizeClass {
  SMALL = 1,
  MEDIUM = 2,
  LARGE = 3,
  CUSTOM = 4
}

/**
 * Enumeratore usato come input del componente eqp-filter.
 * Permette di indicare la complessità dell'oggetto da restituire quando viene premuto
 * il pulsante Applica FIltri.
 * La documentazione delle due tipologie è stata riportata nel metodo createFilterValue del componente
 * eqp-filters.component.ts
 */
export enum FilterResultType {
  BASIC = 1,
  ADVANCED = 2
}

/**
 * Utilizzato per battezzare il comportamento e l'aspetto grafico della direttiva eqp-filters.
 * WITH_CARD: viene renderizzata una card espandibile e i filtri sono visualizzati nel mat-card-content. Quando si applicano i filtri nel card-header vengono riepilogati i filtri applicati
 * WITH_BUTTON: viene renderizzato un pulsante (con lo stesso stile del card-header precedente). Alla pressione del pulsante si apre una modale contenente tutti i filtri. Quando si applicano o resettano i filtri la modale si chiude e nel pulsante vengono riepilogati i filtri applicati
 */
export enum FilterMode {
  WITH_CARD = 1,
  WITH_BUTTON = 2
}

export class ValidationObject {
  public Valid?: Function;
  public HintLabel?: string;
}

