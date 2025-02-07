import { BreadcrumbRouterComponent } from './breadcrumb-router/breadcrumb-router.component';
import { BreadcrumbItemComponent } from './breadcrumb-item/breadcrumb-item.component';
import { NgModule } from '@angular/core';
import { BreadcrumbComponent } from './breadcrumb';
import { BreadcrumbRouterService } from './breadcrumb-router/breadcrumb-router.service';

@NgModule({
    imports: [
        BreadcrumbComponent,
        BreadcrumbItemComponent,
        BreadcrumbRouterComponent
    ],
    exports: [
        BreadcrumbComponent,
        BreadcrumbItemComponent,
        BreadcrumbRouterComponent
    ],
    providers: [BreadcrumbRouterService]
})
export class BreadcrumbModule { }