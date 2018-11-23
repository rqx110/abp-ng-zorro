import { Injectable } from '@angular/core';
import { RegisterTenantOutput } from '@shared/service-proxies/service-proxies';

@Injectable()
export class TenantRegistrationHelperService {

    registrationResult: RegisterTenantOutput;

}
