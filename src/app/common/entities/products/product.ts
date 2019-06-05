import { Image } from "../image";
import { ProductDestination } from "./product-destination";
export class Product {

  id: string = '';
  name: string = '';
  alias: string = '';
  destination: ProductDestination = new ProductDestination();
  points: number = 0;
  instantConfirmation: boolean = false;
  photo: Image = new Image();
  photos: Image[] = new Array<Image>();
  tag: any = null;
  sellingPrice: number = 0;
  originalPrice: number = 0;
  percentDiscount: number = 0;
  durationDays: number = 0;
  durationHours: number = 0;
  durationMinutes: number = 0;
  reviewCount: number = 0;
  address: string = '';
  reviewAverageScore: number = 0;
  weight: number = 1;
  
  constructor(data: any = {}) {
    if (!_.isEmpty(data)) {
      let self = this;

      let keys = ['destination', 'photo', 'photos'];

      _.each(data, function (val, key) {
        if (self.hasOwnProperty(key) && keys.indexOf(key) === -1) {
          // existing key and key not in keys list

          self[key] = val;
        }
      });

      if (data.destination) {
        this.destination = new ProductDestination(data.destination);
      }

      if (data.photo) {
        this.photo = new Image(data.photo);
      }

      if (data.photos) {
        this.photos = data.photos.map((photo: any) => new Image(photo));
      }
    }
  }
}

