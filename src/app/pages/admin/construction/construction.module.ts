import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../../../components/components.module';
import { CommonModule as AppCommonModule } from "../../../common/common.module";
import { RouterModule } from '@angular/router';
import { ConstructionComponent } from './construction.component';
import { CreateConstructionComponent } from './create-construction/create-construction.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';

export const routes = [
    { path: "", component: ConstructionComponent, pathMatch: "full" },
    { path: "create", component: CreateConstructionComponent},
    { path: "detail/:id", component: CreateConstructionComponent }

];
@NgModule({
    declarations: [
        ConstructionComponent,
        CreateConstructionComponent
    ],
    imports: [ 
        CommonModule,
        ComponentsModule,
        AppCommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        PaginationModule.forRoot()

     ],
    bootstrap: [ConstructionComponent],
    exports: [],
    providers: [],
})
export class ConstructionModule {
    static routes = routes;
    
}