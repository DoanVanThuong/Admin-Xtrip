import { Routes } from '@angular/router';
import { DataEntryTourComponent } from './tour.component';

import { CreateTourComponent } from './create-tour/create-tour.component';
import { UpdateTourComponent } from './update-tour/update-tour.component';
import { ConfirmDeactivateGuard } from '../../../common';

export const routing: Routes = [
    { path: "", component: DataEntryTourComponent, pathMatch: 'full', },
    { path: "create", component: CreateTourComponent, canDeactivate: [ConfirmDeactivateGuard] },
    { path: ":id/edit", component: UpdateTourComponent, },
    { path: ":id/clone", component: CreateTourComponent, }
    //TODO edit, delete, detail in here...
];

