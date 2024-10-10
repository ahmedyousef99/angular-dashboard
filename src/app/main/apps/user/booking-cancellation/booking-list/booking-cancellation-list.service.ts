import { HttpClient, HttpParams } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { environment } from "environments/environment";
import { BehaviorSubject, Observable, throwError } from "rxjs";

import { catchError, map } from "rxjs/operators";
import {
  AllAdmins,
  CreateAdminReq,
  CreateAdminRes,
} from "../../models/admins.model";
import { getBookingDetails } from "../../models/booking-details.model";
import { UpdateBookingRes, GetAllBooking } from "../../models/booking.model";
import {
  CancellationDetails,
  GetAllCancellationBookings,
} from "../../models/cancellation-bookings-model";

@Injectable()
export class BookingCancellationListService implements Resolve<any> {
  public rows: any;
  public onUserListChanged: BehaviorSubject<AllAdmins>;
  public searchData: any = {};

  private isCustomerUpdated: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onUserListChanged = new BehaviorSubject(null);
  }
  public setCustomerUpdated(value: boolean): void {
    this.isCustomerUpdated.emit(value);
  }
  public getCustomerUpdated(): EventEmitter<boolean> {
    return this.isCustomerUpdated;
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getAllBookingsCancellation(this.searchData)]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

  /**
   * Get rows
   */
  public updateBookingCancellation(
    id: number,
    data: {
      status: string;
    }
  ): Observable<UpdateBookingRes> {
    console.log(data, `from service`);
    return this._httpClient
      .patch<UpdateBookingRes>(
        `${environment.apiUrl}admin/booking-cancellation-order/${id}`,
        data
      )
      .pipe(
        catchError((error) => {
          console.error("Error updating Bookings:", error);
          return throwError(error);
        })
      );
  }

  public deleteBookingCancellation(id: number): Observable<any> {
    return this._httpClient.delete<any>(
      `${environment.apiUrl}admin/booking-cancellation-order/${id}`
    );
  }

  public getAllBookingsCancellation(searchData?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Observable<GetAllCancellationBookings> {
    this.searchData = {};
    for (const key in searchData) {
      if (
        searchData[key] !== null &&
        searchData[key] !== undefined &&
        searchData[key] !== ""
      ) {
        this.searchData[key] = searchData[key];
      }
    }
    console.log(this.searchData);

    return this._httpClient.get<GetAllCancellationBookings>(
      `${environment.apiUrl}admin/booking-cancellation-order`,
      {
        params: this.searchData,
      }
    );
  }

  public getBookingCancellationDetails(
    id: number
  ): Observable<CancellationDetails> {
    return this._httpClient.get<CancellationDetails>(
      `${environment.apiUrl}admin/booking-cancellation-order/${id}`
    );
  }
}
