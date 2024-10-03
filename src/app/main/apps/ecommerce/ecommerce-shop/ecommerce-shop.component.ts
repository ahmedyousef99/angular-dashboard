import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";

import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";

import { EcommerceService } from "app/main/apps/ecommerce/ecommerce.service";
import { DataService } from "app/main/forms/form-elements/select/data.service";
import { Subject } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";
import { DataServiceRes, getAllServices } from "../models/services.model";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { FormControl, FormBuilder } from "@angular/forms";
@Component({
  selector: "app-ecommerce-shop",
  templateUrl: "./ecommerce-shop.component.html",
  styleUrls: ["./ecommerce-shop.component.scss"],
  encapsulation: ViewEncapsulation.None,
  host: { class: "ecommerce-application" },
})
export class EcommerceShopComponent implements OnInit, OnDestroy {
  // public
  public contentHeader: object;
  public shopSidebarToggle = false;
  public shopSidebarReset = false;
  public gridViewRef = false;
  public products: DataServiceRes[];
  public wishlist;
  public cartList;
  public page = 1;
  public pageSize = 9;
  public searchText = "";
  public serviceRes: getAllServices;
  private _unsubscribeAll: Subject<any>;
  @BlockUI() blockUI: NgBlockUI;
  public searchControl = new FormControl("");
  public searchValues: any;
  public searchInput: any;
  public filters: {
    rate?: number;
    priceTo?: number;
    priceFrom?: number;
    categoryId?: number;
    search?: string;
  } = {
    rate: 0,
    priceTo: 0,
    priceFrom: 0,
    categoryId: 0,
    search: "",
  };

  /**
   *
   * @param {CoreSidebarService} _coreSidebarService
   * @param {EcommerceService} _ecommerceService
   */
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _ecommerceService: EcommerceService,
    private _formBuilder: FormBuilder
  ) {
    this._unsubscribeAll = new Subject();
    this.searchControl.valueChanges.pipe(debounceTime(500)).subscribe((res) => {
      console.log(res, `seaaaarch`);
      this.searchValues = null;
      this.searchInput = res;

      if (res.length > 0) {
        console.log(res);
        this.filters.search = res;
        // this.rows = [];
        // this.getWrokersList({}, { search: res });
      } else {
        // this.getWrokersList();
      }
    });
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Update to List View
   */

  /**
   * Sort Product
   */
  sortProduct(sortParam) {
    this._ecommerceService.sortProduct(sortParam);
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to ProductList change
    this.blockUI.start();
    this._ecommerceService
      .getAllServices()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.blockUI.stop();
        this.serviceRes = res;
        this.products = res.data.data;
      });

    // Subscribe to Wishlist change
    this._ecommerceService.onWishlistChange.subscribe(
      (res) => (this.wishlist = res)
    );

    // Subscribe to Cartlist change
    this._ecommerceService.onCartListChange.subscribe(
      (res) => (this.cartList = res)
    );

    // update product is in Wishlist & is in CartList : Boolean

    // content header
    this.contentHeader = {
      headerTitle: "Shop",
      actionButton: true,
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Home",
            isLink: true,
            link: "/",
          },
          {
            name: "eCommerce",
            isLink: true,
            link: "/",
          },
          {
            name: "Shop",
            isLink: false,
          },
        ],
      },
    };
  }

  public getFilters(filter: {
    rate?: number;
    priceTo?: number;
    priceFrom?: number;
    categoryId?: number;
  }): void {
    console.log(filter);
    console.log(this.filters, 11111);
    this.filters = filter;
    this.filters.search = `23`;
    console.log(this.filters, 22222);
  }
  public pageChange(value: any): void {
    console.log(value);
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
