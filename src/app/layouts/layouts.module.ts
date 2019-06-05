import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CommonModule as AppCommonModule } from './../common/common.module';
import { ComponentsModule as AppComponentsModule } from './../components/components.module';
import { LayoutComponent } from './layout.component';
import { Header, Footer, Sidebar, Navbar } from './index';

const PARTIAL_COMPONENTS = [
	Header,
	Footer,
	Sidebar,
	Navbar
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		AppCommonModule,
		AppComponentsModule
	],
	declarations: [
		...PARTIAL_COMPONENTS,
		LayoutComponent
	],
	providers: [],
	exports: [
		...PARTIAL_COMPONENTS,
	]
})

export class LayoutsModule {
}
