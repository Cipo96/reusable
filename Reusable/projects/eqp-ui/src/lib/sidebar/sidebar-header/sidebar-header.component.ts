import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'eqp-sidebar-header',
  template: `<ng-content></ng-content>`,
  standalone: true
})
export class SidebarHeaderComponent {

  @HostBinding('class')
  get hostClasses(): any {
    return {
      'sidebar-header': true
    };
  }
}
