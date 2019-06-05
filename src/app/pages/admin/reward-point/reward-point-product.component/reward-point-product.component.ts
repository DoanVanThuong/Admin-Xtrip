import { Component } from '@angular/core';
import { AppList } from '../../../../app.list';
import { RewardPoint, RewardRepo, Spinner, NotificationService, Error } from '../../../../common';
@Component({
    selector: 'reward-point-product',
    templateUrl: './reward-point-product.component.html',
})
export class RewardPoiProductComponent extends AppList {
    rewardPoints: RewardPoint[] = new Array<RewardPoint>();
    constructor(private _rewardRepo: RewardRepo, private _spinner: Spinner, private _noti: NotificationService) {
        super();
        this.request = this.getListPoint;
    }
    ngOnInit(): void {
        this.getListPoint();
    }
    //get Booking Flight 
    async getListPoint() {
        this._spinner.show();
        const body = {
            Keyword: this.keyword,
            sortField: '',
            ascending: false,
            from: null,
            to: null
        };
        try {
            const dataFormServe: any = await this._rewardRepo.getListPoint((this.page - 1) * this.pageSize, this.limit, 'product', body);
            this.total = dataFormServe.data.total || 0;
            this.rewardPoints = (dataFormServe.data.data || []).map((item: any) => new RewardPoint(item));
            this._spinner.hide();
        }
        catch (err) {
            const errs = new Error(err);
            this._noti.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 3000);
            this._spinner.hide();
        }
    }
    confirmPoint(point: RewardPoint) {
        this._noti.pushQuestion('Thông tin xác thực', `Tôi muốn cấp điểm cho <strong>${point.customerName}</strong>`, true, 'OK', 'Hủy').then(async (result: any) => {
            if (result.value) {
                this._spinner.show();
                try {
                    await this._rewardRepo.confirmPoint('product', point.code);
                    this._noti.pushAlert('OK', 'gửi điểm thành công', 'success', 3000);
                    this.getListPoint();
                }
                catch (err) {
                    const errs = new Error(err);
                    this._noti.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 3000);
                    this._spinner.hide();
                }
                //end catch
            }
        });
    }
}
