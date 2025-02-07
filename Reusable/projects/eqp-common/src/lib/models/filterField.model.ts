
import { FilterConfig, FilterCvlConfig, FilterSizeClass, InputType, ValidationObject, WherePartType } from './filterConfig.model';
import { TemplateRef } from '@angular/core';
import { LinqPredicateDTO } from './linqFilterResult.model';
import { BaseFieldModel, BaseType } from './base-field.model';
import { FieldSizeClass } from './common-enum.model';

export class FilterField extends BaseFieldModel {
  constructor(filterID?: string,
    fieldClass?: FieldSizeClass,
    label?: string,
    propertyName?: string,
    propertyValue?: any,
    inputType?: InputType,
    wherePartType?: WherePartType,
    cvlConfig?: FilterCvlConfig,
    preventRemoval?: boolean) {

    super();
    this.filterID = filterID;
    if (fieldClass) this.fieldSizeClass = fieldClass;

    this.display = label;
    this.key = propertyName;
    this.value = propertyValue;
    this.inputType = inputType;
    this.wherePartType = wherePartType;
    this.preventRemoval = preventRemoval;
    this.arrayData = cvlConfig?.ArrayData;
    this.arrayKeyProperty = cvlConfig?.ArrayKeyProperty;
    this.arrayValueProperty = cvlConfig?.ArrayValueProperty;
    this.isEnumSearchable = cvlConfig?.IsSearchable;
    this.showEnumCancelButton = cvlConfig?.ShowCancelButton;
    this.enumSearchText = cvlConfig?.SearchText;
    this.isEnumMultiSelect = cvlConfig?.IsMultiSelect;
    this.bindLookupFullObject = cvlConfig?.BindFullObject;
    this.placeholder = label;
  }

  /**
   * Identificativo univoco del filtro
   */
  public filterID: string;

  /**
   * Permette di definire la classe css da applicare
   * al filtro
   */
  public fieldSizeClass?: FieldSizeClass = FieldSizeClass.SMALL;

  /**
   *
   */
  public customFieldSizeClasses?: string;


  /**
   * Definisce il tipo di filtro da applicare (valori ammessi in base all'enumeratore InputType)
   */
  public inputType?: InputType;

  /**
   * Definisce il tipo di operatore logico da utilizzare per la where part
   */
  public wherePartType?: WherePartType;

  /**
   * Se il filtro è di tipo CVL o CVLEnum allora in questa proprietà ci va definita la configurazione della cvl.
   * La cvl verrà renderizzata con una eqp-select
   */
  public cvlConfig?: FilterCvlConfig;

  /**
   * Permette di disabilitare la cancellazione del filtro all'utente.
   * Di default assume il valore FALSE (se true allora nel riepilogo dei filtri applicati non sarà mostrato il pulsante X)
   */
  public preventRemoval?: boolean = false;

  /**
   * Definisce il placeholder che verrà utilizzato nel campo del singolo filtro
   */
  public placeholder?: string;

  /**
   * Permette di definire il template esterno da renderizzare come filtro.
   */
  public externalTemplate?: TemplateRef<any>;

  /**
   * Permette di definire una funzione custom esterna da richiamare per il filtro corrente quando vengono premuti i pulsanti APPLICA FILTRI
   * o RESET
   */
  public customWherePartFunction?: (filterConfig: FilterConfig, isResetAll?: boolean, isRemoveFilter?: boolean) => any;

  /**
   * Permette di definire la funzione custom per restituire il valore del filtro applicato, da mostrare nell'header della card
   *
   */
  public customAppliedFilterInfoFunction?: (
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
  public childElementPropertyName?: string;

  public static createStandardFilterConfig(
    filterID: string,
    label: string,
    propertyName: string,
    type: InputType,
    wherePartType: WherePartType,
    filterClass?: FieldSizeClass,
    filterCvlConfig?: FilterCvlConfig,
    externaltemplate?: TemplateRef<any>,
    customWherePartFunction?: (filterConfig: FilterConfig, isResetAll?: boolean, isRemoveFilter?: boolean) => any,
    childElementPropertyName?: string,
    filterValue?: any,
    preventRemoval?: boolean
  ): FilterField {
    let filter: FilterField = new FilterField(
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

    if (externaltemplate) filter.externalTemplate = externaltemplate;

    if (customWherePartFunction) filter.customWherePartFunction = customWherePartFunction;

    if (childElementPropertyName) filter.childElementPropertyName = childElementPropertyName;

    if (filterValue) filter.value = filterValue;

    return filter;
  }

  /**
   * Se la CVL si basa su un enumeratore allora in questa proprietà va definito il type dell'enumeratore da usare.
   * In questo modo la sorgente dati della CVL sarà l'insieme dei valori definiti per l'enumeratore
   */
  // public enumData?: any;

  /**
   * Se la CVL si basa su un array allora in questa proprietà va definito l'array da mostrare come sorgente dati della CVL
   */
  public arrayData?: any;

  /**
   * Nel caso di ArrayData definito permette di indicare la proprietà degli oggetti dell'array da bindare al filtro
   */
  public arrayKeyProperty?: any;

  /**
   * Nel caso di ArrayData definito permette di indicare la proprietà degli oggetti da visualizzare nel filtro
   */
  public arrayValueProperty?: any;

  /**
   * Se TRUE allora mostra il campo di ricerca all'interno della CVL (default: TRUE)
   */
  public isEnumSearchable?: boolean = false;

  /**
   * Se TRUE allora mostra il pulsante per pulire la selezione della CVL (default: TRUE)
   */
  public showEnumCancelButton?: boolean = true;

  /**
   * Permette di definire l'etichetta per il campo di ricerca della CVL (default: 'Cerca')
   */
  public enumSearchText?: string = "Cerca";

  /**
   * Permette di definire la multi selezione dei valori della CVL (default: false)
   */
  public isEnumMultiSelect?: boolean = false;

  /**
   * Se TRUE allora mostra il campo di ricerca all'interno della lookup (default: TRUE)
   */
  public isLookupSearchable?: boolean = false;

  /**
   * Se TRUE allora mostra il pulsante per pulire la selezione della lookup (default: TRUE)
   */
  public showLookupCancelButton?: boolean = true;

  /**
   * Permette di definire l'etichetta per il campo di ricerca della Lookup (default: 'Cerca')
   */
  public lookupSearchText?: string = "Cerca";

  /**
   * Permette di definire la multi selezione dei valori della lookup (default: false)
   */
  public isLookupMultiple?: boolean = false;

  /**
   * Permette di definire se nella lookup il binding deve considerare tutto l'oggetto
   * (default: true)
   */
  public bindLookupFullObject?: boolean = true;

  /**
   * Permette di definire l'entità della lookup
   */
  public lookupEntityType?: string = null;

  /**
   * Permette di definire l'url per effettuare la chiamata che popola la lookup
   */
  public lookupFullUrlHttpCall?: string = null;

  /**
   * Permette di definire (in maniera opzionale) gli eventuali predicati standard da applicare nel recuperare gli item per la lookup
   */
  public dataFilter?: Array<LinqPredicateDTO> | null = null;

  /**
   * Permette di definire un oggetto contenente la funzione di validazione e la label del suggerimento per validare il campo del filtro
   */
  public validationProperties?: ValidationObject;

  static createFilterFields(baseField: BaseFieldModel): FilterField;
  static createFilterFields(baseFields: BaseFieldModel[]): FilterField[];
  static createFilterFields(baseFields: BaseFieldModel | BaseFieldModel[]): FilterField | FilterField[] {
    if (Array.isArray(baseFields)) {
      const filterFields: FilterField[] = [];
      baseFields.forEach(field => {
        filterFields.push(this.createFilterField(field));
      });
      return filterFields;
    } else {
      return this.createFilterField(baseFields);
    }
  }

  private static createFilterField(baseField: BaseFieldModel): FilterField {
    const filterField: FilterField = new FilterField();
    filterField.filterID = baseField.key + "_ID";
    filterField.key = baseField.key;
    filterField.display = baseField.display;
    filterField.value = baseField.value;
    filterField.enumModel = baseField.enumModel;
    filterField.inputType = BaseTypeConverterFilter.convertToInputType(baseField.baseType);
    filterField.wherePartType = WherePartType.Equal;
    filterField.baseType = null;

    return filterField;
  }

  public static createFilterConfigs(filterField: FilterField): FilterConfig;
  public static createFilterConfigs(filterFields: FilterField[]): FilterConfig[];
  public static createFilterConfigs(filterFields: FilterField | FilterField[]): FilterConfig | FilterConfig[] {
    if (Array.isArray(filterFields)) {
      const filterConfigs: FilterConfig[] = [];
      filterFields.forEach(field => {
        filterConfigs.push(this.createFilterConfig(field));
      });
      return filterConfigs;
    } else {
      return this.createFilterConfig(filterFields);
    }
  }

  private static createFilterConfig(filterField: FilterField): FilterConfig {
    const filterConfig: FilterConfig = new FilterConfig();

    filterConfig.FilterID = filterField.filterID ?? (filterField.key + "_ID");
    filterConfig.PropertyName = filterField.key;
    filterConfig.Label = filterField.display;
    filterConfig.PropertyObject = filterField.value;
    filterConfig.EnumData = filterField.enumModel;
    filterConfig.Externaltemplate = filterField.externalTemplate;
    filterConfig.ArrayData = filterField.arrayData;
    filterConfig.ArrayKeyProperty = filterField.arrayKeyProperty;
    filterConfig.ArrayValueProperty = filterField.arrayValueProperty;
    filterConfig.BindLookupFullObject = filterField.bindLookupFullObject;
    filterConfig.ChildElementPropertyName = filterField.childElementPropertyName;
    filterConfig.CustomAppliedFilterInfoFunction = filterField.customAppliedFilterInfoFunction;
    filterConfig.CustomFilterClasses = filterField.customFieldSizeClasses;
    filterConfig.CustomWherePartFunction = filterField.customWherePartFunction;
    filterConfig.CvlConfig = filterField.cvlConfig;
    filterConfig.EnumSearchText = filterField.enumSearchText;
    filterConfig.FilterClass = filterField.fieldSizeClass as unknown as FilterSizeClass;
    filterConfig.IsEnumMultiSelect = filterField.isEnumMultiSelect;
    filterConfig.IsEnumSearchable = filterField.isEnumSearchable;
    filterConfig.IsLookupMultiple = filterField.isLookupMultiple;
    filterConfig.LookupEntityType = filterField.lookupEntityType;
    filterConfig.LookupFullUrlHttpCall = filterField.lookupEntityType;
    filterConfig.LookupSearchText = filterField.lookupSearchText;
    filterConfig.DataFilter = filterField.dataFilter;
    filterConfig.PreventRemoval = filterField.preventRemoval;
    filterConfig.ShowEnumCancelButton = filterField.showEnumCancelButton;
    filterConfig.ShowLookupCancelButton = filterField.showLookupCancelButton;
    filterConfig.ValidationProperties = filterField.validationProperties;
    filterConfig.InputType = filterField.inputType ?? InputType.Text;
    filterConfig.WherePartType = filterField.wherePartType ?? WherePartType.Equal;

    return filterConfig;
  }
}

export class BaseTypeConverterFilter {
  static convertToInputType(baseType: BaseType): InputType | undefined {
    switch (baseType) {
      case BaseType.Text:
        return InputType.Text;
      case BaseType.Number:
        return InputType.Number;
      case BaseType.Date:
        return InputType.Date;
      case BaseType.Enum:
        return InputType.CvlEnum;
      case BaseType.Boolean:
        return InputType.Boolean;
      default:
        return undefined;
    }
  }
}
