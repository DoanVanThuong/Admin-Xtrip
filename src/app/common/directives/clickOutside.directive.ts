import { Directive, ElementRef, Output, HostListener, EventEmitter } from '@angular/core';

@Directive({
    selector: '[clickOutside]'
})

export class ClickOutSideDirective {
    @Output() clickOutside = new EventEmitter();

    @HostListener('document:click', ['$event.target']) onClick(target) {
        const clickedInside = this._elementRef.nativeElement.contains(target);
        if (!clickedInside) {
            this.clickOutside.emit(null);
        }
    }
    constructor(private _elementRef: ElementRef) { }
}
