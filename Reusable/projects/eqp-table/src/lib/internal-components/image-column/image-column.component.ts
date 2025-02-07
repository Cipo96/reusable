import { Component, Input, OnInit } from '@angular/core';
import { ColumnAccessibilityHelper } from '../../helpers/columnAccessibility.helper';
import { ColumnStyleHelper } from '../../helpers/columnStyle.helper';
import { ColumnValueHelper } from '../../helpers/columnValue.helper';
import { ConfigColumn } from '@eqproject/eqp-common';

@Component({
  selector: 'eqp-table-image-column',
  templateUrl: 'image-column.component.html',
  styleUrls: ['image-column.component.scss'],
})
export class EqpTableImageColumnComponent implements OnInit {

  /**
  * Configurazione della colonna di tipo boolean
  */
  @Input("col") col: ConfigColumn;

  /**
  * Elemento bindato alla riga
  */
  @Input("element") element: any;

  // public columnValueHelper = ColumnValueHelper;
  // public columnStyleHelper = ColumnStyleHelper;
  // public columnAccessibilityHelper = ColumnAccessibilityHelper;

  constructor(public columnValueHelper: ColumnValueHelper, public columnStyleHelper: ColumnStyleHelper, public columnAccessibiltyHelper: ColumnAccessibilityHelper) {
  }

  ngOnInit() {
    //Verifica che siano stati passati gli input obbligatori relativi alla configurazione della colonna e all'elemento bindato alla riga
    if (!this.col || !this.element) {
      let errorMessage: string = "It is mandatory to indicate the configuration and the element to be used for the boolean column";
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
  }

  getImagePreviewValue(col, element) {
    if (!col.image)
      return;

    if (typeof (col.image.imagePreview) == "string") {
      return col.image.imagePreview;
    } else {
      return col.image.imagePreview(element);
    }
  }

  getImageFullValue(col, element) {
    if (!col.image)
      return;

    if (typeof (col.image.imageFull) == "string") {
      return col.image.imageFull;
    } else {
      return col.image.imageFull(element);
    }
  }
}
