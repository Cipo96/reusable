import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})


export class ComponentMapperService {

  constructor() { }

  static register(key: string, value: any) {
    COMPONENT_MAPPER.pool[key] = value;
  }

}


export class DynamicModuleConfig {
  public entities?: { key?: string; entity: any }[] = [];
}

export class COMPONENT_MAPPER {
  public static pool: { [key: string]: any } = {};
  static get(key: string) {
    let entity = COMPONENT_MAPPER.pool[key];
    if (!entity) {
      throw new Error(
        `No entity mapped for '${key}'. Please register Entity with component mapper service on your start up`
      );
    }
    return entity;
  }
}
