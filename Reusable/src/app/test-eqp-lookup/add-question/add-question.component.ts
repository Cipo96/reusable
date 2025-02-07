import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LookupDTO } from "projects/eqp-lookup/src/lib/models/lookup.model";
import { EqpLookupService } from "projects/eqp-lookup/src/public-api";
import { environment } from "src/environments/environment";
import { QuestionDTO } from "./question.model";
import { QuestionService } from "./question.service";

@Component({
  selector: "app-add-question",
  templateUrl: "./add-question.component.html",
  styleUrls: ["./add-question.component.scss"]
})
export class AddQuestionComponent implements OnInit {
  question: QuestionDTO = new QuestionDTO();
  questionCategories: any;
  addQuestionForm: FormGroup | undefined;
  idLookupEntity: number | null | undefined = null;
  disableRedirectAfterSave: boolean = false;
  fullUrlHttpCall = environment.apiFullUrl + "/lookup/GetLookupEntities";

  lookupDTO: LookupDTO = new LookupDTO();

  constructor(
    private questionService: QuestionService,
    private formBuilder: FormBuilder,
    private lookupService: EqpLookupService
  ) {}

  ngOnInit(): void {
    if (this.idLookupEntity != null && this.idLookupEntity != 0) {
      this.questionService.getQuestion(this.idLookupEntity).subscribe((res) => {
        this.question = res;
        this.createForm();
      });
    } else {
      this.question = new QuestionDTO();
      this.createForm();
    }

    this.questionService.getAllQuestionCategories().subscribe((res) => {
      this.questionCategories = res;
    });
  }

  createForm() {
    this.addQuestionForm = this.formBuilder.group({
      title: ["", Validators.required],
      category: ["", Validators.required]
    });
  }

  save() {
    if (this.disableSave()) {
      alert("Compilare i campi per poter proseguire");
      return;
    }

    this.questionService.saveQuestion(this.question).subscribe((res) => {
      if (this.disableRedirectAfterSave) this.lookupService.lookupAddingComplete.emit(res);
    });
  }

  disableSave() {
    if (
      this.question == null ||
      this.question.Title == null ||
      this.question.Title == "" ||
      this.question.QuestionCategory == null
    ) {
      return true;
    }

    return false;
  }

  exit() {
    if (this.disableRedirectAfterSave) this.lookupService.lookupAddingComplete.emit(null);
  }
}
