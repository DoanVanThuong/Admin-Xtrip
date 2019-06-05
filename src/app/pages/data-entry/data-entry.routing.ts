import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { DataEntryComponent } from './data-entry.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
    {
        path: '', component: DataEntryComponent, children: [
            { path: 'tour', redirectTo: 'tour', pathMatch: 'full' },
            { path: 'tour', loadChildren: './tour/tour.module#DataEntryTourModule' },
            { path: 'extra-tour', loadChildren: './extra-tour/extra-tour.module#ExtraTourModule' },
            { path: 'extra-activity', loadChildren: './extra-activity/extra-activity.module#ExtraActivityModule' },

            // banner, cuopon, hot deal in here (TODO)
        ]
    },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
