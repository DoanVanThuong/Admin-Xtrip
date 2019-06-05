import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonModule as AppCommonModule } from '../../../common/common.module';
import { ComponentsModule } from '../../../components/components.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NbChoicesModule } from 'nb-choices';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { CurrencyMaskModule } from "ng2-currency-mask";

import { DataEntryCouponComponent } from './coupon.component';
import { CreateCouponComponent } from './create-coupon/create-coupon.component';
import { PreviewCouponComponent } from './coupon-components/preview-coupon/preview-coupon.component';
import { SelectHotelComponent } from './coupon-components/select-hotel/select-hotel.component';
import { SelectTourComponent } from './coupon-components/select-tour/select-tour.component';
import { SelectAccountComponent } from './coupon-components/select-account/select-account.component';
import { SelectFlightComponent } from './coupon-components/select-flight/select-flight.component';
import { SelectActivityComponent } from './coupon-components/select-activity/select-activity.component';


export const routes = [
    { path: "", component: DataEntryCouponComponent, pathMatch: "full" },
    { path: "create", component: CreateCouponComponent },
    { path: ":id/edit", component: CreateCouponComponent, }

];

const LibModule = [
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NbChoicesModule,
    CurrencyMaskModule

]

const COMPONENT = [
    CreateCouponComponent,
    PreviewCouponComponent,
    SelectHotelComponent,
    SelectTourComponent,
    SelectAccountComponent,
    SelectFlightComponent,
    SelectActivityComponent
]
@NgModule({
    declarations: [
        DataEntryCouponComponent,
        ...COMPONENT
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        AppCommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        ...LibModule
    ],
    bootstrap: [DataEntryCouponComponent],
    providers: [

    ],
})
export class CouponModule {
    static routes = routes;
}