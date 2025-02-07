import { Directive, Input, ViewContainerRef, TemplateRef, ComponentRef } from '@angular/core';

@Directive({
  selector: '[appDynamicLoader]'
})

export class DynamicLoaderDirective {

  // In input verrà passato il selettore del componente da ricreare
  @Input() set data(data: DynamicLoaderDirectiveData | undefined) {
    if(data != null)
      this.load(data.componentSelector, data.inputParams, data.idLookupEntity, data.disableRedirectAfterSave);
  }

  constructor(public viewContainerRef: ViewContainerRef) { }

  load(componentSelector: any | undefined, inputParams: any = null, idLookupEntity: string | number | null = null, disableRedirectAfterSave: boolean | undefined): any {
    if (!componentSelector) {
      throw new Error('Non è stato possibile caricare il componente');
    }

    this.viewContainerRef.clear();
    const componentRef: ComponentRef<any> = this.viewContainerRef.createComponent(componentSelector);

    //Controllo che nel componente che si vuole renderizzare sia presente DisableRedirectAfterSave così da poter gestire il redirect dopo aver salvato
    if(disableRedirectAfterSave) {
      if (componentRef.instance["disableRedirectAfterSave"] == null)
        throw new Error("Attenzione, la proprietà disableRedirectAfterSave nel componente di aggiunta non è stata creata");
      else
        componentRef.instance["disableRedirectAfterSave"] = true;
    }

    if (inputParams != null) {
      let inputProps = Object.keys(inputParams);
      inputProps.forEach(p => {
        componentRef.instance[p] = inputParams[p];
      })
    }

    if (idLookupEntity != null)
      componentRef.instance["idLookupEntity"] = idLookupEntity;

  }
}

export class DynamicLoaderDirectiveData {
  componentSelector: TemplateRef<any> | any | undefined;
  inputParams?: any;
  idLookupEntity?: number | null;
  isEditable?: boolean = false;
  disableRedirectAfterSave: boolean | undefined;
}
