import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterObject } from './filter.model';
import { FilterMode, FilterResultType } from '@eqproject/eqp-common';
import { ConfigColumn } from '@eqproject/eqp-common';

@Component({
  selector: 'eqp-table-filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class EqpTableFilterComponent implements OnInit {

  @Input("tableColumnFields") tableColumnFields: Array<ConfigColumn>;
  @Input() filterObject: FilterObject;
  @Output() filtersSelected = new EventEmitter();
  @Output() customFiltersSavedValueLoaded = new EventEmitter();
  defaultFilters: FilterObject;

  constructor() { }

  ngOnInit(): void {

    this.createStandardFilterObject();

    //Visto che il campo è nullable, se non viene passato come proprietà nell'oggetto dell'array viene considerato null
    //quindi in quel caso lo considero come true di default
    if (this.filterObject != null) {
      this.tableColumnFields.forEach(element => {
        element.isFilterable = element.isFilterable == null ? true : element.isFilterable;
      });
    }

  }

  createStandardFilterObject() {
    this.initializeDefaultFilters();
    // Definizione dei valori predefiniti per tutte le proprietà
    this.filterObject = {
      resultType: this.filterObject?.resultType ?? this.defaultFilters.resultType,
      usingMode: this.filterObject?.usingMode ?? this.defaultFilters.usingMode,
      filterTitle: this.filterObject?.filterTitle ?? this.defaultFilters.filterTitle,
      filterAppliedTitle: this.filterObject?.filterAppliedTitle ?? this.defaultFilters.filterAppliedTitle,
      applyFilterLabel: this.filterObject?.applyFilterLabel ?? this.defaultFilters.applyFilterLabel,
      resetAllFilterLabel: this.filterObject?.resetAllFilterLabel ?? this.defaultFilters.resetAllFilterLabel,
      restoreAllFilterLabel: this.filterObject?.restoreAllFilterLabel ?? this.defaultFilters.restoreAllFilterLabel,
      clearFilterTooltip: this.filterObject?.clearFilterTooltip ?? this.defaultFilters.clearFilterTooltip,
      showExpandend: this.filterObject?.showExpandend ?? this.defaultFilters.showExpandend,
      currentCultureSelected: this.filterObject?.currentCultureSelected ?? this.defaultFilters.currentCultureSelected,
      applyOnInit: this.filterObject?.applyOnInit ?? this.defaultFilters.applyOnInit,
      saveFilter: this.filterObject?.saveFilter ?? this.defaultFilters.saveFilter,
      saveFilterID: this.filterObject?.saveFilterID ?? this.defaultFilters.saveFilterID,
      saveFilterButtonLabel: this.filterObject?.saveFilterButtonLabel ?? this.defaultFilters.saveFilterButtonLabel,
      saveFilterTitle: this.filterObject?.saveFilterTitle ?? this.defaultFilters.saveFilterTitle,
      saveFilterConfirmLabel: this.filterObject?.saveFilterConfirmLabel ?? this.defaultFilters.saveFilterConfirmLabel,
      saveFilterAbortLabel: this.filterObject?.saveFilterAbortLabel ?? this.defaultFilters.saveFilterAbortLabel,
      savedFilterLabel: this.filterObject?.savedFilterLabel ?? this.defaultFilters.savedFilterLabel,
      restoreSavedFilterTooltip: this.filterObject?.restoreSavedFilterTooltip ?? this.defaultFilters.restoreSavedFilterTooltip,
      removeSavedFilterTooltip: this.filterObject?.removeSavedFilterTooltip ?? this.defaultFilters.removeSavedFilterTooltip,
      useInitialValueOnReset: this.filterObject?.useInitialValueOnReset ?? this.defaultFilters.useInitialValueOnReset,
      filterPreventRemovalTooltip: this.filterObject?.filterPreventRemovalTooltip ?? this.defaultFilters.filterPreventRemovalTooltip,
      saveLastFilter: this.filterObject?.saveLastFilter ?? this.defaultFilters.saveLastFilter,
      savedLastFilterName: this.filterObject?.savedLastFilterName ?? this.defaultFilters.savedLastFilterName,
      leftCollapseIcon: this.filterObject?.leftCollapseIcon ?? this.defaultFilters.leftCollapseIcon,
      showAppliedFiltersIcon: this.filterObject?.showAppliedFiltersIcon ?? this.defaultFilters.showAppliedFiltersIcon,
      complexFilters: this.filterObject?.complexFilters ?? this.defaultFilters.complexFilters,
    };
  }

  private initializeDefaultFilters() {
    this.defaultFilters = {
      resultType: FilterResultType.BASIC,
      usingMode: FilterMode.WITH_CARD,
      filterTitle: 'Filtri',
      filterAppliedTitle: 'Filtri applicati:',
      applyFilterLabel: 'Filtra',
      resetAllFilterLabel: 'Reset',
      restoreAllFilterLabel: 'Ripristina filtri iniziali',
      clearFilterTooltip: 'Clicca per rimuovere questo filtro',
      showExpandend: false,
      currentCultureSelected: 'it-IT',
      applyOnInit: false,
      saveFilter: false,
      saveFilterID: null,
      saveFilterButtonLabel: 'Salva filtro',
      saveFilterTitle: 'Inserire il nome per questo filtro',
      saveFilterConfirmLabel: 'Conferma',
      saveFilterAbortLabel: 'Annulla',
      savedFilterLabel: 'Filtri salvati',
      restoreSavedFilterTooltip: 'Ricarica filtro',
      removeSavedFilterTooltip: 'Elimina filtro',
      useInitialValueOnReset: true,
      filterPreventRemovalTooltip: 'Non è possibile rimuovere questo filtro',
      saveLastFilter: false,
      savedLastFilterName: 'Ultimi filtri usati',
      leftCollapseIcon: true,
      showAppliedFiltersIcon: false,
      complexFilters: []
    };
  }

  tableFiltersSelected(event) {
    this.filtersSelected.emit(event);
  }

  tableCustomFiltersSavedValueLoaded(event) {
    this.customFiltersSavedValueLoaded.emit(event);
  }


}
