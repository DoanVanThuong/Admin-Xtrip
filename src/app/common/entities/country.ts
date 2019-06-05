export class Country {
   code: string = 'VN';
    name: string = 'Việt Nam';

    constructor(data: any) {
        let self = this;
        _.each(data, function (val, key) {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        });
    }
}

