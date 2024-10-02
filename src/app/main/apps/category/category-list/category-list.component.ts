import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { CoreConfigService } from "@core/services/config.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { AdminListService } from "../../user/admin/admin-list/admin-list.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { Subject } from "rxjs";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { takeUntil } from "rxjs/operators";
import { CategoryService } from "../category.service";
import { AllCategories, Category } from "../models/category.model";

@Component({
  selector: "app-category-list",
  templateUrl: "./category-list.component.html",
  styleUrls: ["./category-list.component.scss"],
})
export class CategoryListComponent implements OnInit, OnDestroy {
  customerDataForDelete: { id: number; name: string };
  deleteLoader: boolean;
  setPage($event: any) {
    throw new Error("Method not implemented.");
  }
  private _unsubscribeAll: Subject<any>;
  public page: { pageNumber: number; size: number };
  @BlockUI() blockUI: NgBlockUI;
  public rows: Category[];
  public ColumnMode = ColumnMode;
  public comingData: AllCategories;
  public secondRows: Category[];

  constructor(
    private _categoryListService: CategoryService,
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.getCustomersList();
  }
  toggleSidebar(name: string, row?: Category): void {
    localStorage.removeItem("rowForSub");
    console.log(row, `for subcategory`);
    if (row) {
      console.log(`this is from sub Category`);

      localStorage.setItem("rowForSub", JSON.stringify(row));
      console.log(localStorage.getItem("rowForSub"));
    }
    this._categoryListService.setSideBarOpen(true);
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  public onSelectChange(value): void {
    const perPage = value.target.value;
    this.page.size = perPage;
    // this.getWrokersList(
    //   {},
    //   { page: this.page.pageNumber + 1, limit: this.page.size }
    // );
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
    this.blockUI.start();
    this._categoryListService
      .getAllCategories(searchData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        console.log(res);
        this.blockUI.stop();
        if (isFromDelete?.isAfterDelete) {
          this.toastr.success(
            `The customer ${isFromDelete.name} has been deleted`,
            "Success!",
            {
              toastClass: "toast ngx-toastr",
              closeButton: true,
            }
          );
        }
        console.log(res);
        this.comingData = res;
        this.rows = this.comingData.data.data;
        this.secondRows = this.comingData.data.data;
        console.log(this.rows);
      });
  }

  onTreeAction(event: any) {
    console.log(event);
    const index = event.rowIndex;
    const gotRow = event.row;
    this.rows = this.secondRows;
    if (gotRow.treeStatus === "collapsed") {
      console.log(this.rows);

      gotRow.treeStatus = "expanded";
      this.rows.map((row) => {
        if (row.id == gotRow.id) {
          return { ...row, treeStatus: "collapsed" };
        }
        return row;
      });
      console.log(this.rows);
      if (event.row.subCategoryList) {
        event.row.subCategoryList.forEach((item) => {
          // Assign treeStatus based on subCategoryList
          item.treeStatus = "disabled";
        });
      }
      this.rows = [...this.rows, ...event.row.subCategoryList];
      console.log(this.rows);
    } else {
      gotRow.treeStatus = "collapsed";
    }
  }

  flattenData(welcomeData: AllCategories): Category[] {
    const result: Category[] = [];
    welcomeData.data.data.forEach((datum) => {
      // Push the parent datum to the result array
      result.push(datum);

      // If there are subcategories, concatenate them to the result array
      if (datum.subCategoryList) {
        result.push(...datum.subCategoryList); // Concatenates the subcategories
      }
    });
    console.log(result);
    return result;
  }
  public modalOpenWarning(modalWarning, id: number, name: string) {
    this.customerDataForDelete = { id: id, name: name };
    this.modalService.open(modalWarning, {
      centered: true,
      windowClass: "modal modal-warning",
    });
  }
  public onDelete(): void {
    this.deleteLoader = true;
    this._categoryListService
      .deleteCategory(this.customerDataForDelete.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        this.modalService.dismissAll();
        this.deleteLoader = false;
        this.customerDataForDelete = { id: 0, name: "" };
        this.getCustomersList();
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
