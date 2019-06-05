export class Error {
  errorCode: number = null;
  errorMessage: string = '...';
  code: number = 0;
  data: any = null;
  name: string = '';
  value: string = '';

  constructor(data: any) {
    let self = this;
    _.each(data, function (val, key) {
      if (self.hasOwnProperty(key)) {
        self[key] = val;
      }
    });
  }
}

