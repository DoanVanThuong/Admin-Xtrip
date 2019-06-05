import { ScheduleOption } from "./schedule-option";

export class TourTermPolicy {
    term: TourTerm = new TourTerm();
    policy: TourPolicy = new TourPolicy();

    constructor(data?: any) {
        let self = this;
        _.each(data, (val, key) => {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        });
        if (!!data.policy) {
            this.policy = new TourPolicy(data.policy);
        }

        if (!!data.term) {
            this.term = new TourTerm(data.term);
        }

    }
}

export class TourPolicy {
    include: string = '';
    exclude: string = '';
    surcharges: ScheduleOption[] = [];

    constructor(data?: any) {
        if (!_.isEmpty(data)) {
            let self = this;
            _.each(data, function (val, key) {
                if (self.hasOwnProperty(key)) {
                    self[key] = val;
                }
            });
            if (!!data.surcharges) {
                self.surcharges = data.surcharges.map(option => new ScheduleOption(option));
            }
        }
    }
}

export class TourTerm {
    refund: string = '';
    visa: string = '';
    notes: string = '';
    constructor(data?: any) {
        if (!_.isEmpty(data)) {
            let self = this;
            _.each(data, function (val, key) {
                if (self.hasOwnProperty(key)) {
                    self[key] = val;
                }
            });
        }
    }
}