import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { AllAdmins } from "../user/models/admins.model";
import {
  AllCategories,
  Category,
  CategoryDetails,
  DeleteCategory,
  newCategoryReq,
} from "./models/category.model";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  public rows: any;
  public onUserListChanged: BehaviorSubject<AllAdmins>;
  public searchData: any = {};

  private isCategoryUpdated: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  private isSideBarOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

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
  public updateCategory(
    id: number,
    data: newCategoryReq
  ): Observable<DeleteCategory> {
    console.log(data, `from service`);
    return this._httpClient
      .patch<DeleteCategory>(`${environment.apiUrl}admin/category/${id}`, data)
      .pipe(
        catchError((error) => {
          console.error("Error updating category:", error);
          return throwError(error);
        })
      );
  }

  public deleteCategory(id: number): Observable<DeleteCategory> {
    return this._httpClient.delete<DeleteCategory>(
      `${environment.apiUrl}admin/category/${id}`
    );
  }

  createCategory(category: newCategoryReq): Observable<DeleteCategory> {
    console.log(category, 3331);
    return this._httpClient.post<DeleteCategory>(
      `${environment.apiUrl}admin/category`,
      category
    );
  }

  public getAllCategories(searchData?: {
    page?: number;
    limit?: number;
  }): Observable<AllCategories> {
    return this._httpClient
      .get<AllCategories>(`${environment.apiUrl}admin/category`, {
        params: searchData,
      })
      .pipe(map((response) => this.processData(response)));
  }
  private processData(response: AllCategories): AllCategories {
    // Initialize an array to hold the final categories

    response.data.data.forEach((item) => {
      // Assign treeStatus based on subCategoryList
      item.treeStatus =
        item.subCategoryList && item.subCategoryList.length === 0
          ? "disabled"
          : "collapsed";
    });

    // Update the response with the new final array of categories
    return response; // Return the modified AllCategories object
  }
  // private processData(response: AllCategories): AllCategories {
  //   // Initialize an array to hold the final categories
  //   const finalCategories: Category[] = [];

  //   response.data.data.forEach((item) => {
  //     // Assign treeStatus based on subCategoryList
  //     item.treeStatus =
  //       item.subCategoryList && item.subCategoryList.length === 0
  //         ? "disabled"
  //         : "collapsed";

  //     // Add the parent category to the final array
  //     finalCategories.push(item);
  //     console.log(finalCategories);

  //     // If there are subcategories, add them to the final array
  //     if (item.subCategoryList && item.subCategoryList.length > 0) {
  //       item.subCategoryList.forEach((subItem) => {
  //         subItem.treeStatus = "disabled"; // Set default for subcategories
  //         finalCategories.push(subItem); // Add subcategory to the final array
  //       });
  //     }
  //   });

  //   // Update the response with the new final array of categories
  //   response.data.data = finalCategories;
  //   return response; // Return the modified AllCategories object
  // }
  public getCategoryDetails(id: number): Observable<CategoryDetails> {
    return this._httpClient.get<CategoryDetails>(
      `${environment.apiUrl}admin/category/${id}`
    );
  }
}
