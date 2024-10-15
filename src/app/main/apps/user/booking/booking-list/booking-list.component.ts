import { BookingListService } from "./booking-list.service";
import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CoreConfigService } from "@core/services/config.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ToastrService } from "ngx-toastr";
import {
  NgbDate,
  NgbDateParserFormatter,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";
import { Bookings, GetAllBooking } from "../../models/booking.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { trigger, transition, style, animate } from "@angular/animations";

@Component({
  selector: "app-booking-list",
  templateUrl: "./booking-list.component.html",
  styleUrls: ["./booking-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger("fadeIn", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("300ms", style({ opacity: 1 })),
      ]),
      transition(":leave", [animate("300ms", style({ opacity: 0 }))]),
    ]),
  ],
})
export class BookingListComponent implements OnInit {
  public hoveredDate: NgbDate | null = null;
  public fromDate: NgbDate | null;
  public toDate: NgbDate | null;
  public selectedTimeType: boolean = false;
  public rows: Bookings[];
  public row: Bookings = null;
  public ColumnMode = ColumnMode;
  public bookingDataForDelete: { id: number; name: string };
  public deleteLoader: boolean = false;
  public submitted = false;
  public comingData: GetAllBooking;
  public page: { pageNumber: number; size: number };
  public contentHeader: object;
  public bookingUpdate: FormGroup;
  public modalForm: any = null;
  public filter: {
    page?: number;
    limit?: number;
    status?: string;
    dateFilterOption?: string;
    startDate?: string;
    endDate?: string;
  } = {
    page: 1,
    limit: 5,
    status: ``,
    dateFilterOption: `THIS_YEAR`,
    startDate: ``,
    endDate: ``,
  };
  @BlockUI() blockUI: NgBlockUI;
  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;
  // Private
  private _unsubscribeAll: Subject<any>;
  constructor(
    private _coreConfigService: CoreConfigService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    public formatter: NgbDateParserFormatter,
    private bookingListService: BookingListService,
    private _formBuilder: FormBuilder
  ) {
    this.bookingUpdate = this._formBuilder.group({
      status: [``, [Validators.required]],
      cancellationReason: [``],
      rejectionReason: [``],
    });
    this._unsubscribeAll = new Subject();
    this.bookingListService
      .getCustomerUpdated()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.getBookingsList();
      });
    this.page = { pageNumber: 0, size: 5 };
  }
  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: "Bookings",
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Bookings List",
            isLink: false,
          },
        ],
      },
    };
    // Subscribe config change
    this._coreConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        //! If we have zoomIn route Transition then load datatable after 450ms(Transition will finish in 400ms)
        if (config.layout.animation === "zoomIn") {
          setTimeout(() => {
            console.log(this.rows, `before`);
            this.getBookingsList();
          }, 1);
        } else {
          this.getBookingsList();
        }
      });
    this.onStatusChange();
  }
  public onSelectChange(value): void {
    const perPage = value.target.value;
    this.page.size = perPage;
    this.filter.page = this.page.pageNumber + 1;
    this.filter.limit = this.page.size;
    this.getBookingsList();
  }
  public setPage(pageInfo): void {
    this.page.pageNumber = pageInfo.offset;
    this.filter.page = this.page.pageNumber + 1;
    this.filter.limit = this.page.size;
    this.getBookingsList();
  }

  public modalOpenWarning(modalWarning, id: number, name: string) {
    this.bookingDataForDelete = { id: id, name: name };
    this.modalService.open(modalWarning, {
      centered: true,
      windowClass: "modal modal-warning",
    });
  }

  ///////////////////// Delete Selected
  public onDelete(): void {
    this.deleteLoader = true;
    this.bookingListService
      .deleteBooking(this.bookingDataForDelete.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        this.modalService.dismissAll();
        this.deleteLoader = false;
        this.bookingDataForDelete = { id: 0, name: "" };
        this.getBookingsList({
          isAfterDelete: true,
          name: this.bookingDataForDelete.name,
        });
      });
  }
  getBookingsList(isFromDelete?: {
    isAfterDelete?: boolean;
    name?: string;
  }): void {
    this.blockUI.start();
    this.bookingListService
      .getAllBookings(this.filter)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (res) => {
          this.blockUI.stop();
          if (isFromDelete?.isAfterDelete) {
            this.toastr.success(
              `The Booking ${isFromDelete.name} has been deleted`,
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
        },
        (error) => {
          this.blockUI.stop();
        }
      );
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (
      this.fromDate &&
      !this.toDate &&
      date &&
      date.after(this.fromDate)
    ) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    if (this.fromDate && this.toDate) {
      console.log(
        this.formatter.format(this.fromDate),
        this.formatter.format(this.toDate)
      );
      this.filter.startDate = this.formatter.format(this.fromDate);
      this.filter.endDate = this.formatter.format(this.toDate);
      this.getBookingsList();
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }
  public onTimeSelect(value: string): void {
    this.filter.dateFilterOption = value;
    this.fromDate = null;
    this.toDate = null;
    if (this.filter.dateFilterOption == "CUSTOM") {
      this.selectedTimeType = true;
    } else {
      this.getBookingsList();
      this.selectedTimeType = false;
    }
  }
  public onStatusSelect(value): void {
    value ? (this.filter.status = value) : (this.filter.status = null);
    console.log(this.filter);
    this.getBookingsList();
  }
  get f() {
    return this.bookingUpdate.controls;
  }
  // private getBookingDetails(id:number):void {
  //   this.bookingListService.getBookingDetails(id)      .pipe(takeUntil(this._unsubscribeAll)).subscribe(
  //     (res) => {

  //     },(error) => {

  //     }
  //   )

  // }
  modalOpenForm(modalForm, id: number) {
    this.modalForm = modalForm;
    this.row = this.rows.find((item) => item.id === id);
    this.bookingUpdate.get(`status`).patchValue(this.row?.status);
    this.bookingUpdate
      .get(`cancellationReason`)
      .patchValue(this.row?.cancellationReason);
    this.bookingUpdate
      .get(`rejectionReason`)
      .patchValue(this.row?.rejectionReason);
    this.modalService.open(modalForm);
  }
  public onUpdateButton(): void {
    // this.bookingUpdate.disable();
    this.submitted = true;
    console.log(this.bookingUpdate.value);
    if (this.bookingUpdate.valid) {
      this.bookingListService
        .updateBooking(this.row.id, this.bookingUpdate.value)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          (res) => {
            // this.bookingUpdate.enable();
            this.getBookingsList();
            this.modalService.dismissAll();
          },
          (error) => {}
        );
    }
  }
  onStatusChange(): void {
    this.bookingUpdate.get("status")!.valueChanges.subscribe((status) => {
      const cancellationControl = this.bookingUpdate.get("cancellationReason");
      const rejectionControl = this.bookingUpdate.get("rejectionReason");

      if (status === "CANCELED") {
        cancellationControl!.setValidators([Validators.required]);
        rejectionControl!.clearValidators();
      } else if (status === "REJECTED") {
        rejectionControl!.setValidators([Validators.required]);
        cancellationControl!.clearValidators();
      } else {
        cancellationControl!.clearValidators();
        rejectionControl!.clearValidators();
      }

      cancellationControl!.updateValueAndValidity();
      rejectionControl!.updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
