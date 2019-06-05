import * as _ from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fileName' })
export class GetFileNameFromUrl implements PipeTransform {

    transform(url: string): any {
        return url || ''.replace(/^.*[\\\/]/, '') || url;
    }
}