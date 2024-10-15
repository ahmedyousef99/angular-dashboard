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
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { trigger, transition, style, animate } from "@angular/animations";
import { BookingCancellationListService } from "./booking-cancellation-list.service";
import {
  cancellationDetails,
  GetAllCancellationBookings,
} from "../../models/cancellation-bookings-model";

@Component({
  selector: "app-booking-cancellation-list",
  templateUrl: "./booking-cancellation-list.component.html",
  styleUrls: ["./booking-cancellation-list.component.scss"],
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
export class BookingCancellationListComponent implements OnInit {
  public hoveredDate: NgbDate | null = null;
  public fromDate: NgbDate | null;
  public toDate: NgbDate | null;
  public selectedTimeType: boolean = false;
  public rows: cancellationDetails[];
  public row: cancellationDetails = null;
  public ColumnMode = ColumnMode;
  public bookingDataForDelete: { id: number; name: string };
  public deleteLoader: boolean = false;
  public submitted = false;
  public comingData: GetAllCancellationBookings;
  public page: { pageNumber: number; size: number };
  public contentHeader: object;
  public statusControl = new FormControl("");
  public modalForm: any = null;
  public filter: {
    page?: number;
    limit?: number;
    status?: string;
  } = {
    page: 1,
    limit: 5,
    status: ``,
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
    private bookingCancellationListService: BookingCancellationListService
  ) {
    this._unsubscribeAll = new Subject();
    this.bookingCancellationListService
      .getCustomerUpdated()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.getBookingsList();
      });
    this.page = { pageNumber: 0, size: 5 };
  }
  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: "Bookings Cancellation ",
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Bookings Cancellation List",
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
    this.bookingCancellationListService
      .deleteBookingCancellation(this.bookingDataForDelete.id)
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
    this.rows = [];
    this.blockUI.start();
    this.bookingCancellationListService
      .getAllBookingsCancellation(this.filter)
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

  public onStatusSelect(value): void {
    value ? (this.filter.status = value) : (this.filter.status = null);
    console.log(this.filter);
    this.getBookingsList();
  }

  modalOpenForm(modalForm, id: number) {
    this.modalForm = modalForm;
    this.row = this.rows.find((item) => item.id === id);
    this.statusControl.patchValue(this.row?.status);
    this.modalService.open(modalForm);
  }
  public onUpdateButton(): void {
    this.submitted = true;
    if (this.statusControl.valid) {
      this.blockUI.start();
      this.bookingCancellationListService
        .updateBookingCancellation(this.row.id, {
          status: this.statusControl.value,
        })
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          (res) => {
            this.getBookingsList();
            this.modalService.dismissAll();
            this.blockUI.stop();
          },
          (error) => {
            this.blockUI.stop();
          }
        );
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
