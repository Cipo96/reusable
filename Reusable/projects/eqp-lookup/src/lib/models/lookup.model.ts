import { ComplexLinqPredicateDTO, LinqPredicateDTO } from './linqPredicate.model';

export class LookupDTO {
  ID: number | string | null | undefined;
  Label: string | null | undefined;
  FullObject: any;
}

/**
 * Modello per la configurazione della lookup, contiene le informazioni
 * sul tipo degli elementi da mostrare e gli eventuali filtri da applicare
 */
export class LookupConfigDTO {
  TypeName: string | null | undefined;
  Filters: Array<LinqPredicateDTO> | null | undefined;
  ComplexFilters: Array<ComplexLinqPredicateDTO> | null | undefined;
  CustomConfig: LookupCustomConfig | null | undefined;
  OptionsFilter: Array<LookupCustomConfig> | null | undefined;
}

export class LookupCustomConfig {
  LabelProperties: Array<string> | null | undefined;
  IncludeFullObject: boolean | null | undefined;
}
