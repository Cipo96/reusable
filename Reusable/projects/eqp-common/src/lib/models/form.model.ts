import { TemplateRef } from "@angular/core";
import { FieldSizeClass } from "./common-enum.model";
import { BaseFieldModel, BaseType } from "./base-field.model";
import { ValidationObject } from "./filterConfig.model";
import { ComplexLinqPredicateDTO, LinqPredicateDTO, LookupCustomConfig, LookupDTO } from "./linqFilterResult.model";
import { DropdownPosition } from "@ng-select/ng-select";
import { DynamicLoaderDirectiveData } from "../directives/dynamic-loader/dynamic-loader.directive";

export class FormField extends BaseFieldModel {
  required?: boolean = false;
  showInForm?: boolean = true;
  booleanLabelPosition?: BoolLabelPosition = BoolLabelPosition.After;
  formFieldType?: FormFieldType;
  lookupObject?: LookupObject;
  selectObject?: SelectObject;
  validationProperties?: ValidationObject;
  placeholder?: string;
  externalTemplate?: TemplateRef<any>;
  fieldSizeClass?: FieldSizeClass = FieldSizeClass.SMALL;
  customFieldSizeClasses?: string;
  dependentFieldKey?: string;
  orderPosition?: number;
  dependentValidation?: (value: any) => boolean;

  static createFormFields(baseField: BaseFieldModel): FormField;
  static createFormFields(baseFields: BaseFieldModel[]): FormField[];
  static createFormFields(baseFields: BaseFieldModel | BaseFieldModel[]): FormField | FormField[] {
    if (Array.isArray(baseFields)) {
      const formFields: FormField[] = [];
      baseFields.forEach(field => {
        formFields.push(this.createFormField(field));
      });
      return formFields;
    } else {
      return this.createFormField(baseFields);
    }
  }

  private static createFormField(baseField: BaseFieldModel): FormField {
    const formField: FormField = new FormField();
    formField.key = baseField.key;
    formField.display = baseField.display;
    formField.value = baseField.value;
    formField.enumModel = baseField.enumModel;
    formField.formFieldType = BaseTypeConverter.convertToFormFieldType(baseField.baseType);
    formField.baseType = null;

    return formField;
  }
}

export enum FormFieldType {
  Text = 1,
  Number = 2,
  Date = 3,
  Enum = 4,
  Boolean = 5,
  ExternalTemplate = 6,
  Cvl = 7,
  Lookup = 8,
  DateTime = 9,
  DateRange = 10
}

export enum BoolLabelPosition {
  Before = 'before',
  After = 'after'
}

export class LookupObject {
  fullUrlHttpCall: string;
  lookupEntityType: string;
  showLookupCancelButton?: boolean = true;
  isLookupSearchable?: boolean = false;
  isLookupMultiple?: boolean = false;
  placeholder?: string;
  bindLabel?: string = "Label";
  bindKey?: string = "ID";
  items?: Array<any> | null;
  notFoundText?: string = "Nessun risultato trovato";
  genericAddComponent?: DynamicLoaderDirectiveData;
  isMultiple?: boolean = false;
  isSearchable?: boolean = true;
  isClearable?: boolean = true;
  isVirtualScroll?: boolean = false;
  isReadonly?: boolean = false;
  isRequired?: boolean = false;
  isDisabled?: boolean = false;
  entityType?: string;
  formGroupInput?: any;
  formControlNameInput?: any;
  ngModelInput?: any;
  isSearchWhileComposing?: boolean = false;
  bindCompleteObject?: boolean = true;
  appendToInput?: string;
  disableReloadOnLookupAddingCompleteParent?: boolean = false;
  showOptionTooltip?: boolean = false;
  sortList?: boolean = false;
  dataFilter?: Array<LinqPredicateDTO> | null;
  customConfig?: LookupCustomConfig | null;
  complexDataFilter?: Array<ComplexLinqPredicateDTO> | null;
  initialItems?: Array<any> | null;
  ngModelOptions?: any = null;
  isEditable?: boolean = false;
  isMultiline?: boolean = false;
  dropdownPosition?: DropdownPosition = "auto";
  selectOnTab?: boolean = false;
  addButtonText?: string = "Crea nuovo";
  editButtonText?: string = "Modifica";
  selectAll?: boolean = false;
  selectAllText?: string = "Seleziona tutto";
  groupBy?: string | ((value: any) => any) = "";
  groupValue?: (groupKey: string, children: any[]) => Object = () => true;
  groupByProperty?: string;
  selectableGroup?: boolean = false;
  selectableGroupAsModel?: boolean = false;
  clearAllText?: string = "Elimina";
  customOption?: TemplateRef<any>;
  customLabel?: TemplateRef<any>;
  manipulateDataFn?: ((items: any) => LookupDTO[]) | undefined;
  compareFunction?: (iteratedObject: any, bindedObject: any) => boolean = (iteratedObject, bindedObject) => {
    if (iteratedObject == null || bindedObject == null) return true;
    const iteratedKeyProperty = iteratedObject.Key != null ? "Key" : this.bindKey;
    const bindedKeyProperty = bindedObject?.Key != null ? "Key" : this.bindKey;
    return iteratedObject[iteratedKeyProperty] === bindedObject ||
      iteratedObject[iteratedKeyProperty] === bindedObject[bindedKeyProperty];
  };
}

export class SelectObject {
  isEnumMultiSelect?: boolean;
  showEnumCancelButton?: boolean;
  isEnumSearchable?: boolean;
  enumSearchText?: string;
  arrayData?: any;
  arrayKeyProperty?: string;
  arrayValueProperty?: string;
  enumData?: any;
  enumDataToExclude?: Array<any>;
  ngModelOptions?: any;
  ngModelInput?: any;
  isRequired?: boolean;
  isMultiLanguage?: boolean;
  multilanguagePrefixKey?: string;
  isAlphabeticalOrderable?: boolean;
  suffixIcon?: string;
  prefixIcon?: string;
  isReadonly?: boolean;
  isSearchWhileComposing?: boolean;
  appendToInput?: string | undefined;
  dropdownPosition?: "bottom" | "top" | "auto";
  selectOnTab?: boolean;
  selectAll?: boolean;
  selectAllText?: string;
  selectableGroupAsModel?: boolean;
  clearAllText?: string;
  customOption?: TemplateRef<any>;
  customLabel?: TemplateRef<any>;
  class?: string;
}


export class BaseTypeConverter {
  static convertToFormFieldType(baseType: BaseType): FormFieldType | undefined {
    switch (baseType) {
      case BaseType.Text:
        return FormFieldType.Text;
      case BaseType.Number:
        return FormFieldType.Number;
      case BaseType.Date:
        return FormFieldType.Date;
      case BaseType.Enum:
        return FormFieldType.Enum;
      case BaseType.Boolean:
        return FormFieldType.Boolean;
      default:
        return undefined;
    }
  }
}

