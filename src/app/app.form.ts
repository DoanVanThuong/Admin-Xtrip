import { FormGroup, FormControl, FormArray } from '@angular/forms';

import { AppBase } from './app.base';

declare let moment: any;

export abstract class AppForm extends AppBase {

  showValid: boolean = false;
  minDate: Date = new Date(moment().add(-1, 'days').format('YYYY-MM-DD'));
  file: any;

  constructor() {
    super();
  }

  /*** Reset validator form ***/
  resetForm(form: FormGroup, cleanFields: boolean = true, cleanValidate: boolean = true): void {

    if (cleanFields) {
      form.reset();
    }

    _.forEach(form.controls, function (control, name) {

      if (control instanceof FormControl) {
        if (cleanValidate) {
          control.setValue(null);
          control.reset();
          control.setErrors(null);
        }

        // control.markAsUntouched(true);
        // control.markAsPristine(true);

      } else if (control instanceof FormArray) {
        _.forEach(control.controls, function (control, name) {

          if (control instanceof FormControl) {
            if (cleanValidate) {
              control.setValue(null);
              control.reset();
              control.setErrors(null);
            }

            // control.markAsUntouched(true);
            // control.markAsPristine(true);

          }
        });
      }
    });
  }
}
