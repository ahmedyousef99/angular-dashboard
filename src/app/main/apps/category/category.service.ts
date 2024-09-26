import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { BehaviorSubject, Observable } from "rxjs";
import { AllAdmins } from "../user/models/admins.model";
import { AllCategories } from "./models/category.model";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  public rows: any;
  public onUserListChanged: BehaviorSubject<AllAdmins>;
  public searchData: any = {};

  private isCategoryUpdated: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    // this.onUserListChanged = new BehaviorSubject(null);
  }
  public setCategoryUpdated(value: boolean): void {
    this.isCategoryUpdated.emit(value);
  }
  public getCategoryUpdated(): EventEmitter<boolean> {
    return this.isCategoryUpdated;
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
  // public updateAdmin(
  //   id: number,
  //   data: CreateAdminReq
  // ): Observable<CreateAdminRes> {
  //   console.log(data, `from service`);
  //   return this._httpClient
  //     .patch<CreateAdminRes>(`${environment.apiUrl}admin/admin/${id}`, data)
  //     .pipe(
  //       catchError((error) => {
  //         console.error("Error updating Admin:", error);
  //         return throwError(error);
  //       })
  //     );
  // }

  // public deleteAdmin(id: number): Observable<CreateAdminRes> {
  //   return this._httpClient.delete<CreateAdminRes>(
  //     `${environment.apiUrl}admin/admin/${id}`
  //   );
  // }

  // createAdmin(admin: CreateAdminReq): Observable<CreateAdminRes> {
  //   console.log(admin, 3331);
  //   return this._httpClient
  //     .post<CreateAdminRes>(`${environment.apiUrl}admin/admin`, admin)
  //     .pipe(
  //       map((res) => {
  //         console.log(res, `from admin services`);
  //         this.getAllAdmins();
  //         return res;
  //       })
  //     );
  // }

  public getAllCategories(searchData?: {
    page?: number;
    limit?: number;
  }): Observable<AllCategories> {
    this.searchData = searchData;
    return this._httpClient.get<AllCategories>(
      `${environment.apiUrl}admin/category`,
      {
        params: searchData,
      }
    );
  }

  // public getAdminDetails(id: number): Observable<CreateAdminRes> {
  //   return this._httpClient.get<CreateAdminRes>(
  //     `${environment.apiUrl}admin/admin/${id}`
  //   );
  // }
}
