import { Injectable } from "@angular/core";
import { BaseRepository } from "./base.repository";
import { RewardPoint } from "../entities";
import { ApiService } from "../services";

@Injectable()
export class RewardRepo extends BaseRepository{
    constructor(_api: ApiService) {
        super(RewardPoint, 'admin', null, _api);
    }

    //fn get list reward point
    getListPoint(offset: number = 0, limit: number = 10, module: string = 'flight', data:any = {}) {
        return new Promise((resolve, reject) => {
            return this._api.customPOST(`core/${module}/report/rewardpoint`, data, {
                offset: offset,
                limit: limit
            }).then(
                (response: any) => {
                    this.success(response, resolve, reject);
                },
                (errors: Error[] = []) => reject(errors)
            );
        });
    }

    //fn confirm point
    confirmPoint(module:string = 'flight', code: string = '') {
        return new Promise((resolve, reject) => {
            return this._api.post(`core/${module}/report/rewardpoint/confirm/${code}`).then(
                (response: any) => {
                    this.success(response, resolve, reject);
                },
                (errors: Error[] = []) => reject(errors)
            );
        });
    }
}