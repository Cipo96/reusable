
export class BaseFieldModel {
  key?: string;
  display?: string;
  value?: any;
  format?: string;
  numberPipe?: NumberColumnPipe;
  currencyPipeCode?: string | Function;
  enumModel?: any;
  styles?: Style;
  disabled?: boolean | (() => boolean);
  multilanguagePrefixKey?: string;
  tooltip?: EqpMatTooltip;
  baseType?: BaseType;
}

export enum BaseType {
  Text = 1,
  Number = 2,
  Date = 3,
  Enum = 4,
  Boolean = 5
}

export enum NumberColumnPipe {
  DECIMAL = 1,
  PERCENT = 2,
  CURRENCY = 3
}

export class BooleanValues {
  true: string;
  false: string;
}

export class Style {
  flex?: string;
  minWidth?: string;
  maxWidth?: string;
  color?: string;
  cellAlignment?: CellAlignmentEnum = CellAlignmentEnum.LEFT;
}

export enum CellAlignmentEnum {
  LEFT = 1,
  RIGHT = 2,
  CENTER = 3
}

export class EqpMatTooltip {
  tooltipText?: string | Function;
  tooltipPosition?: TooltipPositionType;
}

export enum TooltipPositionType {
  Below = 'below',
  Above = 'above',
  Left = 'left',
  Right = 'right'
}
