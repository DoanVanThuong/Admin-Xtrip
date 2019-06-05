import { Component, Input } from '@angular/core';
import { PopupBase } from '../../../../../components/popup/popup.component';
import { TourRepo } from '../../../../../common';
import { Router } from '@angular/router';

@Component({
    selector: 'tour-detail-popup',
    templateUrl: './tour-detail.popup.html',
    styleUrls: ['./tour-detail.popup.less']
})
export class TourDetailPopup extends PopupBase {
    @Input() code: string;

    journey: any = null;
    terms: any = null;
    policy: any = null;
    tourInfo: any = null;

    constructor(private _tourRepo: TourRepo,
        private _router: Router) {
        super();
    }

    ngOnInit(): void {
    }

    ngOnChanges() {
        if (!!this.code) {
            Promise.all([this.getJourney(this.code), this.getDetail(this.code)])
        }
    }

    async getJourney(tourCode: string) {
        try {
            const response: any = await this._tourRepo.getJourneyTourByCode(tourCode);
            this.journey = response.data;
            this.journey.details = this.journey.details.map((item: any) => {
                return {
                    idx: item.idx,
                    name: item.name,
                    items: item.items,
                    title: item.title,
                    options: item.options,
                    isShow: true
                };
            });
        } catch (error) { }
    }

    async getDetail(tourCode: string) {
        try {
            const response: any = await this._tourRepo.getDetailTour(tourCode);
            this.tourInfo = response.data;
        } catch (error) { }
    }

    onBookTour() {
        this.hide();
        this._router.navigate(['booking/tour'], {
            queryParams: {
                tab: 'general',
                serialCode: this.tourInfo.code
            }
        });
    }
}
