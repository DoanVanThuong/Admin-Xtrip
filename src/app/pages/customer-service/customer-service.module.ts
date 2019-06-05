import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationModule } from "ngx-bootstrap";
import { FormsModule } from '@angular/forms';

import { LayoutsModule } from '../../layouts/layouts.module';

import { CustomerServiceComponent } from './customer-service.component';
import { routing } from './customer-service.routing';
import { SearchTourComponent } from './searching/tour/search-tour.component';

const Pages = [
    CustomerServiceComponent,
]
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        routing,
        LayoutsModule,
        PaginationModule.forRoot(),
    ],
    declarations: [
        ...Pages,
    ],
})

export class CustomerServiceModule {

}
