import { NgModule } from '@angular/core';
import { ContainerComponent } from './container';
import { SidebarModule } from './sidebar';
import { BreadcrumbModule } from './breadcrumb';

@NgModule({
    declarations: [
        ContainerComponent,
    ],
    exports: [
        SidebarModule,
        BreadcrumbModule,
        ContainerComponent
    ],
})
export class EqpUiModule { }
