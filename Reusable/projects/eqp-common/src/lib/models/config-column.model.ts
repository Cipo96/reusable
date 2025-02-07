import { TemplateRef } from '@angular/core';
import { BooleanValues, CellAlignmentEnum, EqpMatTooltip, NumberColumnPipe, Style, TooltipPositionType } from './base-field.model';
// import { ExportType } from 'mat-table-exporter';

export class ConfigColumn {
  key?: string;
  display: string;
  value?: string | Function;
  type?: TypeColumn;
  format?: string;
  numberPipe?: NumberColumnPipe;
  currencyPipeCode?: string | Function;
  actions?: Array<ConfigAction>;
  booleanValues?: BooleanValues;
  enumModel?: any;
  buttonMenuIcon?: string;
  icons?: Array<Icon>;
  styles?: Style;
  containerStyle?: Object | Function;
  isSearchable?: boolean = true;
  disabled?: boolean | Function;
  multilanguagePrefixKey?: string;
  tooltip?: EqpMatTooltip;
  hyperlink?: Hyperlink;
  image?: Image;
  additionalValue?: string;
  externalTemplate?: TemplateRef<any>;
  externalTemplateSearchFunction?: ((row) => string | number) | string;
  isSortable?: boolean = true;
  isFilterable?: boolean = true;
  isHidden?: boolean = false;
  isSticky?: boolean = false;
  isStickyEnd?: boolean = false;
}


export enum TypeColumn {
  Date = 1,
  Boolean = 2,
  SimpleAction = 3,
  MenuAction = 4,
  Enum = 5,
  Icon = 6,
  Checkbox = 7,
  Hyperlink = 8,
  Image = 9,
  Color = 10,
  ExternalTemplate = 11
}

export class ConfigAction {
  name?: string;
  icon?: string | Function;
  disabled?: boolean | Function;
  fn?: any;
  hidden?: boolean | Function;
  fontawesome?: boolean;
  tooltip?: EqpMatTooltip;
  color?: string;
}

export class Icon {
  className?: string;
  tooltip?: string | Function;
}


export class Hyperlink {
  hyperlinkText?: string | Function;
  hyperlinkUrl?: string | Function;
  isTargetBlank?: boolean;
}

export class Image {
  imagePreview?: string | Function;
  imageFull?: string | Function;
}

export class ExportEqpTable {
  // exportFileType?: ExportType | Array<ExportType> | CustomExportType | Array<CustomExportType>;
  exportFileType?: any;
  exportFileName?: string;
  hiddenColumns?: Array<number>;
  buttonText?: string;
  buttonTextTranslateKey?: string;
  buttonIcon?: string;
  tooltipText?: string;
  tooltipTextTranslateKey?: string;
  tooltipPosition?: TooltipPositionType;
  showButtonBorder?: boolean;
  customExportFunction?: Array<Function>;
}
export class CustomButton {
  buttonText?: string;
  buttonTextTranslateKey?: string;
  icon?: string;
  color?: string;
  fontawesome?: boolean;
  tooltipText?: string;
  tooltipTextTranslateKey?: string;
  tooltipPosition?: TooltipPositionType;
  customButtonFunction?: Function;
  order?: number;
  containerStyle?: Object | Function;
}
export class HeaderFilter {
  column: string;
  key: string;
  styles?: Style;
  isSearchable?: boolean = true;
  type?: TypeColumn;
}

export enum CustomExportType {
  XLS = "xls",
  CustomXLS = "xls",
  XLSX = "xlsx",
  CustomXLSX = "xlsx",
  CSV = "csv",
  CustomCSV = "csv",
  TXT = "txt",
  CustomTXT = "txt",
  JSON = "json",
  CustomJSON = "json",
}
