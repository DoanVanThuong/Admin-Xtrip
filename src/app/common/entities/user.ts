import { Role } from "./role";
import { NODATA } from "dns";

export class User {

    id: any = '';
    title: string = '';
    firstName: string = '';
    lastName: string = '';
    fullName: string = '';
    birthday: string = '';
    picture: string = '';
    userType: string = '';
    emails: any[] = [];
    phones: any[] = [];
    rewardPoints: any[] = [];
    email: string = '';
    roles: any[] = [];
    constructor(data?: any) {

        if (!_.isEmpty(data)) {

            const self = this;
            _.each(data, (val, key) => {
                if (self.hasOwnProperty(key)) {
                    self[key] = val;
                }
            });

            if (data.emails) {
                self.emails = self.emails.map(item => {
                    const email = {
                        addr: item.addr,
                        type: item.type,
                        verified: item.verified
                    }
                    return email;
                })
            }
        }
    }
}
