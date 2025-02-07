export class DocumentModel {
}

export interface IPlaceholderDTO {
  ID: number;
  Name: string;
  Tag: string;
  FK_Parent: number;
  Children: Array<IPlaceholderDTO>;
  htmlAttributes: object;
  IsListOfElements: boolean;
}

export enum DocumentSaveType {
  LOCAL = 1,
  BLOB = 2,
  //PATH = 3
}
