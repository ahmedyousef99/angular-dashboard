import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { environment } from "environments/environment";
import { BehaviorSubject, Observable } from "rxjs";
import { CustomerList, Customers } from "../models/customer.model";

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
  getCustomerList(searchData: {
    page?: number;
    limit?: number;
    search?: string | number;
  }): Observable<CustomerList> {
    return this._httpClient.get<CustomerList>(
      `${environment.apiUrl}admin/customer`,
      { params: searchData }
    );
  }

  getDataTableRows(searchData: {
    page: number;
    limit: number;
    search: string | number;
  }): Promise<CustomerList> {
    this.searchData = searchData;
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(`${environment.apiUrl}admin/customer`, { params: searchData })
        .subscribe((response: CustomerList) => {
          this.rows = response.data.data;
          this.onUserListChanged.next(this.rows);
          resolve(this.rows);
        }, reject);
    });
  }
}
