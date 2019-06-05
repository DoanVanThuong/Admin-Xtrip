import * as _ from 'lodash';

export class BookingTour {

  passengers: Array<any> = [];
  code: string = '';
  requestId: string = '';
  departDate: string = '';

  adultsPrice: number = 0;
  childrenPrice: number = 0;
  infantsPrice: number = 0;
  totalPrice: number = 0;

  adults: number = 1;
  children: number = 0;
  infants: number = 0;
  contact: any = {};
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