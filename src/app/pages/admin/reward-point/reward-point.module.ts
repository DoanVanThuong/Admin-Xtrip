import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RewardPointComponent } from './reward-point.component';
import { ComponentsModule } from '../../../components/components.module';
import { CommonModule as AppCommonModule } from "../../../common/common.module";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { RewardPointFlightComponent } from './reward-point-flight.component/reward-point-flight.component';
import { RewardPointHotelComponent } from './reward-point-hotel.component/reward-point-hotel.component';
import { RewardPoinTourComponent } from './reward-point-tour.component/reward-point-tour.component';
import { RewardPoiProductComponent } from './reward-point-product.component/reward-point-product.component';

// routing
export const routes = [
    { path: "", component: RewardPointComponent, pathMatch: "full" }
];
@NgModule({
    declarations: [
        RewardPointComponent,
        RewardPointFlightComponent,
        RewardPointHotelComponent,
        RewardPoinTourComponent,
        RewardPoiProductComponent
    ],
    imports: [ 
        CommonModule,
        ComponentsModule,
        AppCommonModule,
        PaginationModule,
        FormsModule,
        TabsModule,
        RouterModule.forChild(routes),
    ],
    exports: [],
    providers: [],
    bootstrap: [RewardPointComponent]
})
export class RewardPointModule {
    static routes = routes;
}