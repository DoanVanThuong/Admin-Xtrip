import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AppBase } from '../../app.base';

@Component({
    selector: 'search-auto-complete',
    styleUrls: ['./search-autoComplete.less'],
    templateUrl: './search-autoComplete.component.html'
})

export class SearchAutoCompleteComponent extends AppBase {

    @Input() source: any[] = [];
    @Input() show: boolean = false;
    @Input() isSelected: boolean = false;

    @Output() select: EventEmitter<any> = new EventEmitter<any>();

    constructor() { super(); }

    ngOnInit() { }

    onHideSearch() {
        this.source = [];
        this.show = false;
    }

    selectItem(item: any) {
        this.select.emit(item);
        this.isSelected = true;
    }


}