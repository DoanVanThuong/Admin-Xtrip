import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { BookerComponent } from './booker.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
	{
		path: '',
		component: BookerComponent,
		children: [
			{
				path: 'customer', redirectTo: 'customer', pathMatch: 'full'
			},
			{
				path: 'customer', loadChildren: './customer/booker-customer.module#BookerCustomerModule'
			},
			{
				path: 'ticket', loadChildren: './ticket/booker-ticket.module#BookerTicketModule'
			},

		]
	},

];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
