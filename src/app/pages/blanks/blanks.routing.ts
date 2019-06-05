import { Routes, RouterModule } from '@angular/router';

import { Blanks } from "./blanks.component";
import {
	Signin
} from "./index";
import { AuthLoggedIn } from '../../auth.loggedIn';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
	{
		path: '',
		component: Blanks,
		children: [
			{
				path: '',
				component: Signin
			},
			{
				path: 'sign-in',
				component: Signin
			},

		],

	},
];

export const routing = RouterModule.forChild(routes);
