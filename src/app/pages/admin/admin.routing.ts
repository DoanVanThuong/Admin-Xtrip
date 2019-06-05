import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AdminComponent } from './admin.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
	{
		path: '',
		component: AdminComponent,
		children: [
			{
				path: 'customer', redirectTo: 'customer', pathMatch: 'full'
			},
			{
				path: 'payment', loadChildren: './transfer/transfer.module#TransferModule'
			},
			{
				path: 'customer', loadChildren: './customer/admin-customer.module#AdminCustomer'
			},
			{
				path: 'ticket', loadChildren: './ticket/admin-ticket.module#TicketModule'
			},
			{
				path: 'internal', loadChildren: './internal/internal.module#InternalModule'
			},
			{
				path: 'coupon', loadChildren: './coupon/coupon.module#CouponModule'
			},
			{
				path: 'reward-point', loadChildren: './reward-point/reward-point.module#RewardPointModule'
			},
			{
				path: 'construction' ,loadChildren: './construction/construction.module#ConstructionModule'
			}

		]
	},

];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
