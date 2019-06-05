import {Injectable} from '@angular/core';

@Injectable()
export class Spinner {

  protected _selector: string = 'spinner';
  protected _element: HTMLElement;

  queues: Array<string> = [];

  constructor() {
    this._element = document.getElementById(this._selector);
  }

  // fn find item in queue
  public find(data: any) {
    return this.queues.indexOf(data);
  }

  // fn push new item in queue
  public push(data): Spinner {
    this.queues.push(data);

    return this;
  }

  // fn destroy item in queue
  public splice(index: number = 0, length: number = 1): Spinner {
    this.queues.splice(index, 1);

    return this;
  }

  // fn show spinner
  public show(opacity: string = '0.6'): void {
    this._element.style['opacity'] = opacity;
    this._element.style['display'] = 'block';
  }

  // fn hide spinner
  public hide(delay: number = 0): void {
    this._element.style['opacity'] = '0.8';
    setTimeout(() => {
      this._element.style['display'] = 'none';
    }, delay);
  }
}
