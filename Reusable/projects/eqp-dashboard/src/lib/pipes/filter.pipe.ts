import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {


  transform(items: any[], filter: boolean): any {
    if (!items || (filter == null || filter == undefined)) {
        return items;
    }
    return items.filter(item => (filter == false && item.isHidden != true) || (filter == true && item.isHidden == true));//!item.isHidden || item.isHidden == filter);
  }

}
