import { Component } from '@angular/core';
import { AppBase } from '../../../app.base';

@Component({
    selector: 'app-searching',
    templateUrl: './searching.component.html',
})
export class SearchingComponent extends AppBase{
    constructor() { 
        super();
    }

    ngOnInit(): void { 
    }
}
