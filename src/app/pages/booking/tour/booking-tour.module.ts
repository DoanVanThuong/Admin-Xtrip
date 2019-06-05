import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule, BsDatepickerModule } from 'ngx-bootstrap';
import { LayoutsModule } from '../../../layouts/layouts.module';
import { BookingTourComponent } from './booking-tour.component';
import { Routes, RouterModule } from '@angular/router';
import { BookingGeneralComponent } from './components/booking-general/booking-general.component';
import { CommonModule as AppCommonModule } from '../../../common/common.module';
import { ComponentsModule } from '../../../components/components.module';
import { BookingPassengerComponent } from './components/booking-passenger/booking-passenger.component';
import { PassengerInfoComponent } from './components/passenger-info/passenger-info.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';


const routes: Routes = [
    { path: '', component: BookingTourComponent, pathMatch: 'full' },
];

@NgModule({
    declarations: [
        BookingTourComponent,
        BookingGeneralComponent,
        BookingPassengerComponent,
        PassengerInfoComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TabsModule.forRoot(),
        LayoutsModule,
        RouterModule.forChild(routes),
        AppCommonModule,
        ComponentsModule,
        BsDatepickerModule.forRoot(),
        CurrencyMaskModule


    ],
    exports: [],
    providers: [],
    bootstrap: [BookingTourComponent]
})
export class BookingTourModule { 
    static routes = routes;
}