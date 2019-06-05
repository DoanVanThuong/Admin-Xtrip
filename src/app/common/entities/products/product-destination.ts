import { Image } from "../image";

export class ProductDestination {

  id: string = '';
  name: string = '';
  address: string = '';
  type: string = '';
  photo: Image = new Image();
  code: string = '';

  constructor(data: any = {}) {
    if (!_.isEmpty(data)) {
      let self = this;

      _.each(data, function (val, key) {
        if (self.hasOwnProperty(key)) {
          self[key] = val;
        }
      });

      if (data.photo) {
        this.photo = new Image(data.photo);
      }
    }
  }
}