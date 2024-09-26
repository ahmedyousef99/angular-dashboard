import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";

import { BehaviorSubject, Observable, throwError } from "rxjs";
import { AllFaqs, CreateFaqReq, DeleteFaq, UserType } from "./faqs.model";
import { environment } from "environments/environment";
import { catchError } from "rxjs/operators";
@Injectable()
export class FAQService implements Resolve<any> {
  rows: any;
  onFaqsChanged: BehaviorSubject<any>;

  private isFaqsUpdated: EventEmitter<boolean> = new EventEmitter<boolean>();
  private isSideBarOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  public setFaqsUpdated(value: boolean): void {
    this.isFaqsUpdated.emit(value);
  }
  public getFaqsUpdated(): EventEmitter<boolean> {
    return this.isFaqsUpdated;
  }

  public setSideBarOpen(value: boolean): void {
    this.isSideBarOpen.emit(value);
  }
  public getSideBarOpen(): EventEmitter<boolean> {
    return this.isSideBarOpen;
  }
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onFaqsChanged = new BehaviorSubject({});
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
      Promise.all([this.getDataTableRows()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get rows
   */
  public getAllFaqs(params: {
    userType: "CUSTOMER" | "WORKER";
    page?: number;
    limit?: number;
  }): Observable<AllFaqs> {
    return this._httpClient.get<AllFaqs>(`${environment.apiUrl}admin/faq`, {
      params,
    });
  }
  public deleteFaq(id: number): Observable<DeleteFaq> {
    return this._httpClient.delete<DeleteFaq>(
      `${environment.apiUrl}admin/faq/${id}`
    );
  }
  createFaq(faq: CreateFaqReq): Observable<DeleteFaq> {
    return this._httpClient.post<DeleteFaq>(
      `${environment.apiUrl}admin/faq`,
      faq
    );
  }

  getDataTableRows(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get("api/faq-data").subscribe((response: any) => {
        this.rows = response;
        console.log(response);
        this.onFaqsChanged.next(this.rows);
        resolve(this.rows);
      }, reject);
    });
  }

  public updateFaq(id: number, data: CreateFaqReq): Observable<DeleteFaq> {
    console.log(data, `from FAQ service`);
    return this._httpClient
      .patch<DeleteFaq>(`${environment.apiUrl}admin/faq/${id}`, data)
      .pipe(
        catchError((error) => {
          console.error("Error updating FAQ:", error);
          return throwError(error);
        })
      );
  }
}
