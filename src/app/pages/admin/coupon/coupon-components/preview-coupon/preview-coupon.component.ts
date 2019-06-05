import { Component, Input } from '@angular/core';
import { AppBase } from '../../../../../app.base';

@Component({
    selector: 'preview-coupon',
    templateUrl: './preview-coupon.component.html',
    styleUrls: ['./preview-coupon.component.less']
})
export class PreviewCouponComponent extends AppBase {
    @Input() type: number;
    @Input() code: string;
    @Input() maxTimesUsed: number = 10;
    @Input() description: string = "Giảm giá cho tất cả dịch vụ vé máy bay, khách sạn, tour du lịch, vé tham quan, hoạt động...";
    @Input() maxDiscount: number = 1000000;
    @Input() endDate: string;
    @Input() startDate: string;
    @Input() isPercent: boolean;
    @Input() discountAmount: number;
    numDate: number = 1;
    constructor() {
        super()
    }

    ngOnChanges() {
        this.code = !this.code ? 'XTRIPTEST' : this.code;
        this.description = !this.description ? 'Giảm giá cho tất cả dịch vụ vé máy bay, khách sạn, tour du lịch, vé tham quan, hoạt động...' : this.description;
        this.maxTimesUsed = !this.maxTimesUsed ? 10 : this.maxTimesUsed;
        this.maxDiscount = !this.maxDiscount ? 100000 : this.maxDiscount;
        this.discountAmount = !this.discountAmount ? 100 : this.discountAmount;
        this.numDate = (!this.endDate) ? 1 : moment(this.endDate, "YYYY-MM-DD").diff(moment(this.startDate), 'days') + 1;
    }

    ngOnInit(): void {

    }

}
