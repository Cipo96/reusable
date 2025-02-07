import { Directive, ViewContainerRef, Input, ComponentRef } from '@angular/core';

@Directive({
  selector: '[dynamic]',
})
export class DynamicDirective {

  //In input verrà passato il selettore del componente da ricreare
  @Input() set data(data: any) { // DynamicLoaderDirectiveData) {
    this.load(data.componentSelector, data.inputParams);
  }

  constructor(
    public viewContainerRef: ViewContainerRef
  ) { }

  load(componentSelector: any | undefined, inputParams: any = null): any {
    if (!componentSelector) {
      throw new Error('Non è stato possibile caricare il componente');
    }

    this.viewContainerRef.clear();
    const componentRef: ComponentRef<any> = this.viewContainerRef.createComponent(componentSelector);

    if (inputParams != null) {
      let inputProps = Object.keys(inputParams);
      inputProps.forEach(p => {
        componentRef.instance[p] = inputParams[p];
      })
    }

  }
}

