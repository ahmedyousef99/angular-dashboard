import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { AllFaqs, CreateFaqReq, DeleteFaq } from "./faqs.model";
import { environment } from "environments/environment";
import { catchError } from "rxjs/operators";

@Injectable()
export class FAQService {
  private isFaqsUpdated: EventEmitter<boolean> = new EventEmitter<boolean>();
  private isSideBarOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private _httpClient: HttpClient) {}

  ///usableFun
  public setFaqsUpdated(value: boolean): void {
    this.isFaqsUpdated.emit(value);
  }

  ///usableFun
  public getFaqsUpdated(): EventEmitter<boolean> {
    return this.isFaqsUpdated;
  }

  ///usableFun
  public setSideBarOpen(value: boolean): void {
    this.isSideBarOpen.emit(value);
  }

  ///usableFun
  public getSideBarOpen(): EventEmitter<boolean> {
    return this.isSideBarOpen;
  }

  ///usableFun
  public getAllFaqs(params: {
    userType: "CUSTOMER" | "WORKER";
    page?: number;
    limit?: number;
  }): Observable<AllFaqs> {
    return this._httpClient.get<AllFaqs>(`${environment.apiUrl}admin/faq`, {
      params,
    });
  }

  ///usableFun
  public deleteFaq(id: number): Observable<DeleteFaq> {
    return this._httpClient.delete<DeleteFaq>(
      `${environment.apiUrl}admin/faq/${id}`
    );
  }

  ///usableFun
  public createFaq(faq: CreateFaqReq): Observable<DeleteFaq> {
    return this._httpClient.post<DeleteFaq>(
      `${environment.apiUrl}admin/faq`,
      faq
    );
  }

  ///usableFun
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
