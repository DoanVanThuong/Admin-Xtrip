import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';

import {
  AuthRepository,
  EmailValidator,
  Error,
} from '../../../common/index';

import {AppForm} from '../../../app.form';
import {GlobalState} from '../../../global.state';

@Component({
  selector: 'app-admin-forgot',
  templateUrl: './forgot.html'
})
export class Forgot extends AppForm implements OnInit {

  showPassword: boolean = false;
  form: FormGroup;
  email: AbstractControl;

  succeed: any = '';
  error: { email: any } = {email: ''};

  constructor(fb: FormBuilder,
              protected _router: Router,
              protected _state: GlobalState,
              protected _authRepo: AuthRepository) {
    super();

    this.form = fb.group({
      'email': ['', Validators.compose([
        Validators.required,
        EmailValidator.validate
      ])]
    });

    this.email = this.form.controls['email'];

    this.showValid = false;
  }

  // fn on initial
  ngOnInit() {
    this.onInit();
  }

  // fn on initial
  onInit() {
    $('body').addClass('login-page');
  }

  // fn submit signin
  onSubmit = (params: any): void => {

    this.showValid = true;
    this.error = {email: ''};
    this.succeed = '';

    this._authRepo
      .forgot(params.email)
      .then(
        (res) => {
          this.succeed = res;
          this.resetForm(this.form);
        },
        (errors: Array<Error>) => {
          this.handleError(errors);
        }
      );
  };

  // fn handle error
  private handleError = (errors: Array<Error> = []): void => {
    let self = this;

    errors.forEach(function (error: Error, index: number) {
      switch (error.errorCode) {
        case 2005:
        case 3000:
        case 3001:
        case 3003:
        case 3004:
        case 3019:
        case 3020:
        case 3021:
        case 3022: {
          self.error.email = error.errorMessage;
          break;
        }
      }
    });
  }

}
