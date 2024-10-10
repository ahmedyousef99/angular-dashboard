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
import { GetAllBooking, UpdateBookingRes } from "../../models/booking.model";
import { getBookingDetails } from "../../models/booking-details.model";

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
      cancellationReason?: string;
      rejectionReason?: string;
    }
  ): Observable<UpdateBookingRes> {
    console.log(data, `from service`);
    return this._httpClient
      .patch<UpdateBookingRes>(`${environment.apiUrl}admin/booking/${id}`, data)
      .pipe(
        catchError((error) => {
          console.error("Error updating Bookings:", error);
          return throwError(error);
        })
      );
  }

  public deleteBookingCancellation(id: number): Observable<any> {
    return this._httpClient.delete<any>(
      `${environment.apiUrl}admin/booking/${id}`
    );
  }

  public getAllBookingsCancellation(searchData?: {
    page?: number;
    limit?: number;
    status?: string;
    dateFilterOption?: string;
    startDate?: string;
    endDate?: string;
  }): Observable<GetAllBooking> {
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

    return this._httpClient.get<GetAllBooking>(
      `${environment.apiUrl}admin/booking`,
      {
        params: this.searchData,
      }
    );
  }

  public getBookingCancellationDetails(
    id: number
  ): Observable<getBookingDetails> {
    return this._httpClient.get<getBookingDetails>(
      `${environment.apiUrl}admin/booking/${id}`
    );
  }
}
