import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutsModule } from '../../layouts/layouts.module';
import { routing } from './data-entry.routing';
import { DataEntryComponent } from './data-entry.component';

@NgModule({
    imports: [
        CommonModule,
        routing,
        LayoutsModule,
    ],
    declarations: [
        DataEntryComponent,
    ],
    bootstrap: [
        DataEntryComponent,
    ]
})

export class DataEntryModule {

}
