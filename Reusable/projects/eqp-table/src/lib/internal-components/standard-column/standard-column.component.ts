import { Component, Input, OnInit } from '@angular/core';
import { ColumnAccessibilityHelper } from '../../helpers/columnAccessibility.helper';
import { ColumnPipeHelper } from '../../helpers/columnPipe.helper';
import { ColumnStyleHelper } from '../../helpers/columnStyle.helper';
import { ColumnValueHelper } from '../../helpers/columnValue.helper';
import { ConfigColumn, NumberColumnPipe } from '@eqproject/eqp-common';

@Component({
    selector: 'eqp-table-standard-column',
    templateUrl: 'standard-column.component.html',
    styleUrls: ['standard-column.component.scss'],
})
export class EqpTableStandardColumnComponent implements OnInit {

    /**
    * Configurazione della colonna di tipo boolean
    */
    @Input("col") col: ConfigColumn;

    /**
    * Elemento bindato alla riga
    */
    @Input("element") element: any;

    /**
    * Culture da usare
    */
    @Input("currentCultureSelected") currentCultureSelected: string;


    /**
   * Locale da usare
   */
    @Input("currentLocaleSelected") currentLocaleSelected: string;

    // public columnValueHelper = ColumnValueHelper;
    // public columnStyleHelper = ColumnStyleHelper;
    // public columnAccessibilityHelper = ColumnAccessibilityHelper;
    // public columnPipeHelper = ColumnPipeHelper;

    numberPipeEnum = NumberColumnPipe;
    constructor(public columnValueHelper: ColumnValueHelper, public columnStyleHelper: ColumnStyleHelper, public columnAccessibilityHelper: ColumnAccessibilityHelper, public columnPipeHelper: ColumnPipeHelper) {
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
