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
  private _unsubscribeAll: Subject<any>;
  public page: { pageNumber: number; size: number };
  @BlockUI() blockUI: NgBlockUI;
  public rows: Category[];
  public ColumnMode = ColumnMode;
  public comingData: AllCategories;

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
  onTreeAction($event: any) {
    throw new Error("Method not implemented.");
  }

  ngOnInit(): void {
    this.getCustomersList();
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
        this.rows = res.data.data;
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
