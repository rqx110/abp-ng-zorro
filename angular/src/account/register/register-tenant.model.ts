import { EditionSelectDto, RegisterTenantInput } from '@shared/service-proxies/service-proxies';

export class RegisterTenantModel extends RegisterTenantInput {
    public passwordRepeat: string;
    public edition: EditionSelectDto;
}
