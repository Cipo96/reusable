import { FilterResultType, FilterMode } from "@eqproject/eqp-filters/public-api";
import { ConfigColumn } from "@eqproject/eqp-common";
import { FilterField } from "@eqproject/eqp-common";

export interface FilterObject {
    resultType: FilterResultType;
    usingMode: FilterMode;
    filterTitle: string;
    filterAppliedTitle: string;
    applyFilterLabel: string;
    resetAllFilterLabel: string;
    restoreAllFilterLabel: string;
    clearFilterTooltip: string;
    showExpandend: boolean;
    currentCultureSelected: string;
    applyOnInit: boolean;
    saveFilter: boolean;
    saveFilterID: string;
    saveFilterButtonLabel: string;
    saveFilterTitle: string;
    saveFilterConfirmLabel: string;
    saveFilterAbortLabel: string;
    savedFilterLabel: string;
    restoreSavedFilterTooltip: string;
    removeSavedFilterTooltip: string;
    useInitialValueOnReset: boolean;
    filterPreventRemovalTooltip: string;
    saveLastFilter: boolean;
    savedLastFilterName: string;
    leftCollapseIcon: boolean;
    showAppliedFiltersIcon: boolean;
    complexFilters: Array<FilterField>;
  }
