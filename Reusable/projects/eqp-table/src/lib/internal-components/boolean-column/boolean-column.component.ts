import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ColumnAccessibilityHelper } from '../../helpers/columnAccessibility.helper';
import { ColumnStyleHelper } from '../../helpers/columnStyle.helper';
import { ColumnValueHelper } from '../../helpers/columnValue.helper';
import { TranslateTableHelper } from '../../helpers/translateTable.helper';
import { ConfigColumn } from '@eqproject/eqp-common';

@Component({
    selector: 'eqp-table-boolean-column',
    templateUrl: 'boolean-column.component.html',
    styleUrls: ['boolean-column.component.scss'],
})
export class EqpTableBooleanColumnComponent implements OnInit {

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
    // public columnAccessibiltyHelper = ColumnAccessibilityHelper;

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
}
