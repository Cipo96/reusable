import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'eqp-sidebar-toggler',
  template: ``,
  standalone: true
})
export class SidebarTogglerComponent {

  @HostBinding('attr.role')
  @Input() role = 'button';

  @HostBinding('class.sidebar-toggler') sidebarTogglerClass = true;

}
