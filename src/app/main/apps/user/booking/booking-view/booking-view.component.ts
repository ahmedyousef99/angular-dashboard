import { BookingListService } from "./../booking-list/booking-list.service";
import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { UserViewService } from "app/main/apps/user/user-view/user-view.service";
import { UserListService } from "../../user-list/user-list.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { getBookingDetailsData } from "../../models/booking-details.model";

@Component({
  selector: "app-booking-view",
  templateUrl: "./booking-view.component.html",
  styleUrls: ["./booking-view.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class BookingViewComponent implements OnInit, OnDestroy {
  // public
  public url = this.router.url;
  public lastValue;
  public data: getBookingDetailsData;
  @BlockUI() blockUI: NgBlockUI;

  // private
  private _unsubscribeAll: Subject<any>;
  productId: number;

  /**
   * Constructor
   *
   * @param {Router} router
   * @param {UserViewService} _userViewService
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bookingListService: BookingListService
  ) {
    this._unsubscribeAll = new Subject();
    this.lastValue = this.url.substr(this.url.lastIndexOf("/") + 1);
    console.log(this.lastValue);
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((params: Params) => {
        this.productId = +params[`id`];
        this.blockUI.start();
        this.bookingListService
          .getBookingDetails(this.productId)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(
            (res) => {
              console.log(res, `the res`);
              this.data = res.data;
              // this.avatarImage = this.currentRow.avatar;
              // this.customerForm.patchValue(this.currentRow);
              this.blockUI.stop();
              // console.log(this.customerForm.value, `the form`);
            },
            (error) => {
              this.blockUI.stop();
            }
          );
      });
    // this._userViewService.onUserViewChanged
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((response) => {
    //     this.data = response;
    //   });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    // this._unsubscribeAll.next();
    // this._unsubscribeAll.complete();
  }
}
