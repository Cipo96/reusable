import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LinqPredicateDTO } from 'projects/eqp-lookup/src/lib/models/linqPredicate.model';
import { LookupDTO } from 'projects/eqp-lookup/src/lib/models/lookup.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { QuestionDTO } from './question.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient) { }


  saveQuestion(question: QuestionDTO) {
    return this.http.post<any>(environment.apiFullUrl + '/Question/SaveQuestion', question);
  }

  getAllQuestionCategories(): Observable<Array<LookupDTO>> {
    return this.http.get<Array<LookupDTO>>(environment.apiFullUrl + '/QuestionCategory/GetAllQuestionCategory');
  }

  getQuestion(id: number) {
    return this.http.get<QuestionDTO>(environment.apiFullUrl + '/Question/' + id);
  }
}
