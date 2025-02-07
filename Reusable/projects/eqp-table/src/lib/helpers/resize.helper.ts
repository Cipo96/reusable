import { Injectable, ChangeDetectorRef } from '@angular/core';
import { EqpTableComponent } from '../eqp-table.component';


@Injectable()
export class ResizeHelper {

  tableContext: EqpTableComponent;

  constructor(private cd: ChangeDetectorRef) { }

  public initializeEqpTableContext(eqpTableComponent: EqpTableComponent) {
    this.tableContext = eqpTableComponent;
  }

  doResize(tableContext: EqpTableComponent) {
    this.getDetailColumns();
    this.cd.detectChanges();

    tableContext.dataSource.data.forEach(row => {
      row.expanded = false;
    })
  }

  toggleRow(element: { expanded: boolean; }) {
    //Se non ci sono elementi, non faccio aprire il dettaglio
    if (this.tableContext.detailColumns == null || this.tableContext.detailColumns.length === 0) {
      element.expanded = false;
      return;
    }
    this.getDetailColumns();
    element.expanded = !element.expanded
  }

  // Restituisce la lista delle colonne visibili nel riepilogo e popola la lista di colonne visibili nel dettaglio
  getKeysInViewPort(keys: Array<string>): Array<string> {
    if (keys == null)
      return keys;

    if (keys.find(x => x == "Detail") == null)
      keys.unshift('Detail');

    this.tableContext.detailColumns = [];
    const visibleColumns = []; // Array per tenere traccia delle colonne visibili
    const addingColumns = []; // Array per tenere traccia delle colonne aggiunte
    let continueCanAddColumn: boolean = true
    for (let index = 0; index < keys.length; index++) {
      if (this.isInViewport(keys[index]) !== true) {
        if (continueCanAddColumn == true && this.canAddColumn(keys[index], addingColumns) == true) {
          const columnIndex = visibleColumns.indexOf(keys[index]);
          if (columnIndex !== -1)
            visibleColumns.splice(columnIndex, 1);
        } else {
          continueCanAddColumn = false;
          this.tableContext.detailColumns.push(keys[index]);
        }

      } else {
        visibleColumns.push(keys[index]);
      }
    }

    keys = keys.filter(x => !this.tableContext.detailColumns.includes(x));

    //Se non ci sono le colonne del dettaglio, rimuovo la colonna Detail
    if (this.tableContext.detailColumns.length == 0)
      keys = keys.filter(x => x != "Detail");

    return keys;
  }


  calculateVisibleColumnsWidth(addingColumns: Array<string>) {
    const firstRow = document.querySelector('table > tbody > tr');
    const tableWidth = this.tableContext.tableContainer.nativeElement.getBoundingClientRect();
    const visibleColumns = Array.from(firstRow.querySelectorAll('td')).filter(cell => {
      const rect = cell.getBoundingClientRect();
      return rect.width !== 0 && rect.height !== 0 && (rect.left - tableWidth.left) < tableWidth.width;
    });

    let totalWidth = 0;

    for (let key of visibleColumns) {
      const column = this.tableContext.tableColumns.find(cd => cd.key === Array.from(key.classList).find(x => x.includes("mat-column-")).replace("mat-column-", ""));

      if (column) {

        const flex = column.styles?.flex;
        const minWidth = column.styles?.minWidth;
        const maxWidth = column.styles?.maxWidth;
        let columnWidth;

        if (minWidth) {
          // Calcola la larghezza in base alla proprietà min-width
          columnWidth = parseFloat(minWidth);
        } else if (maxWidth) {
          // Calcola la larghezza in base alla proprietà max-width
          columnWidth = parseFloat(maxWidth);
        } else if (flex) {
          // Calcola la larghezza in base alla proprietà flex
          const flexValues = flex.split(' ');
          const flexBasis = flexValues[2];
          columnWidth = parseFloat(flexBasis) / 100 * tableWidth.width;
        } else {
          // Valore di default se nessuna proprietà specificata
          columnWidth = 50;
        }

        totalWidth += columnWidth;
      }
    }

    const visibleColumnKeys = Array.from(visibleColumns).map(column => {
      const classList = Array.from(column.classList);
      const keyClass = classList.find(className => className.includes("mat-column-"));
      return keyClass.replace("mat-column-", "");
    });

    for (let key of addingColumns) {
      let column = this.tableContext.tableColumns.find(cd => cd.key === key);

      //Se la chiave è già presente, metto la colonna a null perchè non deve essere calcolata
      if (visibleColumnKeys.find(x => x == key)) {
        column = null;
      }

      if (column) {

        const flex = column.styles?.flex;
        const minWidth = column.styles?.minWidth;
        const maxWidth = column.styles?.maxWidth;
        let columnWidth;

        if (minWidth) {
          // Calcola la larghezza in base alla proprietà min-width
          columnWidth = parseFloat(minWidth);
        } else if (maxWidth) {
          // Calcola la larghezza in base alla proprietà max-width
          columnWidth = parseFloat(maxWidth);
        } else if (flex) {
          // Calcola la larghezza in base alla proprietà flex
          const flexValues = flex.split(' ');
          const flexBasis = flexValues[2];
          columnWidth = parseFloat(flexBasis) / 100 * tableWidth.width;
        } else {
          // Valore di default se nessuna proprietà specificata
          columnWidth = 50;
        }

        totalWidth += columnWidth;
      }
    }


    return totalWidth;
  }

  // Verifica se è possibile aggiungere una colonna di dettaglio nella tabella attuale
  canAddColumn(key: string, addingColumns: Array<string>): boolean {
    const column = this.tableContext.tableColumns.find(cd => cd.key === key);

    if (column == null)
      return false;

    if (addingColumns.find(x => x == key) == null)
      addingColumns.push(key);

    const tableWidth = this.tableContext.tableContainer.nativeElement.clientWidth;
    const visibleColumnsWidth = this.calculateVisibleColumnsWidth(addingColumns); // Passa l'array delle colonne visibili
    const marginVisibleColumns = 5;
    // Se la larghezza delle colonne visibili è minore o uguale alla larghezza della tabella, è possibile aggiungere la colonna
    if ((visibleColumnsWidth + marginVisibleColumns) < tableWidth == true)
      return true;
    else {
      // addingColumns.pop();
      return false;
    }

    // return (visibleColumnsWidth + columnWidth) <= tableWidth;
  }

  // Verifica se la colonna corrente è completamente visibile nella tabella
  isInViewport(key): boolean {
    const fullKey = 'mat-column-' + key;
    const elementToSearch = document.getElementsByClassName(fullKey);

    // Se l'elemento cercato non esiste o non è visibile, restituisci true (se non lo trova, ritorna sempre un array vuoto)
    if (elementToSearch == null || elementToSearch.length === 0)
      return true;

    //Se lo trova ma è nella tabella sbagliata, dico che non è nel viewport
    if (elementToSearch[0].parentElement.parentElement.parentElement.id != "eqp-table")
      return false;

    const elementRect = elementToSearch[0].getBoundingClientRect();
    // if (elementRect.bottom == 0 && elementRect.right == 0 && elementRect.left == 0 && elementRect.top == 0)
    // return
    const tableRect = this.tableContext.tableContainer.nativeElement.getBoundingClientRect();

    const leftMargin = 0;
    const rightMargin = 5;

    const leftVisible = elementRect.left >= (tableRect.left + leftMargin);
    const rightVisible = elementRect.right <= (tableRect.right - rightMargin);

    return leftVisible && rightVisible;
  }

  getDetailColumns() {
    if (this.tableContext.displayedColumns == null)
      return;

    this.tableContext.detailConfigColumns = this.tableContext.tableColumns.filter(x => this.tableContext.detailColumns.includes(x.key));
  }
}

