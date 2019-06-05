export class Receipt {
    total: number = 0;
    status: number = 0 ;
    stt: number = 0;
    type: number = 0;
    
    id: string = '';
    name: string = '';
    date: string = '';
    code: string = '';
    description: string = '';
    customerName: string = '';
    customerId: string = '';
    createdDate: string = '';
    lastModified: string = '';
    details: any[] = [];
    orderCode: string = '';
    orderId: string = '';
    receiptDate: string = '';
    remark: string = '';
    serialCode: string = '';
    serialId: string = '';

    transactionId:string = '';
    refundDate: string = '';
    constructor(data?: any) {
        let self = this
        _.each(data, (val, key) => {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        })
    }
}