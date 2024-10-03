import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { ITreeOptions } from "@circlon/angular-tree-component";
import { CategoryService } from "app/main/apps/category/category.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Category } from "../../models/services.model";

@Component({
  selector: "ecommerce-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["../ecommerce-shop.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class EcommerceSidebarComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any>;
  filtersObj: {
    rate?: number;
    priceTo?: number;
    priceFrom?: number;
    categoryId?: number;
  } = {
    rate: 0,
    priceTo: 0,
    priceFrom: 0,
    categoryId: 0,
  };
  public rate: number = 0;
  // Public
  public someValue = [1, 100];
  // @Output() public sliderPriceValue: EventEmitter<any> =
  //   new EventEmitter<any>();
  @Output() public filters: EventEmitter<{
    rate?: number;
    priceTo?: number;
    priceFrom?: number;
    categoryId?: number;
  }> = new EventEmitter<any>();
  rows: Category[];
  constructor(public _categoryListService: CategoryService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {}
  public onChange(value): void {
    this.filtersObj.priceFrom = value[0];
    this.filtersObj.priceTo = value[1];

    // this.sliderPriceValue.emit(value);
    this.filters.emit(this.filtersObj);
  }

  getCustomersList(
    isFromDelete?: {
      isAfterDelete?: boolean;
      name?: string;
    },
    searchData?: {
      page?: number;
      limit?: number;
      search?: string;
    }
  ): void {
    this._categoryListService
      .getAllCategories(searchData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.rows = res.data.data;
      });
  }
  public onRateChange(value: any) {
    this.filtersObj.rate = value;
    this.filters.emit(this.filtersObj);
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
