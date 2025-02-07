
import { BaseFieldModel, BaseType, BooleanValues } from "./base-field.model";
import { ConfigAction, ConfigColumn, Hyperlink, Icon, Image, TypeColumn } from "./config-column.model";
import { TemplateRef } from "@angular/core";

export class TableColumnField extends BaseFieldModel {
  type?: TypeColumn;
  actions?: Array<ConfigAction>;
  booleanValues?: BooleanValues;
  buttonMenuIcon?: string;
  icons?: Array<Icon>;
  containerStyle?: Object | Function;
  isSearchable?: boolean = true;
  hyperlink?: Hyperlink;
  image?: Image;
  additionalValue?: string;
  externalTemplateSearchFunction?: ((row) => string | number) | string;
  isSortable?: boolean = true;
  isFilterable?: boolean = true;
  isHidden?: boolean = false;
  isSticky?: boolean = false;
  isStickyEnd?: boolean = false;
  externalTemplate?: TemplateRef<any>;

  static createTableColumnFields(baseField: BaseFieldModel): TableColumnField;
  static createTableColumnFields(baseFields: BaseFieldModel[]): TableColumnField[];
  static createTableColumnFields(baseFields: BaseFieldModel | BaseFieldModel[]): TableColumnField | TableColumnField[] {
    if (Array.isArray(baseFields)) {
      const tableColumnFields: TableColumnField[] = [];
      baseFields.forEach(field => {
        tableColumnFields.push(this.createTableColumnField(field));
      });
      return tableColumnFields;
    } else {
      return this.createTableColumnField(baseFields);
    }
  }

  private static createTableColumnField(baseField: BaseFieldModel): TableColumnField {
    const tableColumnField: TableColumnField = new TableColumnField();
    tableColumnField.key = baseField.key;
    tableColumnField.display = baseField.display;
    tableColumnField.value = baseField.value;
    tableColumnField.enumModel = baseField.enumModel;
    tableColumnField.booleanValues = { true: '<i class="fa fa-check"></i>', false: '<i class="fa fa-close"></i>' }; //DEFAULT
    tableColumnField.styles = baseField.styles != null ? baseField.styles : { minWidth: "250px" }; //DEFAULT
    tableColumnField.type = BaseTypeConverterTable.convertToTypeColumn(baseField.baseType);
    tableColumnField.baseType = null;

    return tableColumnField;
  }

  static createConfigColumns(tableColumnFields: TableColumnField): ConfigColumn;
  static createConfigColumns(tableColumnFields: TableColumnField[]): ConfigColumn[];
  static createConfigColumns(tableColumnFields: TableColumnField | TableColumnField[]): ConfigColumn | ConfigColumn[] {
    if (Array.isArray(tableColumnFields)) {
      const configColumns: ConfigColumn[] = [];
      tableColumnFields.forEach(field => {
        configColumns.push(this.createConfigColumn(field));
      });
      return configColumns;
    } else {
      return this.createConfigColumn(tableColumnFields);
    }
  }

  private static createConfigColumn(tableColumnField: TableColumnField): ConfigColumn {
    const configColumn: ConfigColumn = new ConfigColumn();
    configColumn.key = tableColumnField.key;
    configColumn.display = tableColumnField.display;
    configColumn.value = tableColumnField.value;
    configColumn.enumModel = tableColumnField.enumModel;
    configColumn.booleanValues = tableColumnField.booleanValues;
    configColumn.externalTemplate = tableColumnField.externalTemplate;
    configColumn.type = tableColumnField.type;
    configColumn.isSortable = tableColumnField.isSortable ?? true;
    configColumn.isFilterable = tableColumnField.isFilterable ?? true;
    configColumn.isHidden = tableColumnField.isHidden ?? false;
    configColumn.isSticky = tableColumnField.isSticky ?? false;
    configColumn.isStickyEnd = tableColumnField.isStickyEnd ?? false;
    configColumn.isSearchable = tableColumnField.isSearchable ?? true;
    configColumn.format = tableColumnField.format;
    configColumn.numberPipe = tableColumnField.numberPipe;
    configColumn.currencyPipeCode = tableColumnField.currencyPipeCode;
    configColumn.actions = tableColumnField.actions;
    configColumn.buttonMenuIcon = tableColumnField.buttonMenuIcon;
    configColumn.icons = tableColumnField.icons;
    configColumn.styles = tableColumnField.styles;
    configColumn.containerStyle = tableColumnField.type;
    configColumn.disabled = tableColumnField.disabled;
    configColumn.multilanguagePrefixKey = tableColumnField.multilanguagePrefixKey;
    configColumn.tooltip = tableColumnField.tooltip;
    configColumn.hyperlink = tableColumnField.hyperlink;
    configColumn.image = tableColumnField.image;
    configColumn.additionalValue = tableColumnField.additionalValue;

    return configColumn;
  }

}

export class BaseTypeConverterTable {
  static convertToTypeColumn(baseType: BaseType): TypeColumn {
    switch (baseType) {
      case BaseType.Text:
        return undefined;
      case BaseType.Number:
        return undefined;
      case BaseType.Date:
        return TypeColumn.Date;
      case BaseType.Enum:
        return TypeColumn.Enum;
      case BaseType.Boolean:
        return TypeColumn.Boolean;
      default:
        return undefined;
    }
  }
}
