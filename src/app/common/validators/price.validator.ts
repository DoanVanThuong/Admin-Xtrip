import { AbstractControl, FormGroup, FormControl } from '@angular/forms';
import { CPATTERN } from "../../app.constants";

export class PriceValidator {

  public static validate(c: AbstractControl) {
    let regexp = CPATTERN.PRICE;

    return regexp.test(c.value) ? null : {
      validatePrice: {
        valid: false
      }
    };
  }

  //fn validate price origin
  public static validateOriginalPrice(controls: AbstractControl) {
    let originalPrice = controls.get('originalPrice').value;
    let adultPrice = controls.get('adultPrice').value;
    if (!originalPrice || !adultPrice) {
      return null;
    }

    if (originalPrice < adultPrice) {
      controls.get('adultPrice').setErrors({
        validPrice: {
          valid: false
        }
      });
    }
    else {
      controls.get('adultPrice').setErrors(null);
      return null;
    }

  }
}
