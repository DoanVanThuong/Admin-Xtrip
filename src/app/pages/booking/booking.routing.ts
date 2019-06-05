import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { BookingComponent } from './booking.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
    {
        path: '',
        component: BookingComponent,
        children: [
            {
                path: 'tour', loadChildren: './tour/booking-tour.module#BookingTourModule'
            },
            // TODO: Booking hotel, flight, activity..
        ]
    },

];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
