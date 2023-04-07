import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'underscore';
import { GeneralService } from '../../../../../../services/general.service';
import { HeaderService } from '../../../../../../services/header.service';
import { TreasuryService } from '../../services/treasury.service';
import { ModalExpenseDetailsComponent } from '../modal-expense-details/modal-expense-details.component';
@Component({
  selector: 'app-last-expense',
  templateUrl: './last-expense.component.html',
  styleUrls: ['./last-expense.component.scss'],
})
export class LastExpenseComponent implements OnInit {
  @Input() registerId: number;

  expenses!: any[];
  totalRecords!: number;
  totalPages!: number;
  items = [1, 2, 1, 2, 1, 2];

  searchText: string = '';
  status: string = '';
  sort: number = 1;
  pageNo: number = 0;
  pagin!: number;
  pages!: number[];
  statusList: any;

  @Output() sendtoLoadData = new EventEmitter();

  constructor(
    private treasuryService: TreasuryService,
    public generalService: GeneralService,
    public headerService: HeaderService,
    private modalService: NgbModal,
    private router: Router,
    config: NgbModalConfig
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    console.log(this.registerId);

    if (this.registerId) {
      console.log(this.registerId);

      this.GetMainData();
    }
  }
  Viewdetails(item) {
    this.router.navigateByUrl('/petty-cash/request-details/1');
    this.headerService.setTitle(
      'Petty Cash > Petty Cash Request > View Details'
    );
  }
  viewExpense() {
    this.headerService.setTitle('petty-cash > View role');
  }

  GetMainData() {
    return this.treasuryService
      .GetPettyCashExpenses(
        this.searchText,
        this.sort,
        this.status,
        this.pageNo,
        this.registerId
      )
      .subscribe((response: any) => {
        if (response) {
          this.expenses = response.data;

          this.totalRecords = response.info.totalRecordsCount;
          this.pagin = Math.ceil(this.totalRecords / 6);
          this.pages = _.range(this.pagin);
          console.log(this.pagin);
          console.log(this.pages);
          // this.pager.EventsCount = this.totalRecords;
          // this.pager.setPage(this.pager.GlobalPageIndex, false);
          // console.log(this.pager.EventsCount);
          // console.log(this.pager.GlobalPageIndex);
          console.log(this.expenses);
        }
      });
  }
  searchTable(event: any) {
    console.log(event?.target.value);
    const text = event.target.value;
    console.log(text.length);
    if (text.length >= 2) {
      this.searchText = text;
      this.pageNo = 0;
      this.GetMainData();
    }
    if (text.length == 0) {
      this.GetMainData();
    }
  }
  removeSearch() {
    this.searchText = '';
    this.sort = 1;
    this.GetMainData();
  }

  sortByInvoice() {
    if (this.sort == 3) {
      this.sort = 1;
    } else {
      this.sort = this.sort == 2 ? 3 : 2;
    }
    this.GetMainData();
  }
  sortByCategory() {
    if (this.sort == 5) {
      this.sort = 1;
    } else {
      this.sort = this.sort == 4 ? 5 : 4;
    }
    this.GetMainData();
  }

  sortByIDate() {
    if (this.sort == 7) {
      this.sort = 1;
    } else {
      this.sort = this.sort == 6 ? 7 : 6;
    }
    this.GetMainData();
  }
  sortByEmployee() {
    if (this.sort == 9) {
      this.sort = 1;
    } else {
      this.sort = this.sort == 8 ? 9 : 8;
    }
    this.GetMainData();
  }

  sortByTotalAmount() {
    if (this.sort == 11) {
      this.sort = 1;
    } else {
      this.sort = this.sort == 10 ? 11 : 10;
    }
    this.GetMainData();
  }

  // sortByAmount() {
  //   if (this.sort == 11) {
  //     this.sort = 1;
  //   } else {
  //     this.sort = this.sort == 10 ? 11 : 10;
  //   }
  //   this.GetMainData();
  // }
  sortByStatus() {
    if (this.sort == 13) {
      this.sort = 1;
    } else {
      this.sort = this.sort == 12 ? 13 : 12;
    }
    this.GetMainData();
  }

  setPage(page: number) {
    this.pageNo = page;
    this.GetMainData();
    window.scroll(0, 0);
  }

  filterByStatus(event) {
    console.log(event);
    this.pageNo = 0;
    this.status = event.id;
    this.GetMainData();
  }
  clearStatus(event) {
    console.log(event);
    this.status = '';
    this.GetMainData();
  }

  openModalExpense(item) {
    const modalRef = this.modalService.open(ModalExpenseDetailsComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.expenseDetails = item;
    modalRef.componentInstance.sendtoLoadData.subscribe((result: any) => {
      console.log('result', result);
      this.modalService.dismissAll();
      this.GetMainData();
    });
  }
}
