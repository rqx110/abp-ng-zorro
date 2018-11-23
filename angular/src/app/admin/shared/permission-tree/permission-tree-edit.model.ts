import { FlatPermissionDto } from '@shared/service-proxies/service-proxies';

export interface PermissionTreeEditModel {
  permissions: FlatPermissionDto[];

  grantedPermissionNames: string[];
}
