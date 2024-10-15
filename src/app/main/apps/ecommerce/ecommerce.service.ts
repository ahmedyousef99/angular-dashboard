import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { environment } from "environments/environment";

import { BehaviorSubject, Observable, throwError } from "rxjs";
import { getAllServices, ServiceFilters } from "./models/services.model";
import {
  ServicesDetails,
  UpdateServiceBody,
} from "./models/services-details.model";
import { catchError } from "rxjs/operators";
import { GetAllCustomerReviews } from "./models/customer-reviews.model";

@Injectable({
  providedIn: "root",
})
export class EcommerceService {
  constructor(private _httpClient: HttpClient) {}

  public deleteService(id: number): Observable<any> {
    return this._httpClient.delete<any>(
      `${environment.apiUrl}admin/service/${id}`
    );
  }

  public getServiceDetails(id: number): Observable<ServicesDetails> {
    return this._httpClient.get<ServicesDetails>(
      `${environment.apiUrl}admin/service/${id}`
    );
  }

  public getCustomerReviews(
    serviceId: number
  ): Observable<GetAllCustomerReviews> {
    return this._httpClient.get<GetAllCustomerReviews>(
      `${environment.apiUrl}admin/customer-review?serviceId=${serviceId}`
    );
  }
  public getAllServices(searchData?: {
    categoryId?: number;
    subCategoryId?: number;
    priceFrom?: number;
    priceTo?: number;
    page?: number;
    limit?: number;
    rate?: number;
    search?: string;
  }): Observable<getAllServices> {
    // this.searchData = searchData;
    return this._httpClient.get<getAllServices>(
      `${environment.apiUrl}admin/service`,
      {
        params: searchData,
      }
    );
  }
  public updateService(id: number, data: UpdateServiceBody): Observable<any> {
    console.log(data, `from service`);
    return this._httpClient
      .patch<any>(`${environment.apiUrl}admin/service/${id}`, data)
      .pipe(
        catchError((error) => {
          console.error("Error updating service:", error);
          return throwError(error);
        })
      );
  }
}
