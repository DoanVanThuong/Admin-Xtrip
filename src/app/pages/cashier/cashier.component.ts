import { Component } from '@angular/core';
import { AppBase } from '../../app.base';

@Component({
    selector: 'cashier',
    templateUrl: './cashier.component.html',
})
export class CashierComponent extends AppBase {
    constructor() {
        super();
    }

    ngOnInit(): void { }
}
