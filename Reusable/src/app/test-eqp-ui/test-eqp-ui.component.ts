import { Component } from '@angular/core';
import { INavData } from 'projects/eqp-ui/src/public-api';

@Component({
  selector: 'test-eqp-ui',
  templateUrl: './test-eqp-ui.component.html',
  styleUrls: ['./test-eqp-ui.component.scss']
})
export class TestEqpUiComponent {
  public navItems = navItems;
}

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: 'test-table',
    icon: 'fa fa-home'
  },
  {
    name: 'Anagrafica',
    url: 'anagrafica',
    icon: 'fa fa-user',
    children: [
      {
        name: 'Dipendenti',
        url: '/employees',
        icon: '#'
      },
      {
        name: 'Mansioni',
        url: '/tasks',
        icon: '#'
      },
      {
        name: 'Incarichi',
        url: '/assignments',
        icon: '#'
      },
    ]
  },
  {
    name: 'Test',
    url: 'test-all',
    icon: 'fa fa-pie-chart',
  },

];
