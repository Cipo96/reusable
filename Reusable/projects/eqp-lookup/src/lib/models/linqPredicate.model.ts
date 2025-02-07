//Modelli per la definizione dei filtri dinamici con predicati LINQ
export class ComplexLinqPredicateDTO {
    public Predicates: Array<LinqPredicateDTO> | undefined;
  
    /**
     * Ricostruisce l'array di predicati complessi a partire dalla matrice di LinqPredicateDTO passata nel parametro.
     * Ogni riga della matrice diventerà un elemento della lista restituita.
     * Ogni elemento delle lista conterrà i dati della riga della matrice.
     * @param complexPredicates Restituisce un array di oggetti di tipo ComplexLinqPredicateDTO
     */
    static CreateComplexPredicate(complexPredicates: Array<Array<LinqPredicateDTO>>) : Array<ComplexLinqPredicateDTO> {
      let results: Array<ComplexLinqPredicateDTO> = new Array<ComplexLinqPredicateDTO>();
  
      complexPredicates.forEach(cp => {
        let complexPredicate: ComplexLinqPredicateDTO = new ComplexLinqPredicateDTO();
        complexPredicate.Predicates = cp;
        results.push(complexPredicate);
      });
  
      return results;
    }
  }
  
  export class LinqPredicateDTO {
    public PropertyFilters: Array<LinqFilterDTO> | undefined;
  }
  
  export class LinqFilterDTO {
    public PropertyName: string | undefined;
    public PropertyValue: any;
    public RelationType: LinqFilterType | undefined;
    public ListElementPropertyName?: string | null;
  
    static createFilter(propertyName: string, propertyValue: any, relationType: LinqFilterType, listElementPropertyName: string | null = null): LinqFilterDTO {
      let filter: LinqFilterDTO = new LinqFilterDTO();
      filter.ListElementPropertyName = listElementPropertyName;
      filter.PropertyName = propertyName;
      filter.RelationType = relationType;
      filter.PropertyValue = propertyValue;
      return filter;
    }
  }
  
  
  export enum LinqFilterType {
    Equal = 1,
    NotEqual = 2,
    StringContains = 3,
    StringNotContains = 4,
    GreaterThan = 5,
    GreaterThanOrEqual = 6,
    LessThan = 7,
    LessThanOrEqual = 8,
    ContainsElement = 9,
    NotContainsElement = 10
  }
  