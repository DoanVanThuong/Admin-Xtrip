export class ConstructionCode {
    stt: number = 0;
    id: string = '';
    code: string = '';
    name: string= '';
    departDate: string = '';
    type: number = 1;
    createdDate: string = '';
    lastModified: string = '';

    constructor(data: any) {
        let self = this;
        _.each(data, function (val, key) {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        });
    }
}