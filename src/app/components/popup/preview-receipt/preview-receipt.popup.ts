import { Component, Input } from '@angular/core';
import { PopupBase } from '../popup.component';

@Component({
    selector: 'preview-receipt-popup',
    templateUrl: './preview-receipt.popup.html',
    styleUrls: ['./preview-receipt.popup.less']
})
export class PreviewReceiptPopupComponent extends PopupBase {

    @Input() data: any = null;

    constructor() {
        super();
    }
    ngOnInit(): void {
    }

    ngOnChanges() {
        if (!!this.data) {
        }
    }


    onPrint() {
        setTimeout(() => {
            this.PrintElem('printer');
        }, 500)
    }

    onShowModal(e: any) {
        this.onPrint();
    }

    PrintElem(elem) {

    }
}
