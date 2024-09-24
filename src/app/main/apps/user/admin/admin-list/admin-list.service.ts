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

@Injectable()
export class AdminListService implements Resolve<any> {
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
      Promise.all([this.getAllAdmins(this.searchData)]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get rows
   */
  public updateAdmin(
    id: number,
    data: CreateAdminReq
  ): Observable<CreateAdminRes> {
    console.log(data, `from service`);
    return this._httpClient
      .patch<CreateAdminRes>(`${environment.apiUrl}admin/admin/${id}`, data)
      .pipe(
        catchError((error) => {
          console.error("Error updating Admin:", error);
          return throwError(error);
        })
      );
  }

  public deleteAdmin(id: number): Observable<CreateAdminRes> {
    return this._httpClient.delete<CreateAdminRes>(
      `${environment.apiUrl}admin/admin/${id}`
    );
  }

  createAdmin(admin: CreateAdminReq): Observable<CreateAdminRes> {
    console.log(admin, 3331);
    return this._httpClient
      .post<CreateAdminRes>(`${environment.apiUrl}admin/admin`, admin)
      .pipe(
        map((res) => {
          console.log(res, `from admin services`);
          this.getAllAdmins();
          return res;
        })
      );
  }

  public getAllAdmins(searchData?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Observable<AllAdmins> {
    this.searchData = searchData;
    return this._httpClient.get<AllAdmins>(`${environment.apiUrl}admin/admin`, {
      params: searchData,
    });
  }

  public getAdminDetails(id: number): Observable<CreateAdminRes> {
    return this._httpClient.get<CreateAdminRes>(
      `${environment.apiUrl}admin/admin/${id}`
    );
  }
}
