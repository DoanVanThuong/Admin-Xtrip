export class Account {
    createdDate: string = '';
    email: string = '';
    enabled: string = '';
    fullName: string = '';
    id: string = '';
    lastModified: string = '';
    userName: string = '';

    roles: any[] = [];  //quyền của user
    stt: number = -1;

    constructor(data?: any) {
        let self = this
        _.each(data, (val, key) => {
            if (self.hasOwnProperty(key)) {
                self[key] = val;
            }
        })
    }
}