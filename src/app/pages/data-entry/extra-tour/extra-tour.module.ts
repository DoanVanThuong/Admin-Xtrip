import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtraTourComponent } from './extra-tour.component';
import { ComponentsModule } from '../../../components/components.module';
import { CommonModule as AppCommonModule } from '../../../common/common.module';
import { RouterModule } from '@angular/router';
import { TabsModule, ModalModule, PaginationModule, BsDatepickerModule, TimepickerModule } from 'ngx-bootstrap';
import { HotTourComponent } from './hot-tour/hot-tour.component';
import { CheapTourComponent } from './cheap-tour/cheap-tour.component';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { ClipboardModule } from 'ngx-clipboard';
import { CreateHotTourComponent } from './components/create-hot-tour/create-hot-tour.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlashDealTourComponent } from './flash-deal/flash-deal-tour.component';
import { CreateFlashDealTourComponent } from './components/create-flash-deal-tour/create-flash-deal-tour.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { RecommendTourComponent } from './recommend-tour/recommend-tour.component';
import { CreateRecommendTourComponent } from './components/create-recommend-tour/create-recommend-tour.component';

// routing
export const routes = [
    { path: "", component: ExtraTourComponent, pathMatch: "full" },
    { path: "create-hot-tour", component: CreateHotTourComponent },
    { path: "create-flash-deal", component: CreateFlashDealTourComponent },
    { path: "create-flash-deal/:id", component: CreateFlashDealTourComponent },
    { path: "create-recommend-tour", component: CreateRecommendTourComponent },
    { path: "create-recommend-tour/:id", component: CreateRecommendTourComponent }

];

@NgModule({
    declarations: [
        ExtraTourComponent,
        HotTourComponent,
        CheapTourComponent,
        FlashDealTourComponent,
        CreateFlashDealTourComponent,
        RecommendTourComponent,
        CreateRecommendTourComponent,
        CreateHotTourComponent
    ],
    imports: [
        CommonModule,
        ComponentsModule,
        AppCommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        TabsModule.forRoot(),
        NgxDnDModule,
        ClipboardModule,
        ModalModule.forRoot(),
        PaginationModule.forRoot(),
        FormsModule,
        CurrencyMaskModule,
        BsDatepickerModule.forRoot(),
        TimepickerModule.forRoot()

    ],
    exports: [],
    providers: [],
    bootstrap: [
        ExtraTourComponent
    ]
})
export class ExtraTourModule {
    static routes = routes;
}