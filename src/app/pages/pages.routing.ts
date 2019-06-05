import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { Pages } from './pages.component';
import { AuthAdmin } from '../auth-admin';
import { AuthBooker } from '../auth-booker';
import { AuthDentry } from '../auth-dentry';
import { AuthCS } from '../auth-cs';
import { AuthCashier } from '../auth-cashier';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
	{
		path: '',
		component: Pages,
		children: [
			{
				path: '',
				loadChildren: './blanks/blanks.module#BlanksModule'
			},

			{
				path: 'admin',
				loadChildren: './admin/admin.module#AdminModule',
				resolve: {
					checkAuth: AuthAdmin
				},
			},
			{
				path: 'booker',
				loadChildren: './booker/booker.module#BookerModule',
				resolve: {
					checkAuth: AuthBooker
				}
			},
			{
				path: 'data-entry',
				loadChildren: './data-entry/data-entry.module#DataEntryModule',
				resolve: {
					checkAuth: AuthDentry
				}
			},
			{
				path: 'cs',
				loadChildren: './customer-service/customer-service.module#CustomerServiceModule',
				resolve: {
					checkAuth: AuthCS
				}
			},
			{
				path: 'booking',
				loadChildren: './booking/booking.module#BookingModule',
				resolve: {
					checkAuth: AuthCS
				}
			},
			{
				path: 'cashier',
				loadChildren: './cashier/cashier.module#CashierModule',
				resolve: {
					checkAuth: AuthCashier
				}
			},

		],
		runGuardsAndResolvers: 'always',
	},
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
