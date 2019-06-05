import { Component, Input } from '@angular/core';
import { PopupBase } from '../popup.component';

@Component({
    selector: 'tour-info-popup',
    templateUrl: './popup-tour-info.component.html',
    styleUrls: ['./popup-tour-info.less']
})

export class TourInfoPopupComponent extends PopupBase {

    @Input() data: any = null;
    @Input() journey: any = null;

    tourInfo: any = null;

    constructor() {
        super()
    }

    ngOnChanges() {
        if (!!this.data && !!this.journey) {
            this.tourInfo = this.data;
            
            this.journey.details = (this.journey.details || []).map((item: any) => {
                return {
                    idx: item.idx,
                    name: item.name,
                    items: item.items,
                    title: item.title,
                    options: item.options,
                    isShow: true
                };
            });
        }
    }
    ngOnInit() {
    }

}
