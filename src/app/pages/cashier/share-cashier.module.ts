import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewReceiptComponent } from './components/preview-receipt/preview-receipt.component';
import { ModalModule } from 'ngx-bootstrap';
import { ComponentsModule } from '../../components/components.module';
import { CommonModule as AppCommonModule } from "../../common/common.module";
import { PreviewRefundComponent } from './components/preview-refund/preview-refund.component';

@NgModule({
    declarations: [
        PreviewReceiptComponent,
        PreviewRefundComponent
    ],
    imports: [ 
        CommonModule,
        ModalModule.forRoot(),
        ComponentsModule,
        AppCommonModule
    ],
    exports: [
        PreviewReceiptComponent,
        PreviewRefundComponent
    ],
    providers: [],
})
export class ShareCashierModule {}