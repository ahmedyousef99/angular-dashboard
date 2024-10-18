import { CreateCustomerReq } from "./../models/customer.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { environment } from "environments/environment";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import {
  CreateCustomer,
  CustomerList,
  Customers,
} from "../models/customer.model";
import { catchError, map } from "rxjs/operators";

@Injectable()
export class UserListService implements Resolve<any> {
  public rows: any;
  public onUserListChanged: BehaviorSubject<CustomerList>;
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
      Promise.all([this.getDataTableRows(this.searchData)]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get rows
   */
  public updateCustomer(
    id: number,
    data: CreateCustomerReq
  ): Observable<CreateCustomer> {
    // Create FormData object to hold the filtered data
    const formData = new FormData();

    // Append only properties with valid values to FormData
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value);
      }
    });

    console.log(formData, `filtered data from service`);

    // Send PATCH request with FormData
    return this._httpClient
      .patch<CreateCustomer>(
        `${environment.apiUrl}admin/customer/${id}`,
        formData
      )
      .pipe(
        catchError((error) => {
          console.error("Error updating customer:", error);
          return throwError(error);
        })
      );
  }

  public deleteCustomer(id: number): Observable<CreateCustomer> {
    return this._httpClient.delete<CreateCustomer>(
      `${environment.apiUrl}admin/customer/${id}`
    );
  }
  createCustomer(customer: CreateCustomerReq): Observable<CreateCustomer> {
    // Create FormData object to hold the filtered customer data
    const formData = new FormData();

    // Append only properties with valid values to FormData
    Object.keys(customer).forEach((key) => {
      const value = customer[key];
      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value);
      }
    });

    console.log(customer, 3331); // For debugging

    // Send POST request with FormData
    return this._httpClient
      .post<CreateCustomer>(`${environment.apiUrl}admin/customer`, formData)
      .pipe(
        map((res) => {
          console.log(res, `111231`);
          this.getDataTableRows(); // Refresh data after creation
          return res;
        })
      );
  }

  getDataTableRows(searchData?: {
    page?: number;
    limit?: number;
    search?: string | number;
  }): Observable<CustomerList> {
    this.searchData = searchData;
    return this._httpClient.get<CustomerList>(
      `${environment.apiUrl}admin/customer`,
      { params: searchData }
    );
    // return new Promise((resolve, reject) => {
    //   this._httpClient
    //     .get(`${environment.apiUrl}admin/customer`, { params: searchData })
    //     .subscribe((response: CustomerList) => {
    //       this.rows = response.data.data;
    //       this.onUserListChanged.next(this.rows);
    //       resolve(this.rows);
    //     }, reject);
    // });
  }

  public getCustomerDetails(id: number): Observable<CreateCustomer> {
    return this._httpClient.get<CreateCustomer>(
      `${environment.apiUrl}admin/customer/${id}`
    );
  }
}
