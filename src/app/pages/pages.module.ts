import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routing } from './pages.routing';
import { Pages } from './pages.component';
import { BlanksModule } from './blanks/blanks.module';


@NgModule({
	imports: [
		CommonModule,
		routing,
		BlanksModule,

	],
	declarations: [
		Pages,
	],
})

export class PagesModule {

}
