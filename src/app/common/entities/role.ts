export class Role {
  id: string = '';
  roleName: string = 'Local';

  constructor(data?: any) {
    let self = this
    _.each(data, (val, key) => {
      if (self.hasOwnProperty(key)) {
        self[key] = val;
      }
    })
  }
}