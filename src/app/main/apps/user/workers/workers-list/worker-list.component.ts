import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";

import { Subject } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";

import { CoreConfigService } from "@core/services/config.service";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";

import { UserListService } from "app/main/apps/user/user-list/user-list.service";
import { Toast, ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CustomerList } from "../../models/customer.model";
import { WorkerListService } from "./worker-list.service";
import { AllAdmins } from "../../models/admins.model";

@Component({
  selector: "app-worker-list",
  templateUrl: "./worker-list.component.html",
  styleUrls: ["./worker-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class WorkerListComponent implements OnInit {
  // Public
  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 5;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousRoleFilter = "";
  public previousPlanFilter = "";
  public previousStatusFilter = "";
  public customerDataForDelete: { id: number; name: string };
  public deleteLoader: boolean = false;
  public comingData: AllAdmins;
  public search: FormGroup;
  public searchControl = new FormControl("");
  public counterPerPage = new FormControl("");

  public selectedStatus = [];
  public searchValue = "";
  public page: { pageNumber: number; size: number };
  @BlockUI() blockUI: NgBlockUI;

  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Private
  private tempData = [];
  private _unsubscribeAll: Subject<any>;
  searchInput: any;
  searchValues: any;
  loadSearch: boolean;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {UserListService} _workerListService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _workerListService: WorkerListService,
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder
  ) {
    this._unsubscribeAll = new Subject();
    this._workerListService
      .getCustomerUpdated()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.getWrokersList();
      });
    this.page = { pageNumber: 0, size: 5 };
  }

  ngOnInit(): void {
    this.search = this._formBuilder.group({
      search: [``],
    });
    this.searchControl.valueChanges.pipe(debounceTime(500)).subscribe((res) => {
      console.log(res, `seaaaarch`);
      this.searchValues = null;
      this.searchInput = res;

      if (res.length > 0) {
        this.rows = [];
        this.getWrokersList({}, { search: res });
      } else {
        this.getWrokersList();
      }
    });

    // Subscribe config change
    this._coreConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        //! If we have zoomIn route Transition then load datatable after 450ms(Transition will finish in 400ms)
        if (config.layout.animation === "zoomIn") {
          setTimeout(() => {
            console.log(this.rows, `before`);
            this.getWrokersList();
          }, 1);
        } else {
          this.getWrokersList();
        }
      });
  }
  public onSelectChange(value): void {
    const perPage = value.target.value;
    this.page.size = perPage;
    this.getWrokersList(
      {},
      { page: this.page.pageNumber + 1, limit: this.page.size }
    );
  }
  public setPage(pageInfo): void {
    this.page.pageNumber = pageInfo.offset;
    this.getWrokersList({}, { page: this.page.pageNumber + 1, limit: 5 });
    console.log(pageInfo.offset);
  }
  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * filterUpdate
   *
   * @param event
   */

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Filter By Roles
   *
   * @param event
   */
  filterByRole(event) {
    const filter = event ? event.value : "";
    this.previousRoleFilter = filter;
    this.temp = this.filterRows(
      filter,
      this.previousPlanFilter,
      this.previousStatusFilter
    );
    this.rows = this.temp;
  }

  /**
   * Filter By Plan
   *
   * @param event
   */
  // filterByPlan(event) {
  //   const filter = event ? event.value : "";
  //   this.previousPlanFilter = filter;
  //   this.temp = this.filterRows(
  //     this.previousRoleFilter,
  //     filter,
  //     this.previousStatusFilter
  //   );
  //   this.rows = this.temp;
  // }

  /**
   * Filter By Status
   *
   * @param event
   */
  // filterByStatus(event) {
  //   const filter = event ? event.value : "";
  //   this.previousStatusFilter = filter;
  //   this.temp = this.filterRows(
  //     this.previousRoleFilter,
  //     this.previousPlanFilter,
  //     filter
  //   );
  //   this.rows = this.temp;
  // }
  public modalOpenWarning(modalWarning, id: number, name: string) {
    this.customerDataForDelete = { id: id, name: name };
    this.modalService.open(modalWarning, {
      centered: true,
      windowClass: "modal modal-warning",
    });
  }

  ///////////////////// Delete Selected
  public onDelete(): void {
    this.deleteLoader = true;
    this._workerListService
      .deleteWorker(this.customerDataForDelete.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        this.modalService.dismissAll();
        this.deleteLoader = false;
        this.customerDataForDelete = { id: 0, name: "" };
        this.getWrokersList({
          isAfterDelete: true,
          name: this.customerDataForDelete.name,
        });
      });
  }

  /**
   * Filter Rows
   *
   * @param roleFilter
   * @param planFilter
   * @param statusFilter
   */
  filterRows(roleFilter, planFilter, statusFilter): any[] {
    // Reset search on select change
    this.searchValue = "";

    roleFilter = roleFilter.toLowerCase();
    planFilter = planFilter.toLowerCase();
    statusFilter = statusFilter.toLowerCase();

    return this.tempData.filter((row) => {
      const isPartialNameMatch =
        row.role.toLowerCase().indexOf(roleFilter) !== -1 || !roleFilter;
      const isPartialGenderMatch =
        row.currentPlan.toLowerCase().indexOf(planFilter) !== -1 || !planFilter;
      const isPartialStatusMatch =
        row.status.toLowerCase().indexOf(statusFilter) !== -1 || !statusFilter;
      return isPartialNameMatch && isPartialGenderMatch && isPartialStatusMatch;
    });
  }

  getWrokersList(
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
    this._workerListService
      .getAllWorkers(searchData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.blockUI.stop();
        if (isFromDelete?.isAfterDelete) {
          this.toastr.success(
            `The Worker ${isFromDelete.name} has been deleted`,
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
        this.tempData = this.rows;
      });
  }

  // ConfirmTextOpen() {

  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#7367F0",
  //     cancelButtonColor: "#E42728",
  //     confirmButtonText: "Yes, delete it!",
  //     customClass: {
  //       confirmButton: "btn btn-primary",
  //       cancelButton: "btn btn-danger ml-1",
  //     },
  //   }).then(function (result) {
  //     if (result.value) {
  //       console.log(`test111111111111111`);
  //       Swal.fire({
  //         icon: "success",
  //         title: "Deleted!",
  //         text: "Your file has been deleted.",
  //         customClass: {
  //           confirmButton: "btn btn-success",
  //         },
  //       });
  //     }
  //   });
  // }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
