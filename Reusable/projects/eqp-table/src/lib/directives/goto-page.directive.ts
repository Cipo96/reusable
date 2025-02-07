import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { EqpTableComponent } from '../eqp-table.component';

declare var $: any;

@Directive({
  selector: '[gotoPage]'
})
export class GotoPageDirective implements AfterViewInit {
  @Input() gotoPage: EqpTableComponent;
  tbl: EqpTableComponent;
  pageIndex: number;
  input: any;
  gotoComponent: any;

  constructor(public elementRef: ElementRef) {

  }

  ngAfterViewInit(): void {
    const self = this;
    this.tbl = self.gotoPage as EqpTableComponent;
    self.injectPaginatorGoto(this.tbl);
  }

  gotoPageFn(e) {
    const tbl = this.tbl;
    let targetInput = $(e.target);
    let domInput = null;
    const pageCount = Math.ceil(tbl.dataSource.paginator.length / tbl.dataSource.paginator.pageSize);

    if (targetInput.prop("tagName").toLowerCase() == "button") {
      domInput = targetInput.parent().find("input");
      this.pageIndex = parseInt(domInput.val()) - 1;
    } else {
      domInput = targetInput;
      this.pageIndex = parseInt(domInput.val()) - 1;

      if (e.which != 13) {
        return;
      }
    }

    if (this.pageIndex + 1 >= pageCount) {
      domInput.val(pageCount)
      this.pageIndex = tbl.dataSource.paginator.pageIndex = parseInt(domInput.val()) - 1;
    } else {
      this.pageIndex = tbl.dataSource.paginator.pageIndex = parseInt(domInput.val()) - 1;
    }

    const event: PageEvent = {
      length: tbl.dataSource.paginator.length,
      pageIndex: tbl.dataSource.paginator.pageIndex,
      pageSize: tbl.dataSource.paginator.pageSize
    };

    tbl.dataSource.paginator.page.next(event);
  }

  injectPaginatorGoto(tbl: EqpTableComponent) {
    const self = this;
    if (tbl) {
      if (!tbl.dataSource.paginator) {
        const interval = setInterval(() => {
          if (tbl.dataSource.paginator) {
            clearInterval(interval);
            this.doInject(tbl, self);
          }
        }, 100);

      } else {
        this.doInject(tbl, self);
      }

    }
  }

  private doInject(tbl: EqpTableComponent, self: this) {
    tbl.dataSource.paginator.page
      .subscribe((data) => {
        self.input.val(tbl.dataSource.paginator.pageIndex + 1);
      });

    this.gotoComponent = $("<div class='eqp-go-to-page'><input type='number' placeholder='Ok" + "' /><button class='btn btn-primary'>Ok" + "</button></div>");
    $(tbl["_changeDetectorRef"]._lView[0]).find("mat-paginator .mat-mdc-paginator-container").append(this.gotoComponent);
    this.input = this.gotoComponent.find("input");
    this.input.on('keypress', this.gotoPageFn.bind(this));
    this.gotoComponent.find("button").on('click', this.gotoPageFn.bind(this));
  }
}
