enum STATUS {
    SUCCESS = 'Success',
    FAIL = 'Fail'
}

export class JsonResult {
    code: STATUS = null;
    data: any = null;
    errors: any[] = [];
    message: string = null;
    status: boolean = false;

    constructor(data?: any) {
        let self = this
        _.each(data, (val, key) => {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        })
    }
}