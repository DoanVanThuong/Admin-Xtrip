import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../../../components/components.module';
import { CommonModule as AppCommonModule } from '../../../common/common.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { PopularDayTourComponent } from './popular-daytour/popular-daytour.component';
import { ExtraActivityComponent } from './extra-activity.component';
import { PopularActivityComponent } from './popular-activities/popular-activities.component';
import { ClipboardModule } from 'ngx-clipboard';
import { TabsModule,PaginationModule } from 'ngx-bootstrap';
import { NgxDnDModule } from '@swimlane/ngx-dnd';

export const routes = [
    { path: "", component: ExtraActivityComponent, pathMatch: "full" }
];

@NgModule({
    declarations: [
        PopularDayTourComponent,
        ExtraActivityComponent,
        PopularActivityComponent
    ],
    imports: [ 
        CommonModule,
        ComponentsModule,
        AppCommonModule,
        TabsModule.forRoot(),
        RouterModule.forChild(routes),
        FormsModule,
        ClipboardModule,
        PaginationModule.forRoot(),
        NgxDnDModule,



     ],
    bootstrap:[
        ExtraActivityComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ],
})
export class ExtraActivityModule {
    static routes = routes;
}