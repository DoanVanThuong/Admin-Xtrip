import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AppBase } from '../../app.base';

@Component({
    selector: 'select-limit',
    templateUrl: './select-limit.component.html',
})
export class SelectLimitComponent extends AppBase {
    @Input() numbers: number[] = [];
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

    @Input() selectedNumber: number = 15;

    constructor() {
        super();
    }

    ngOnInit() {
    }

    onChangeNumber() {
        this.onChange.emit(this.selectedNumber);
    }
}
