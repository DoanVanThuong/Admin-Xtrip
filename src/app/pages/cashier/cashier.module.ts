import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutsModule } from '../../layouts/layouts.module';
import { routing } from './cashier.routing';
import { CashierComponent } from './cashier.component';
@NgModule({
    imports: [
        CommonModule,
        routing,
        LayoutsModule,
    ],
    declarations: [
        CashierComponent,
    ],
    bootstrap: [CashierComponent],
})

export class CashierModule {
}
