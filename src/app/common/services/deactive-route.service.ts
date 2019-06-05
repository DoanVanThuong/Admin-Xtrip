import { Injectable, Inject } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { NotificationService } from './notification.service';
import { CreateTourComponent } from '../../pages/data-entry/tour/create-tour/create-tour.component';
import { ALL_TAB_CREATE_TOUR } from '../../app.constants';

@Injectable()
export class ConfirmDeactivateGuard implements CanDeactivate<CreateTourComponent> {
    constructor(private _notification: NotificationService) {

    }
    canDeactivate(target: CreateTourComponent) {
        if (target.url.includes("tour") && target.tab !== ALL_TAB_CREATE_TOUR.HASHTAG) {
            return this._notification.pushQuestion('Dữ liệu của tour chưa hoàn tất', 'Bạn có chắc muốn thoát', true, 'Thoát', 'Hủy').then((value: any) => {
                return value.value;
            });
        }

        return true;
    }

}