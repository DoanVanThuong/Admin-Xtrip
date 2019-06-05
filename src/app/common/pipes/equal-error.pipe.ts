import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'equalError'})
export class EqualErrorPipe implements PipeTransform {

  transform(errors: any, error: any, args?: any): any {

    if (!errors) {
      return false;
    }

    let keys = Object.keys(errors);

    if (keys && keys.length > 0) {

      return keys[0] === error;
    }
    return false;
  }
}