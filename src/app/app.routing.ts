import { Routes, RouterModule } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { Signin } from "./pages/blanks";

export const routes: Routes = [
	{ path: '**', redirectTo: 'sign-in' },

];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: false });
