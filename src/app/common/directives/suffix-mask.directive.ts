import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[suffix-mask]'
})
export class SuffixMaskDirective {

  ele: any;
  @Input('suffix-mask') suffix: string;

  constructor(private el: ElementRef) {
    this.ele = this.el.nativeElement;
  }

  @HostListener('focus')
  onFocus() {
    if (this.suffix) {
      this.el.nativeElement.value = this.el.nativeElement.value.split(this.suffix)[0].trim();
    }
  }

  @HostListener('blur')
  onBlur() {
    if (this.suffix && this.ele.value) {
      this.el.nativeElement.value += (' ' + this.suffix);
    }

  }
}
