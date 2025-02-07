import { Injectable } from '@angular/core';
import { FieldSizeClass } from './models/common-enum.model';
import { BaseFieldModel } from '../public-api';
import { FilterField } from './models/filterField.model';
import { TableColumnField } from './models/tableColumn-field.model';
import { FormField } from './models/form.model';

@Injectable({
  providedIn: 'root'
})
export class EqpCommonService {

  constructor() { }

  /**
 *
 * @param baseFields Array di BaseFieldModel
 * @param ctor Tipo da restituire
 * @param keys Keys dell'array che verranno restituite, se null tutte
 * @returns Array<T> del tipo passato nella firma
 * https://www.typescriptlang.org/docs/handbook/2/generics.html
 */
  static convertAs<T>(baseFields: Array<BaseFieldModel>, ctor: new (...args: any[]) => T, keys?: Array<string>, additionalProps?: Array<T>): Array<T> {

    let convertedData: Array<T>;

    if (ctor.name == "FilterField") {
      convertedData = keys ? FilterField.createFilterFields(baseFields.filter(x => keys.includes(x.key))) as unknown as Array<T> : FilterField.createFilterFields(baseFields) as unknown as Array<T>;
    } else if (ctor.name == "TableColumnField") {
      convertedData = keys ? TableColumnField.createTableColumnFields(baseFields.filter(x => keys.includes(x.key))) as unknown as Array<T> : TableColumnField.createTableColumnFields(baseFields) as unknown as Array<T>;
    } else if (ctor.name == "FormField") {
      convertedData = keys ? FormField.createFormFields(baseFields.filter(x => keys.includes(x.key))) as unknown as Array<T> : FormField.createFormFields(baseFields) as unknown as Array<T>;
    }

    this.mergeAdditionalProps(convertedData, additionalProps, 'key');

    return convertedData;
  }

  static isBaseField(fields: any[]): fields is BaseFieldModel[] {

    if (!fields || fields.length === 0)
      return false;

    // Se tutti gli elementi hanno un baseType diverso da null, allora consideralo un array di BaseField
    return fields.every(field => field && field.baseType != null);
  }

  getFieldSizeClass(field: FilterField | FormField): string {
    if (field == null || field == undefined) return "col-4";

    if (field.fieldSizeClass == FieldSizeClass.SMALL) return "col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4";
    else if (field.fieldSizeClass == FieldSizeClass.MEDIUM) return "col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8";
    else if (field.fieldSizeClass == FieldSizeClass.LARGE) return "col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12";
    else if (field.fieldSizeClass == FieldSizeClass.CUSTOM && field.customFieldSizeClasses)
      return field.customFieldSizeClasses;
    else return "col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4";
  }

  static mergeAdditionalProps<T>(convertedData: T[], additionalProps: T[], comparisonKey: string): void {
    if (!additionalProps) {
      return;
    }

    additionalProps.forEach(prop => {
      const existingIndex = convertedData.findIndex(x => x[comparisonKey] === prop[comparisonKey]);
      if (existingIndex !== -1) {
        // Key già presente, merge
        const defaults = convertedData[existingIndex];
        const mergedObject: T = { ...defaults, ...prop } as T;
        convertedData[existingIndex] = mergedObject;
      } else {
        // Key non presente, aggiungi
        convertedData.push(prop as T);
      }
    });
  }

}

