import { InternalAccountListComponent } from './acount-list/account-list.component';
import { AddAccountComponent } from './add-account/add-acount.component';
import { Routes } from '@angular/router';
import { EditAccountComponent } from './edit-account/edit-account.component';

export const routing: Routes = [
    { path: "", component: InternalAccountListComponent, pathMatch: "full" },
    { path: "create", component: AddAccountComponent },
    { path: "edit/:id", component: EditAccountComponent },

];

