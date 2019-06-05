import { AbstractControl } from '@angular/forms';
import { CPATTERN } from "../../app.constants";

export class PhoneNumberValidator {
  public static validate(c: AbstractControl) {
    let regexp = CPATTERN.NUMBER;

    return regexp.test(c.value) ? null : {
        validatePhoneNumber: {
          valid: false
        }
      };
  }
}
