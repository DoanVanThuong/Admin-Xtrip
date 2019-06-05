import { AppBase } from './app.base';
import * as moment from 'moment';
import { UtilityHelper } from './common/helpers';

export abstract class AppList extends AppBase {
  utility = new UtilityHelper();

  isLoading: boolean = false;
  pageSizeList: Array<number> = [5,10, 15, 25, 50];

  // Start pagination
  page: number = 1;
  offset: number = 0;  //Trang hien tai
  limit: number = this.pageSizeList[2];//số item một trang
  pageSize: number = this.pageSizeList[2];
  total: number = 0;
  maxSize: number = 10;
  sort: string = null;
  order: any = false;
  data: any = {};

  keyword: string = '';
  request: any = null;

  isAdmin: boolean = false;
  isCS: boolean = false;
  isBooker: boolean = false;
  isCashier: boolean = false;

  //--- Pagination function
  // fn set page number
  setPage(pageNo: number): void {
    this.page = pageNo;
  };

  // fn get page number
  getPage(): number {
    return this.page;
  };

  // fn page changed
  pageChanged(event: any): void {
    if (this.page !== event.page || this.pageSize !== event.itemsPerPage) {
      this.page = event.page;
      this.pageSize = event.itemsPerPage;

      this.request(this.sort, this.order);
    }
  };

  // --- Sort
  setSortBy(sort?: string, order?: boolean): void {
    this.sort = sort ? sort : 'code';
    this.order = order;

    //this.data.sort = this.sort;
    // this.data.order = this.order;
  }

  // sort by
  sortBy(sort: string): void {

    if (!!sort) {
      // this.setSortBy(sort, this.sort !== sort ? 'asc' : (this.order === 'desc' ? 'asc' : 'desc'));
      this.setSortBy(sort, this.sort !== sort ? true : !this.order);

      if (typeof (this.request) === 'function') {
        this.request(this.sort, this.order);
      }
    }
  }

  // add sort class
  sortClass(sort: string): string {
    if (!!sort) {
      let classes = 'sortable ';
      if (this.sort == sort) {
        classes += ('sort-' + (this.order ? 'asc' : 'desc') + ' ');
      }

      return classes;
    }
    return '';
  }

  // on search
  onSearch = () => {
    this.page = 1;
    this.request();
  }

  isExpiryDate(expiryDate: string): boolean {
    let now = moment();
    let expired = moment(expiryDate, 'YYYY-MM-DD HH:mm:ss');
    let diff = expired.diff(now, 'seconds');

    //not expiryDate yet
    if (diff > 0) {
      return false;
    }
    //expiryDate
    return true;

  }

  //on change limit
  onChangeLimitSize(number: number) {
    this.limit = number;
    this.request();
  }
}
