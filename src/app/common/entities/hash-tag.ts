import * as _ from 'lodash';

export class HashTag {
    keyWord: string = '';
    url: string = '';

    constructor(data?: any) {
        let self = this
        _.each(data, (val, key) => {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        })
    }

    setKeyword(keyword: string = '') {
        this.keyWord = keyword;
    }

    setUrl(url: string = '') {
        this.url = url;
    }

    getKeyword() {
        return this.keyWord;
    }

    getUrl() {
        return this.url;
    }
}