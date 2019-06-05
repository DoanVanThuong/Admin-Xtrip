import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule, CollapseModule } from 'ngx-bootstrap';

import { CommonModule as AppCommonModule } from './../../common/common.module';
import { ComponentsModule as AppComponentsModule } from './../../components/components.module';

import { routing } from './blanks.routing';
import { Blanks } from './blanks.component';
import {
	Signin
} from './index';

@NgModule({
	imports: [
		AccordionModule,
		CollapseModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		AppCommonModule,
		AppComponentsModule,
		routing,
	],
	declarations: [
		Blanks,
		Signin
	]
})

export class BlanksModule {
}
