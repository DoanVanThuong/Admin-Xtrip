import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceiptComponent } from './receipt.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BsDatepickerModule, PaginationModule, BsModalService, ModalModule } from 'ngx-bootstrap';
import { CommonModule as AppCommonModule } from "../../../common/common.module";
import { ComponentsModule } from '../../../components/components.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CreateReceiptComponent } from './create-receipt/create-receipt.component';
import { ShareCashierModule } from '../share-cashier.module';

const routes: Routes = [
    { path: '', component: ReceiptComponent, pathMatch: 'full' },
    { path: "create", component: CreateReceiptComponent },
    { path: "detail/:id", component: CreateReceiptComponent }
];

@NgModule({
    imports: [
        CommonModule,
        ComponentsModule,
        AppCommonModule,
        RouterModule.forChild(routes),
        PaginationModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        FormsModule,
        BsDatepickerModule.forRoot(),
        CurrencyMaskModule,
        ShareCashierModule
    ],
    declarations: [
        ReceiptComponent,
        CreateReceiptComponent
    ],
    bootstrap: [ReceiptComponent],
})
export class ReceiptModule {
    static routes = routes;
}