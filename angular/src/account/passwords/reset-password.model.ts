import { ResetPasswordInput } from '@shared/service-proxies/service-proxies';

export class ResetPasswordModel extends ResetPasswordInput {
  public passwordRepeat: string;
}
