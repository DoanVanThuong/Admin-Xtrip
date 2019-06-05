import { ActivityTour } from "./activity-tour";
import { ScheduleOption } from "./schedule-option";

export class ScheduleTour {
    idx: number = null;
    name: string = '';
    items: ActivityTour[] = [];
    options: ScheduleOption[] = [];

    constructor(data?: any) {
        let self = this;
        _.each(data, function (val, key) {

            let keys = ['items'];

            if (self.hasOwnProperty(key) && keys.indexOf[key] === -1) {
                self[key] = val;
            }

            if (!!data.items) {
                self.items = data.items.map(activity => new ActivityTour(activity));
            }
            if(!!data.options) {
                self.options = data.options.map(option => new ScheduleOption(option));
            }
        });
    }


    setId(id: any) {
        this.idx = id;
    }

    getId() {
        return this.idx;
    }



}