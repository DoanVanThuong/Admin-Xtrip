import { Component, Input } from '@angular/core';
import { PopupBase } from '../popup.component';
import * as _ from 'lodash';
@Component({
    selector: 'preview-journey-popup',
    templateUrl: './popup-preview-journey.component.html',
    styleUrls: ['./popup-preview-journey.less']
})

export class PreviewJourneyPopupComponent extends PopupBase {

    @Input() data: any = null;
    @Input() title: string = '';
    journey: any = null;

    constructor() {
        super();
    }

    ngOnInit() {
    }

    ngOnChanges() {
        if (!!this.data && !_.isNull(this.data)) {
            this.journey = _.clone(this.data);
            this.journey.details = (this.journey.details || []).map((item: any) => {
                return {
                    idx: item.idx,
                    name: item.name,
                    items: item.items,
                    title: item.title,
                    options: item.options,
                    isShow: false
                };
            });
        }
    }
}