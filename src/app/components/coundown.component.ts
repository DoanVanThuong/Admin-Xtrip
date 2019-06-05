import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { AppBase } from '../app.base';
@Component({
	selector: 'countdown',
	template: `
    <span class="countdown">{{ result }}</span>
  `
})
export class CountdownComponent extends AppBase {
	@Input('time') time: any; // expired date
	@Input() showDay: boolean = false;
	@Output('submit') submit: EventEmitter<any> = new EventEmitter();

	result: string = null;
	timer: any = null;

	constructor() {
		super();
	}

	ngOnInit() {
		this.countdown();
	}

	ngOnDestroy() {
		clearInterval(this.timer);
	}

	ngAfterViewInit() {
		this.timer = setInterval(() => {
			this.countdown();
		}, 1000);
	}

	countdown() {
		if (!this.time) {
			this.result = '00:00:00';
			clearInterval(this.timer);
			return;
		}
		let now = moment();
		let expired = moment(this.time, 'DD/MM/YYYY HH:mm:ss');
		let diff = expired.diff(now, 'seconds');
		if (diff <= 0 || _.isNaN(expired)) {
			clearInterval(this.timer);
			this.onSubmit();
			this.result = '00:00:00';
			return;
		}
			this.result = this.utilityHelper.hourFormat(diff, this.showDay);
	}

	onSubmit() {
		this.submit.emit();
	}
}