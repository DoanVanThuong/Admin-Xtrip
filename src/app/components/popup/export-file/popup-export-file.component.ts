import { Component, Input } from '@angular/core';
import { PopupBase } from '../popup.component';
import { ActivatedRoute } from '@angular/router';

import * as FileSaver from 'file-saver';
import { TourRepo, FlightRepo, HotelRepo, NotificationService, Error } from '../../../common';
import { FILE_TYPE } from '../../../app.constants';

@Component({
    selector: 'export-file-popup',
    templateUrl: './popup-export-file.component.html',
    styleUrls: ['./popup-export-file.less']
})
export class ExportFilePopupComponent extends PopupBase {
    @Input() module: string = '';

    files: any[] = [
        { title: 'Excel', icon: 'fa fa-file-excel-o' },
        { title: 'PDF', icon: 'fa fa-file-pdf-o' },
    ]

    bsConfig: any = {};
    bsRangeValue: Date = null;
    selectedFileType: any = null;

    selectedModule: string = '';
    from: string = '';
    to: string = '';

    constructor(private _activeRouter: ActivatedRoute,
        private _tourRepo: TourRepo,
        private _flightRepo: FlightRepo,
        private _hotelRepo: HotelRepo,
        private _notification: NotificationService
    ) {
        super();
        this.selectedFileType = this.files[0];
    }

    ngOnInit() {
        this.bsConfig = Object.assign(this.bsConfig, {maxDate: new Date()});
    }

    ngOnChanges() {
        this.selectedModule = this.module;
    }

    onPopupClose() {
        this.bsRangeValue = null;
    }

    //fn select file type
    selectFileType(file: any) {
        this.selectedFileType = file;
    }

    //fn get date range
    getDateRange(date: any) {
        if (!!date) {
            this.bsRangeValue = date;
            this.from = this.bsRangeValue[0];
            this.to = this.bsRangeValue[1];
        }
    }

    //fn download file
    async downLoadFile() {
        const body = {
            from: moment(this.from).format("YYYY-MM-DD"),
            to: moment(this.to).format("YYYY-MM-DD"),
        }

        //detect export with module?
        switch (this.selectedModule) {
            case 'flight':
                {
                    try {
                        const data: any = await this._flightRepo.export(body);
                        const blob = new Blob([data], { type: FILE_TYPE.EXCEL });
                        if (!!blob) {
                            FileSaver.saveAs(blob, `flight-booking_${body.from}_${body.to}_Report.xlsx`);
                        }
                    } catch (error) {
                        const errs = new Error(error);
                        this._notification.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 3000);
                    }
                }
                break;

            case 'hotel':
                {
                    try {
                        const data: any = await this._hotelRepo.export(body);
                        const blob = new Blob([data], { type: FILE_TYPE.EXCEL });
                        if (!!blob) {
                            FileSaver.saveAs(blob, `hotel-booking_${body.from}_${body.to}_Report.xlsx`);
                        }
                    } catch (error) {
                        const errs = new Error(error);
                        this._notification.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 3000);
                    }
                }
                break;

            case "tour":
                {
                    try {
                        const data: any = await this._tourRepo.export(body);
                        const blob = new Blob([data], { type: FILE_TYPE.EXCEL });
                        if (!!blob) {
                            FileSaver.saveAs(blob, `tour-booking_${body.from}_${body.to}_customerReport.xlsx`);
                        }
                    } catch (error) {
                        const errs = new Error(error);
                        this._notification.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 3000);
                    }
                }
                break;
            case 'flight-transfer':
                {
                    try {
                        const data: any = await this._flightRepo.exportPaymentTransfer(body);
                        const blob = new Blob([data], { type: FILE_TYPE.EXCEL });
                        if (!!blob) {
                            FileSaver.saveAs(blob, `flight-transfer_${body.from}_${body.to}_customerReport.xlsx`);
                        }
                    } catch (error) {
                        const errs = new Error(error);
                        this._notification.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 3000);
                    }
                }
                break;
            case 'hotel-transfer':
                {
                    try {
                        const data: any = await this._flightRepo.exportPaymentTransfer(body);
                        const blob = new Blob([data], { type: FILE_TYPE.EXCEL });
                        if (!!blob) {
                            FileSaver.saveAs(blob, `hotel-transfer_${body.from}_${body.to}_customerReport.xlsx`);
                        }
                    } catch (error) {
                        const errs = new Error(error);
                        this._notification.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 3000);
                    }
                }
                break;
            case 'tour-transfer':
                {
                    try {
                        const data: any = await this._tourRepo.exportPaymentTransfer(body);
                        const blob = new Blob([data], { type: FILE_TYPE.EXCEL });
                        if (!!blob) {
                            FileSaver.saveAs(blob, `tour-transfer_${body.from}_${body.to}_customerReport.xlsx`);
                        }
                    } catch (error) {
                        const errs = new Error(error);
                        this._notification.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 3000);
                    }
                }
                break;
            case 'ticket-issued':
                {
                    try {
                        const data: any = await this._flightRepo.exportTicketIssued(body);
                        const blob = new Blob([data], { type: FILE_TYPE.EXCEL });
                        if (!!blob) {
                            FileSaver.saveAs(blob, `ticket-issued_${body.from}_${body.to}.xlsx`);
                        }

                    } catch (error) {
                        const errs = new Error(error);
                        this._notification.pushToast(`${errs.value}`, 'vui lòng kiểm tra lại', 'error', 3000);
                    }
                }
                break;
            case 'ticket-need-issued':
                {
                    try {
                        const data: any = await this._flightRepo.exportTicketNeedIssued(body);
                        const blob = new Blob([data], { type: FILE_TYPE.EXCEL });
                        if (!!blob) {
                            FileSaver.saveAs(blob, `ticket-need-issued_${body.from}_${body.to}.xlsx`);
                        }

                    } catch (error) {
                        const errs = new Error(error);
                        this._notification.pushToast(`${errs.value}`, 'vui lòng kiểm tra lại', 'error', 3000);
                    }
                }
                break;
            default:
                this.hide();
                break;
        }

        this.hide();
    }

    //fn save As using DOM element
    saveFile(data: any) {
        const blob = new Blob([data], { type: "application/vnd.ms-excel" });
        let filename = 'test-download.xlsx';

        let anchorElem = document.createElement("a");

        if (window.navigator.msSaveBlob) {
            // TODO IE export
            window.navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            const url = window.URL.createObjectURL(blob);
            $(anchorElem).attr('href', url)
                .attr('download', filename)
                .css('display', 'none')
                .appendTo('body')
            [0].click();

            setTimeout(() => {
                document.body.removeChild(anchorElem);
                window.URL.revokeObjectURL(url);
            }, 500);
        }
    }



}
