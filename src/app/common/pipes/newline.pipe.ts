import {Pipe, PipeTransform} from '@angular/core';
/*
 * Converts newlines intro html breaks
 */
@Pipe({name: 'newline'})
export class NewlinePipe implements PipeTransform {
  transform(value: string, args: string[]): any {
    return value.replace(/(?:\r\n|\r|\n|\\n|\\r)/g, '<br/>');
  }
}
