import { Component } from '@angular/core';
import { AppBase } from '../../../../../app.base';
import { HashTag, Spinner, TourRepo, NotificationService, Error, StorageService } from '../../../../../common';
import { ActivatedRoute, Router } from '@angular/router';
import swal from "sweetalert2";
import { CSTORAGE, ACTION_TOUR } from '../../../../../app.constants';

@Component({
    selector: 'tour-hash-tag',
    templateUrl: './hash-tag.component.html',
    styleUrls: ['./hash-tag.component.less']
})
export class TourHashTagComponent extends AppBase {
    hashTags: HashTag[] = [];
    tourId: string = '';
    action: string = 'create';
    tourInfo: any = {};

    constructor(private _spinner: Spinner,
        private _activedRoute: ActivatedRoute,
        private _tourRepo: TourRepo,
        private _notificaiton: NotificationService,
        private _localstorage: StorageService,
        private _router: Router) {
        super();
    }

    ngOnInit(): void {
        this._activedRoute.queryParams.subscribe((params: any) => {
            if (!!params && params.id && params.action) {
                this.tourId = params.id;
                this.action = params.action;
                this.getTourHashTag(this.tourId);
            }
        });
        switch (this.action) {
            case ACTION_TOUR.CREATE: {
                this.tourInfo = this._localstorage.getItem(CSTORAGE.TOUR_GENERAL, true);
                break;
            }
            case ACTION_TOUR.CLONE: {
                this.tourInfo = this._localstorage.getItem(CSTORAGE.CLONETOUR, true);
                break;
            }
            default:
                break;
        }
    };

    addHashTag() {
        this.hashTags.push(new HashTag());
    }

    deleteHashTag(hashTag: HashTag, index: number) {
        this.hashTags.splice(index, 1);
    }

    onUpdate() {
        switch (this.action) {
            case ACTION_TOUR.UPDATE: {
                this.updateHashTag(this.tourId, this.hashTags);
                break;
            }
            default:
                this.updateHashTag(this.tourInfo.id, this.hashTags);
                break;
        }
    }

    //fn get tour hashtag
    async getTourHashTag(id: string) {
        this._spinner.show();
        try {
            const response: any = await this._tourRepo.getHashTag(id);
            this.hashTags = (response.data || []).map((item: any) => new HashTag(item));
        } catch (error) {
            const errs = new Error(error[0]);
            this._notificaiton.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
        }
        finally {
            this._spinner.hide();
        }
    }

    //fn update
    async updateHashTag(id: string = '', hashTag: HashTag[] = []) {
        this._spinner.hide();
        const body = {
            hashTags: hashTag
        }
        try {
            await this._tourRepo.updateHashTag(id, body);
            if (this.action === 'update') {
                this._notificaiton.pushAlert('Update từ khóa thành công', '', 'success', 2000);
            }
            else {
                swal({
                    title: "Thêm tour thành công",
                    type: "success",
                }).then(() => {
                    if (this.action === ACTION_TOUR.CREATE) {
                        this._localstorage.removeItem(CSTORAGE.TOUR_GENERAL);
                    }
                    else {
                        this._localstorage.removeItem(CSTORAGE.CLONETOUR);
                    }
                    this._router.navigate(['data-entry/tour']);
                });
            }
        } catch (error) {
            const errs = new Error(error[0]);
            this._notificaiton.pushToast(`${errs.errorMessage}`, 'vui lòng kiểm tra lại', 'error', 2000);
        } finally {
            this._spinner.hide();
        }
    }
}


