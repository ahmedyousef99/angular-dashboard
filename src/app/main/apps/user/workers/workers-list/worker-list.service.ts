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
  AllWorkers,
  CreateWorkerReq,
  CreateWorkersRes,
} from "../../models/workers.model";

@Injectable()
export class WorkerListService {
  public onUserListChanged: BehaviorSubject<AllWorkers>;
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

  /**
   * Get rows
   */
  public updateWorker(
    id: number,
    data: CreateWorkerReq
  ): Observable<CreateWorkersRes> {
    console.log(data, `from service`);

    // Create FormData object to hold the filtered worker data
    const formData = new FormData();

    // Append only properties with valid values to FormData
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value);
      }
    });

    // Send PATCH request with FormData
    return this._httpClient
      .patch<CreateWorkersRes>(
        `${environment.apiUrl}admin/worker/${id}`,
        formData
      )
      .pipe(
        catchError((error) => {
          console.error("Error updating worker:", error);
          return throwError(error);
        })
      );
  }

  public deleteWorker(id: number): Observable<CreateWorkersRes> {
    return this._httpClient.delete<CreateWorkersRes>(
      `${environment.apiUrl}admin/worker/${id}`
    );
  }

  createWorker(admin: CreateWorkerReq): Observable<CreateWorkersRes> {
    // Create FormData object to hold the filtered worker data
    const formData = new FormData();

    // Append only properties with valid values to FormData
    Object.keys(admin).forEach((key) => {
      const value = admin[key];
      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value);
      }
    });

    console.log(admin, 3331); // For debugging

    // Send POST request with FormData
    return this._httpClient
      .post<CreateWorkersRes>(`${environment.apiUrl}admin/worker`, formData)
      .pipe(
        map((res) => {
          console.log(res, `from worker services`);
          // Optionally refresh the worker data if needed
          // this.getAllWorkers();
          return res;
        })
      );
  }

  public getAllWorkers(searchData?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Observable<AllWorkers> {
    this.searchData = searchData;
    return this._httpClient.get<AllWorkers>(
      `${environment.apiUrl}admin/worker`,
      {
        params: searchData,
      }
    );
  }

  public getWorkersDetails(id: number): Observable<CreateWorkersRes> {
    return this._httpClient.get<CreateWorkersRes>(
      `${environment.apiUrl}admin/worker/${id}`
    );
  }
}
