import {AbstractControl} from '@angular/forms';
import {CPATTERN} from "../../app.constants";

export class EmailValidator {

  public static validate(c: AbstractControl) {
    let regexp = CPATTERN.EMAIL;

    return regexp.test(c.value) ? null : {
      email: false
    };
  }
}
