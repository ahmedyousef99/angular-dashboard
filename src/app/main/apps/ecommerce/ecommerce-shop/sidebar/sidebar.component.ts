import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { CategoryService } from "app/main/apps/category/category.service";
import { Category } from "app/main/apps/category/models/category.model";
import { Subject } from "rxjs";
import { debounceTime, switchMap, takeUntil } from "rxjs/operators";

@Component({
  selector: "ecommerce-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["../ecommerce-shop.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class EcommerceSidebarComponent implements OnInit, OnDestroy {
  public categoryList: Category[] = [];
  private _unsubscribeAll: Subject<void> = new Subject();
  private sliderValueChange: Subject<number[]> = new Subject<number[]>();

  filtersObj = {
    rate: 0,
    priceTo: 0,
    priceFrom: 0,
    categoryId: 0,
    subCategoryId: 0,
  };

  public rate = 0;
  public someValue = [1, 100];

  @Output() public filters: EventEmitter<typeof this.filtersObj> =
    new EventEmitter();

  constructor(private categoryService: CategoryService) {
    this.sliderValueChange
      .pipe(
        debounceTime(1000),
        switchMap((value) => {
          this.updatePriceFilters(value);
          return [];
        }),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  public onChange(value: number[]): void {
    this.sliderValueChange.next(value);
  }

  private loadCategories(): void {
    this.categoryService
      .getAllCategories()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.categoryList = res.data.data;
      });
  }

  public onRateChange(rate: number): void {
    this.filtersObj.rate = rate;
    this.emitFilters();
  }

  public updateCategoryId(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.filtersObj.categoryId = value === "all" ? 0 : Number(value);
    this.filtersObj.subCategoryId = 0;
    this.emitFilters();
  }

  public updateSubCategoryId(event: Event): void {
    const sub: number = Number((event.target as HTMLSelectElement).value);
    this.filtersObj.categoryId = sub;
    this.filtersObj.subCategoryId = sub;
    this.emitFilters();
  }

  public clearFilters(): void {
    this.filtersObj = {
      rate: 0,
      priceTo: 0,
      priceFrom: 0,
      categoryId: 0,
      subCategoryId: 0,
    };
    this.someValue = [1, 100];
    this.emitFilters();
  }

  private emitFilters(): void {
    this.filters.emit(this.filtersObj);
  }

  private updatePriceFilters(value: number[]): void {
    this.filtersObj.priceFrom = value[0];
    this.filtersObj.priceTo = value[1];
    this.emitFilters();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
