import { RegisterInput } from '@shared/service-proxies/service-proxies';

export class RegisterModel extends RegisterInput {
    public passwordRepeat: string;
}
