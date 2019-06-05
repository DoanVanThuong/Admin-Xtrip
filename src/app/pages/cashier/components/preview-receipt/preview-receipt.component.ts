import { Component, Input } from '@angular/core';
import { AppBase } from '../../../../app.base';


@Component({
    selector: 'preview-receipt',
    templateUrl: './preview-receipt.component.html',
})
export class PreviewReceiptComponent extends AppBase {
    @Input() data: any = null;
    constructor() {
        super();
    }

    ngOnInit(): void { }
}
