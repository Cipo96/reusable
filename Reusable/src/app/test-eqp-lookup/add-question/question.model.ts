import { LookupDTO } from "projects/eqp-lookup/src/lib/models/lookup.model";

export class QuestionDTO {
  ID: number | undefined;
  Title: string | undefined;
  Score: number | undefined;
  ViewedTime: number | undefined;
  IsOffice: boolean | undefined;
  QuestionCategory: LookupDTO | undefined;
  User: undefined;
  InsertDate: Date | undefined;
}

export class QuestionsPaginatedDTO {
  NumberOfElements: number | undefined;
  QuestionsDTO: QuestionListDTO[] | undefined;
}

export class QuestionListDTO {
  ID : number | undefined;
  Title : string | undefined;
  Score : number  | undefined;
  QuestionCategory: LookupDTO | undefined;
  User : any | undefined;
  NumberOfAnswers : number | undefined;
  ViewedTime : number | undefined;
  IsOffice : boolean | undefined;
}
