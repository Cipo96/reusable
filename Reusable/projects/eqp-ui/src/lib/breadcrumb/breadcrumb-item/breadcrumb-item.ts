import {INavAttributes, INavLinkProps} from '../../eqpui.types';

interface IBreadcrumbItem {
  label: string;
  url?: string | any[];
  attributes?: INavAttributes;
  linkProps?: INavLinkProps;
  class?: string;
}

export { INavAttributes, INavLinkProps, IBreadcrumbItem };
