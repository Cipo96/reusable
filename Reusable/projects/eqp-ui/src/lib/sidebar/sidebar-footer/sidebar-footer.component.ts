import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'eqp-sidebar-footer',
  template: `<ng-content></ng-content>`,
  standalone: true
})
export class SidebarFooterComponent {

  constructor() { }

  @HostBinding('class')
  get hostClasses(): any {
    return {
      'sidebar-footer': true
    };
  }
}
