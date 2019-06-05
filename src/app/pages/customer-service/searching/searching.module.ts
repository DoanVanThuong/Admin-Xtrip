import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SearchTourComponent } from './tour/search-tour.component';

import { CommonModule as AppCommonModule } from "../../../common/common.module";
import { SearchingComponent } from './searching.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ComponentsModule } from '../../../components/components.module';
import { BsDatepickerModule, TabsModule, PaginationModule, ModalModule } from 'ngx-bootstrap';
import { TourDetailPopup } from './components/tour-detail/tour-detail.popup';

export const routes = [
    { path: "", component: SearchingComponent, pathMatch: "full" }
];
@NgModule({
    declarations: [
        SearchingComponent,
        SearchTourComponent,
        TourDetailPopup 
    ],
    imports: [ 
        CommonModule,
        AppCommonModule,
        ComponentsModule,
        RouterModule.forChild(routes),
        TabsModule.forRoot(),
        BsDatepickerModule.forRoot(),
        PaginationModule.forRoot(),
        ModalModule,
        ReactiveFormsModule,
        FormsModule,
        

    ],
    exports: [],
    bootstrap:[
        SearchingComponent,
    ],
    providers: [],
})
export class SearchingModule {
    static routes = routes;
}