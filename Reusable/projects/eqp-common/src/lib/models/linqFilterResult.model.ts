import { WherePartType } from "./filterConfig.model";

/**
 * Classe utilizzata per la definizione di filtri avanzati.
 * Si basa sul concetto del LinqPredicate documentato nella guida EqProject.
 * 
 * Ciascun oggetto LinqPredicateDTO può contenenere la definizione di N filtri diversi (di tipo LinqFilterDTO) che potranno essere messi tutti in OR tra loro.
 * In presenza di più oggetti di tipo LinqPredicateDTO tutti i LinqPredicateDTO saranni invece messi in AND tra loro.
 * In questo modo sarà possibile realizzare condizioni complesse
 */
export class LinqPredicateDTO {
  /**
   * Elenco di filtri di uno stesso predicato.
   * Tutti i filtri contenuti in questa proprietà saranno considerati parte di tante OR
   */
  public PropertyFilters: Array<LinqFilterDTO>;
}

/**
 * Permette di definire ogni singola condizione di una where part.
 */
export class LinqFilterDTO {
  /**
   * Nome della proprietà su cui applicare il filtro
   */
  public PropertyName: string;

  /**
   * Valore della proprietà su cui applicare il filtro
   */
  public PropertyValue: any;

  /**
   * Tipo di relazione. Identifica cioè l'operatore di confronto della where part
   */
  public RelationType: WherePartType;

  /**
   * Se RelationType = ContainsElement o NotContainsElement allora in questa proprietà ci verrà definito
   * il nome della proprietà degli oggetti della lista su cui applicare l'operatore Any
   */
  public ListElementPropertyName: string;

  static createFilter(propertyName: string, propertyValue: any, relationType: WherePartType, listElementPropertyName: string = null): LinqFilterDTO {
    let filter: LinqFilterDTO = new LinqFilterDTO();
    filter.ListElementPropertyName = listElementPropertyName;
    filter.PropertyName = propertyName;
    filter.RelationType = relationType;
    filter.PropertyValue = propertyValue;
    return filter;
  }
}

export class LookupCustomConfig {
  LabelProperties: Array<string> | null | undefined;
  IncludeFullObject: boolean | null | undefined;
}

export class ComplexLinqPredicateDTO {
  public Predicates: Array<LinqPredicateDTO> | undefined;

  /**
   * Ricostruisce l'array di predicati complessi a partire dalla matrice di LinqPredicateDTO passata nel parametro.
   * Ogni riga della matrice diventerà un elemento della lista restituita.
   * Ogni elemento delle lista conterrà i dati della riga della matrice.
   * @param complexPredicates Restituisce un array di oggetti di tipo ComplexLinqPredicateDTO
   */
  static CreateComplexPredicate(complexPredicates: Array<Array<LinqPredicateDTO>>): Array<ComplexLinqPredicateDTO> {
    let results: Array<ComplexLinqPredicateDTO> = new Array<ComplexLinqPredicateDTO>();

    complexPredicates.forEach(cp => {
      let complexPredicate: ComplexLinqPredicateDTO = new ComplexLinqPredicateDTO();
      complexPredicate.Predicates = cp;
      results.push(complexPredicate);
    });

    return results;
  }
}

export class LookupDTO {
  ID: number | string | null | undefined;
  Label: string | null | undefined;
  FullObject: any;
}