import * as _ from 'lodash';

export class Image {
    name: string = '';
    src: string = '';
    weight: number = null;
    constructor(data?: any) {
        let self = this;
        _.each(data, function (val, key) {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        });
    }

    setName(name: string = '') {
        this.name = name;
    }

    setSrc(url: string = '') {
        this.src = url;
    }

    getName() {
        return this.name;
    }

    getSrc() {
        return this.src;
    }
}