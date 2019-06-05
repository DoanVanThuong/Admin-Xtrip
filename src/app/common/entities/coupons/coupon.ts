import * as _ from 'lodash';
export class Coupon {

  id: string = '';

  isPercent: boolean = false;
  discount: number = 0;
  quantity: number = 0;

  enabled: boolean = false;
  code: string = '';
  name: string = '';
  summary: string = '';
  description: string = '';
  startDate: string = '';
  endDate: string = '';
  terms: string = '';

  usePercentage: boolean = false;
  customApply: boolean = false;

  discountPercentage: number = 0;
  discountAmount: number = 0;
  maxDiscount: number = 0;
  minOrderAmount: number = 0;
  limitationValue: number = 0;
  timesUsed: number = 0;
  maxTimesUsed: number = 0;
  applyToCustomer: number = 1;

  services: any = [];
  hotels: any = [];
  flights: any[] = [];
  tours: any[] = [];
  apply4Accounts: any[] = [];
  products: any[] = [];
  devices: any[] = [];
  constructor(data?: any) {
    if (!_.isEmpty(data)) {
      let self = this;
      let keys = [];

      _.each(data, function (val, key) {
        if (self.hasOwnProperty(key) && !!key) {
          self[key] = val;
        }
      });
    }
  }
}