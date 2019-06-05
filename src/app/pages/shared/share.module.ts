import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerProductComponent } from './customer-activity/customer-product.component';
import { CommonModule as AppCommonModule } from "../../common/common.module";
import { ComponentsModule } from "../../components/components.module";
import { PaginationModule } from 'ngx-bootstrap//pagination';
import { CustomerHotelComponent } from './customer-hotel/customer-hotel.component';
import { CustomerTourComponent } from './customer-tour/customer-tour.component';
import { CustomerFlightComponent } from './customer-flight/customer-flight.component';

@NgModule({
    declarations: [
        CustomerProductComponent,
        CustomerHotelComponent,
        CustomerTourComponent,
        CustomerFlightComponent
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        AppCommonModule,
        PaginationModule,
        FormsModule
    ],
    exports: [
        CustomerProductComponent,
        CustomerHotelComponent,
        CustomerTourComponent,
        CustomerFlightComponent


    ],
    providers: [],
})
export class ShareModule { }