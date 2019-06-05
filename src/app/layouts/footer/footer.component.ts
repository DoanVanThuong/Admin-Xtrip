import { Component } from '@angular/core';
import { StorageService } from "../../common/services/storage.service";
import { CLANG } from "../../app.constants";
import { AppForm } from "../../app.form";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { EmailValidator } from "../../common/validators/email.validator";
import { Error } from "../../common/entities/error";

@Component({
  selector: '[app-footer]',
  templateUrl: './footer.html'
})
export class Footer extends AppForm {

  form: FormGroup;
  name: AbstractControl;
  email: AbstractControl;
  content: AbstractControl;

  error: { email: any, name: any, content: any } = { email: '', name: '', content: '' };

  constructor(private fd: FormBuilder,
    protected _storage: StorageService,
    protected _router: Router) {
    super();

    // this.translate.use(this._storage.getItem(CLANG) || 'en');

    this.form = this.fd.group({
      'name': [, Validators.compose([Validators.required])],
      'email': [, Validators.compose([Validators.required, EmailValidator.validate])],
      'content': [, Validators.compose([Validators.required])]
    });

    this.name = this.form.controls['name'];
    this.email = this.form.controls['email'];
    this.content = this.form.controls['content'];
  }

  // fn submit
  onSubmit = (params: any): void => {
    this.showValid = true;

  };

  // fn handle error
  private handleError = (errors: Array<Error> = []): void => {
    let self = this;

    errors.forEach(function (error: Error, index: number) {
      switch (error.errorCode) {
        case 4010:
        case 4011:
        case 4012: {
          self.error.name = error.errorMessage;
          break;
        }
        case 4013:
        case 4014: {
          self.error.email = error.errorMessage;
          break;
        }
        case 4015:
        case 4016: {
          self.error.content = error.errorMessage;
          break;
        }
      }
    });
  }
}
