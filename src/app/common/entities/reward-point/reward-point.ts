export class RewardPoint{
    code: string = '';
    customerName:string = '';
    dateUpdatePoints: string = '';
    
    no: number = 0;
    totalPrice: number =  0;
    point: number =  0;
    status: number = 0;
    
    constructor(data?: any) {
        let self = this
        _.each(data, (val, key) => {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        })
    }

}