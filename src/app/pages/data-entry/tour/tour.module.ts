import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CommonModule as AppCommonModule } from '../../../common/common.module';

// component
import { DataEntryTourComponent } from "./tour.component";
import { ComponentsModule } from "../../../components/components.module";
import { CreateTourComponent } from "./create-tour/create-tour.component";
import { UpdateTourComponent } from "./update-tour/update-tour.component";

import { TourGeneralComponent } from "./tour-components/genenal/general.component";
import { TourStartTingDateComponent } from "./tour-components/starting-date/starting-date.component";
import { TourUploadImageComponent } from "./tour-components/images/upload.component";
import { TourPolicyComponent } from "./tour-components/policy/policy.component";
import { TourTripComponent } from "./tour-components/trip/trip.component";

// lib
import { TabsModule, BsDatepickerModule, ModalModule } from 'ngx-bootstrap';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { routing } from "./tour.routing";
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { PaginationModule } from "ngx-bootstrap";
import { ConfirmDeactivateGuard } from "../../../common";
import { ClipboardModule } from "ngx-clipboard";
import { NbChoicesModule } from "nb-choices";
import { TourHashTagComponent } from "./tour-components/hash-tag/hash-tag.component";
import { NouisliderModule } from 'ng2-nouislider';
import { HttpClientModule } from "@angular/common/http";



const TOUR = [
    DataEntryTourComponent,
    CreateTourComponent,
    UpdateTourComponent,

    // child component
    TourGeneralComponent,
    TourStartTingDateComponent,
    TourUploadImageComponent,
    TourPolicyComponent,
    TourTripComponent,
    TourHashTagComponent
]

const LibModule = [
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    ModalModule.forRoot(),
    TimepickerModule.forRoot(),
    PaginationModule.forRoot(),
    NgxDnDModule,
    ClipboardModule,
    NbChoicesModule,
    NouisliderModule


]
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ComponentsModule,
        RouterModule.forChild(routing),
        AppCommonModule,
        ...LibModule,
        CurrencyMaskModule,
        HttpClientModule
    ],
    bootstrap: [DataEntryTourComponent],

    declarations: [
        ...TOUR,

    ],
    providers: [ConfirmDeactivateGuard],
})
export class DataEntryTourModule {
    static routes = routing;
}
