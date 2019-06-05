export class VAT {
    companyName: string = '';
    companyAddress: string = '';
    taxIdentificationNo: string= '';
    
    constructor(data?: any) {
        let self = this
        _.each(data, (val, key) => {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        })
    }
}