import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";

import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";

import { EcommerceService } from "app/main/apps/ecommerce/ecommerce.service";
import { DataService } from "app/main/forms/form-elements/select/data.service";
import { Subject } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";
import { DataServiceRes, getAllServices } from "../models/services.model";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { FormControl, FormBuilder } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
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
    subCategoryId: number;
    search?: string;
  } = {
    rate: 0,
    priceTo: 0,
    priceFrom: 0,
    categoryId: 0,
    subCategoryId: 0,
    search: "",
  };
  deleteLoader: boolean;
  customerDataForDelete: number;

  /**
   *
   * @param {CoreSidebarService} _coreSidebarService
   * @param {EcommerceService} _ecommerceService
   */
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _ecommerceService: EcommerceService,
    private modalService: NgbModal
  ) {
    this._unsubscribeAll = new Subject();
    this.searchControl.valueChanges.pipe(debounceTime(500)).subscribe((res) => {
      console.log(res, `seaaaarch`);
      this.searchValues = null;
      this.searchInput = res;

      if (res.length > 0) {
        console.log(res);
        this.filters.search = ``;
        this.filters.search = res;
        this.getAllServices(this.filters);
      } else {
        this.filters.search = ``;
        this.getAllServices(this.filters);
      }
    });
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  private getAllServices(filters: {
    rate?: number;
    priceTo?: number;
    priceFrom?: number;
    categoryId?: number;
    search?: string;
  }): void {
    this.blockUI.start();
    this._ecommerceService
      .getAllServices(this.filters)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.blockUI.stop();
        this.serviceRes = res;
        this.products = [];
        this.products = res.data.data;
      });
  }
  ngOnInit(): void {
    this.blockUI.start();
    this.getAllServices(this.filters);

    // content header
    this.contentHeader = {
      headerTitle: "Services",
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Services List",
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
    subCategoryId: number;
  }): void {
    this.filters = filter;
    this.getAllServices(filter);
  }
  public pageChange(value: any): void {
    console.log(value);
  }
  public modalOpenWarning(id: number, modalWarning) {
    this.customerDataForDelete = id;
    console.log(id);
    this.modalService.open(modalWarning, {
      centered: true,
      windowClass: "modal modal-warning",
    });
  }

  public onDelete(): void {
    this.deleteLoader = !this.deleteLoader;
    // this.
    // _ecommerceService.deleteService(this.customerDataForDelete)
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((response) => {
    //     this.modalService.dismissAll();
    //     this.deleteLoader = false;
    //     this.customerDataForDelete = 0;
    //     this.getAllSErvices()

    //   });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
