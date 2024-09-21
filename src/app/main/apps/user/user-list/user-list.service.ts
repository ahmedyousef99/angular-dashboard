import { CreateCustomerReq } from "./../models/customer.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { environment } from "environments/environment";
import { BehaviorSubject, Observable } from "rxjs";
import {
  CreateCustomer,
  CustomerList,
  Customers,
} from "../models/customer.model";
import { map } from "rxjs/operators";

@Injectable()
export class UserListService implements Resolve<any> {
  public rows: any;
  public onUserListChanged: BehaviorSubject<CustomerList>;
  public searchData: any = {};

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onUserListChanged = new BehaviorSubject(null);
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
    return this._httpClient.patch<CreateCustomer>(
      `${environment.apiUrl}admin/customer/${id}`,
      data
    );
  }

  public deleteCustomer(id: number): Observable<CreateCustomer> {
    return this._httpClient.delete<CreateCustomer>(
      `${environment.apiUrl}admin/customer/${id}`
    );
  }

  createCustomer(customer: CreateCustomerReq): Observable<CreateCustomer> {
    console.log(customer, 3331);
    return this._httpClient
      .post<CreateCustomer>(`${environment.apiUrl}admin/customer`, customer)
      .pipe(
        map((res) => {
          console.log(res, `111231`);
          this.getDataTableRows();
          return res;
        })
      );
  }

  getDataTableRows(searchData?: {
    page: number;
    limit: number;
    search: string | number;
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
}
