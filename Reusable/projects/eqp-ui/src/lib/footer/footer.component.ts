import { Component, HostBinding, Input } from '@angular/core';
import { Positions } from '../eqpui.types';


@Component({
  selector: 'c-footer, [cFooter]',
  template: `<ng-content></ng-content>`,
  standalone: true
})
export class FooterComponent {
  /**
   * Place footer in non-static positions. [docs]
   * @type Positions
   */
  @Input() position?: Positions;
  /**
   * Default role for footer. [docs]
   * @type string
   * @default 'footer'
   */
  @Input()
  @HostBinding('attr.role') role = 'footer';

  @HostBinding('class')
  get getClasses(): any {
    return {
      footer: true,
      [`footer-${this.position}`]: !!this.position,
    };
  }
}