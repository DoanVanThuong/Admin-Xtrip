import { AppForm } from "../../app.form";
import { ModalOptions, ModalDirective } from "ngx-bootstrap";
import { ViewChild } from "@angular/core";

export abstract class PopupBase extends AppForm {

    @ViewChild('popup') popup: ModalDirective;
    options: ModalOptions = {
        animated: false
    };

    reset: any = null;

    constructor() {
        super();
    }

    ngOnDestroy() {

    }

    // fn set options
    setOptions = (options?: any) => {
        let self = this;
        if (_.isObject(options) || _.isArray(options)) {
            _.each(options, function (val, key) {
                if (self.hasOwnProperty(key)) {
                    self[key] = val;
                }
            });
        }
    };

    // show poup
    show(options?: any): void {

        this.setOptions(Object.assign(this.options, options));

        if (!this.popup.isShown) {

            if (typeof (this.reset) === 'function') {
                this.reset();
            }

            this.popup.config = this.options;
            this.popup.show();
        }
    }

    // close popup
    hide(): void {
        this.popup.hide();
    }
}
