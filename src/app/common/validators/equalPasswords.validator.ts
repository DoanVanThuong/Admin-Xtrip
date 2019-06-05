import { FormGroup } from '@angular/forms';

export class EqualPasswordsValidator {

  public static equalPassword(field) {

    return (c: FormGroup) => {

      if (!c.parent) {
        return null;
      }

      return (c.parent.controls && c.parent.controls[field].value === c.value) ? null : {
        passwordsEqual: {
          valid: false
        }
      };
    }
  }
}
