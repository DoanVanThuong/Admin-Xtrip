import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutsModule } from '../../layouts/layouts.module';
import { routing } from './booking.routing';
import { BookingComponent } from './booking.component';

@NgModule({
    declarations: [
        BookingComponent
    ],
    imports: [ 
        CommonModule,
        routing,
        LayoutsModule,
     ],
    exports: [],
    providers: [],
    bootstrap: [
        BookingComponent
    ]
})
export class BookingModule {}