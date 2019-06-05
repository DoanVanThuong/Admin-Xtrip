export class BaseEntity {

  constructor(data?: any) {
    let self = this;
    if (!_.isObject(data) && !_.isArray(data) && !_.isEmpty(data)) {
      _.each(data, function (val, key) {
        if (self.hasOwnProperty(key)) {
          self[key] = val;
        }
      });
    }
  }
}
