import { Component, Input } from '@angular/core';
import { AppBase } from '../../../../app.base';


@Component({
    selector: 'preview-refund',
    templateUrl: './preview-refund.component.html',
})
export class PreviewRefundComponent extends AppBase {
    @Input() data: any = null;
    constructor() {
        super();
    }

    ngOnInit(): void { }
}
