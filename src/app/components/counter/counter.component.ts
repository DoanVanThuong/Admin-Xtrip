import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <div class="counter">
      <a class="pointer" (click)="count(-1)" [attr.disabled]="value === min ? 'disabled':''">
        <img alt="minus"[src]="iconMinus"/>
      </a>
      <span class="counter-value">{{ value }}</span>
      <a class="pointer" (click)="count(1)" [attr.disabled]="value === max ? 'disabled':''">
        <img alt="plus" [src]="iconAdd"/>
      </a>
    </div>
  `,
  styleUrls: [
    './counter.component.less'
  ]
})
export class CounterComponent {

  @Input('value') value: number = 0;
  @Input('min') min: number = null;
  @Input('max') max: number = null;
  @Input() iconAdd: string = 'assets/images/icon/icon-plus-circle.svg';
  @Input() iconMinus: string = 'assets/images/icon/icon-minus-circle.svg';
  @Output('change') change: EventEmitter<number> = new EventEmitter<number>();

  constructor() {

  }

  ngOnInit() {

  }

  ngOnChanges() {

    if (typeof this.value === 'string') {
      this.value = Number(this.value) || 0;
    }

    if (!!this.min && this.value < this.min) {
      this.value = this.min;
      this.onChange();
    } else if (!!this.max && this.value > this.max) {
      this.value = this.max;
      this.onChange();
    }
  }

  // fn count
  count(offset: number = 1) {
    this.value += offset;

    if (this.value < this.min || this.value > this.max) {
      this.value -= offset;
    }

    this.onChange();
  }

  onChange() {
    this.change.emit(this.value);
  }
}