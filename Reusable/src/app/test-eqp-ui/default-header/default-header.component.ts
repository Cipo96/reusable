import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ClassToggleService } from 'projects/eqp-ui/src/lib/services';
import { HeaderComponent } from 'projects/eqp-ui/src/lib/header';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  styleUrls: ['./default-header.component.scss']
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";
  @Output() readNotificationEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() goToNotificationListEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private classToggler: ClassToggleService, private activatedRoute: ActivatedRoute, private router: Router) {
    super();
  }

  /**
   * Apre la sezione profilo utente
   */
  viewProfile() {
    this.router.navigate(['/profile'], { relativeTo: this.activatedRoute });
  }

}
