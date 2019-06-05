import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'textEllipsis'})
export class TextEllipsisPipe implements PipeTransform {
  transform(value: string, digit: number) {
    if (!digit) {
      return value;
    }

    let text = value.toString();
    if (text.length <= digit) {
      return text;
    }

    return text.slice(0, digit) + '...';
  }
}
