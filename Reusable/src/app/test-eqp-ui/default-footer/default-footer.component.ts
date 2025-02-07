import { Component } from '@angular/core';
import { FooterComponent } from 'projects/eqp-ui/src/lib/footer';

@Component({
  selector: 'app-default-footer',
  templateUrl: './default-footer.component.html',
  styleUrls: ['./default-footer.component.scss'],
})
export class DefaultFooterComponent extends FooterComponent {
  constructor() {
    super();
  }
}
