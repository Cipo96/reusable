import { Component, Input, OnInit } from '@angular/core';
import { CustomButton } from '@eqproject/eqp-common';
import { ColumnValueHelper } from '../../helpers/columnValue.helper';
import { TranslateTableHelper } from '../../helpers/translateTable.helper';
import { ColumnStyleHelper } from '../../helpers/columnStyle.helper';

@Component({
  selector: 'eqp-table-custom-buttons',
  templateUrl: './custom-buttons.component.html',
  styleUrls: ['./custom-buttons.component.scss']
})
export class CustomButtonsComponent implements OnInit {

  @Input("customButtons") customButtons: Array<CustomButton>
  @Input("isMultiLanguage") isMultiLanguage: boolean = false;

  constructor(
    public columnValueHelper: ColumnValueHelper,
    private translateTableHelper: TranslateTableHelper,
    public columnStyleHelper: ColumnStyleHelper
  ) { }

  ngOnInit() {
    this.checkButtonOrder();
    this.checkTranslateButtonText();
  }

  checkButtonOrder() {
    if (this.customButtons != null && this.customButtons.find(x => x.order != null)) {
      this.customButtons.sort((a, b) => {
        // Gestisce il caso in cui "order" sia assente in uno o entrambi gli oggetti
        const orderA = a.order || 0;
        const orderB = b.order || 0;

        return orderA - orderB;
      });
    }
  }

  checkTranslateButtonText() {
    //Se è stato passato il buttonTextTranslateKey e la tabella è gestita col multilingua allora
    //sovrascrive il buttonText con la traduzione associata alla buttonTextTranslateKey (recuperara dal json di traduzione caricata per la tabella)
    if (this.customButtons.find(x => x.buttonTextTranslateKey != null) && this.isMultiLanguage == true && this.translateTableHelper.translateService != null) {
      this.customButtons.forEach(element => {
        element.buttonText = this.translateTableHelper.returnTranslateValue(element.buttonTextTranslateKey, null);
      });
    }
  }

  checkTranslateTooltipText() {
    //Se è stato passato il buttonTextTranslateKey e la tabella è gestita col multilingua allora
    //sovrascrive il buttonText con la traduzione associata alla buttonTextTranslateKey (recuperara dal json di traduzione caricata per la tabella)
    if (this.customButtons.find(x => x.tooltipTextTranslateKey != null) && this.isMultiLanguage == true && this.translateTableHelper.translateService != null) {
      this.customButtons.forEach(element => {
        element.tooltipText = this.translateTableHelper.returnTranslateValue(element.tooltipTextTranslateKey, null);
      });
    }
  }

}
