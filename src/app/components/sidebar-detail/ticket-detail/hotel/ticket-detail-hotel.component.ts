import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { AppBase } from '../../../../app.base';
import { NotificationService, Spinner, HotelRepo, Error } from '../../../../common';

@Component({
    selector: 'sidebar-ticket-detail-hotel',
    templateUrl: './ticket-detail-hotel.component.html',
    styleUrls: ['./ticket-detail-hotel.component.less']
})
export class SideBarTicketDetailHotelComponent extends AppBase {

    @Input() open = false;
    @Input() data: any = {};
    @Input() ticketIssueId: string = '';
    @Output() onChangePNR: EventEmitter<any> = new EventEmitter<any>();

    isShowEditPnr: boolean = false;
    statusBooking: boolean = false;
    isShowFormEditPnr: boolean = false;

    selectedPnr: string = '';

    constructor(
        private _hotelRepo: HotelRepo,
        private _noti: NotificationService,
        private _spinner: Spinner) {
        super();
    }

    ngOnInit() { }

    ngOnChanges() {
        if (_.isEmpty(this.data)) {
            this.open = false;
            this.isShowEditPnr = false;

        } else {
            this.open = true;
        }
        this.isShowEditPnr = !this.statusBooking;
        this.isShowFormEditPnr = false;
    }

    //fn detect ESC key to close sidebar
    @HostListener('document:keyup', ['$event']) onKeyDown(event) {
        if (event.keyCode === 27 || event.code === 'Escape') {
            if (this.open) {
                this.open = false;
            }
        }
    }

    hideDetail() {
        this.open = !this.open;
    }

    //fn open edit PNR
    onEditPrn() {
        this.isShowFormEditPnr = !this.isShowFormEditPnr;
    }

    onUpdatePnr(pnr: string = '') {
        this._noti.pushQuestion('Sửa mã PNR', 'Bạn có chắc muốn sửa mã của vé này', true, 'Cập nhật', 'Hủy').then((value: any) => {
            if (value.value) {
                this.UpdatePnr(pnr);
            }
        })
    }

    //fn update PNR
    async UpdatePnr(pnr: string) {
        this._spinner.show();
        const body = {
            id: this.ticketIssueId,
            newPnr: pnr
        }
        try {
            const response: any = await this._hotelRepo.updatePnr(body);
            //emit to get new Data
            this.onChangePNR.emit({
                isChange: true,
                id: this.ticketIssueId
            });
            this.isShowFormEditPnr = !this.isShowFormEditPnr;

            this._noti.pushAlert('Thành công', 'Mã PNR đã được cập nhật', 'success', 3000);

        } catch (error) {
            const err:Error = new Error(error[0]);
            this._noti.pushToast('', err.value,'error',3000);
        }
        finally {
            this._spinner.hide();
        }
    }
}
