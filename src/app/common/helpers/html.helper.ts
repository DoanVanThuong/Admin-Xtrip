import {ElementRef} from '@angular/core';

export class HtmlHelper {
  /**
   * Create Style Tag
   *
   * @param elementRef
   * @returns {HTMLStyleElement}
   */
  createStyle(elementRef: ElementRef): HTMLStyleElement {
    let style = document.createElement('style');
    style.type = 'text/css';

    jQuery(elementRef.nativeElement).prepend(style);

    return style;
  }

  /***
   * Add Style
   * @param style
   * @param cssString
   * @param isOnly
   * @returns {HTMLStyleElement}
   */
  appendChildStyle(style: HTMLStyleElement, cssString: string, isOnly: boolean): HTMLStyleElement {
    if (isOnly) {
      style.innerText = '';
    }
    style.appendChild(document.createTextNode(cssString));

    return style;
  }

  /***
   * Scroll to element
   *
   * @param elementName
   */
  doScroll(elementName: string): void {
    let elements = jQuery(elementName);
    if (elements.length > 0) {
      elements[0].scrollIntoView();
    }
  }

  /***
   * Get File Url
   *
   * @param file
   * @param cb
   */
  readURL(file: File, cb: Function): void {
    let reader = new FileReader();
    reader.onload = function (e: any) {
      cb(e.target.result);
    };
    reader.readAsDataURL(file);
  }
}
