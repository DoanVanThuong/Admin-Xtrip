import { CAPP, CINPUT, CERROR_CODES, CLANG, BOOKING_STATUS } from './app.constants';
import {
  User,
  Error,
  HtmlHelper,
  UtilityHelper,
} from './common/index';
import { OnInit } from "@angular/core";
import { environment } from "../environments/environment";
import { Subject } from 'rxjs/Subject';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

export abstract class AppPage implements OnInit {
  STATUS: any = BOOKING_STATUS;
  ngUnsubscribe: Subject<any> = new Subject();

  isGoLive: boolean = environment.live;
  CAPP = CAPP;
  CINPUT = CINPUT;
  CERROR_CODES = CERROR_CODES;

  DATE_FORMAT = CAPP.DATE_FORMAT;
  TIME_FORMAT = CAPP.TIME_FORMAT;

  STORAGE_NAME_LANG = CLANG;

  htmlHelper: HtmlHelper = new HtmlHelper();
  utilityHelper: UtilityHelper = new UtilityHelper();

  scrollOptions: any = {
    wheelPropagation: true
  };

  currencyMask = {
    align: 'left',
    prefix: '',
    thousands: ',',
    decimal: ',',
    precision: 0
  };

  editorOptions: any = {

  };

  bsConfig = {
    rangeInputFormat: 'DD/MM/YYYY',
    dateInputFormat: 'DD/MM/YYYY',
    startingDay: 1,
    minDate: new Date(),
    // maxDate: new Date(),
    bsValue: new Date(),
    maxTime: new Date()
  }
  errors: Array<Error> = [];

  offset: number = 0;
  limit: number = 10;

  constructor() {

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.unsubscribe();
  }

  ngDoCheck(): void {
  }

  ngOnChanges(changes: any): void {
  }

  ngAfterContentInit(): void {
  }

  ngAfterContentChecked(): void {
  }

  ngAfterViewInit(): void {
  }

  ngAfterViewChecked(): void {
  }

  // fn save file download
  saveAs = (blob: Blob, filename: string) => {


    let anchorElem = document.createElement("a");

    if (window.navigator.msSaveBlob) {
      // TODO IE export
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {

      let url = window.URL.createObjectURL(blob);
      $(anchorElem).attr('href', url)
        .attr('download', filename)
        .css('display', 'none')
        .appendTo('body')
      [0].click();

      setTimeout(function () {
        document.body.removeChild(anchorElem);
        window.URL.revokeObjectURL(url);
      }, 500);
    }
  };

  // fn read file
  readFile = (target: any, file: any) => {

    if (!!target || !!file) {
      let reader = new FileReader();

      reader.onload = () => {
        var node = $(target);
        node.attr('src', reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      var node = $(target);
      node.attr('src', 'assets/images/cms/icon/camera.png');
    }

    return false;
  };

  print(printSectionId: string): void {
    let printContents, popupWin;
    printContents = document.getElementById(printSectionId).innerHTML;
    popupWin = window.open('', '_blank', `width = ${screen.availWidth}, height = ${screen.availHeight}`);
    popupWin.document.open;
    popupWin.document.write(`
      <html>
        <head>
          <title></title>
          <style>
            
          </style>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
          
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  // track by index
  trackByFn = (index: number, item: any): any => {
    return !!item.id ? item.id : (!!item.code ? item.code : index);
  };

  //fn catch error observable
  catchError(error: HttpErrorResponse): Observable<any> {
    return Observable.throw(error || 'Có lỗi xảy, Vui lòng kiểm tra lại !');
  }

  onClipboardSuccess(data: any) {

  }

  back() {
    window.history.back();
  }
}

export abstract class AppBase extends AppPage {
  auth: User;
}
