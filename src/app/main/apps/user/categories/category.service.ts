import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { AllAdmins } from "../models/admins.model";

import { catchError, map } from "rxjs/operators";
import {
  newCategoryReq,
  DeleteCategory,
  AllCategories,
  CategoryDetails,
} from "../models/category.model";

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
  public updateCategory(id: number, data: any): Observable<DeleteCategory> {
    // Create FormData object to hold the updated category data
    const formData = new FormData();

    // Append category properties to FormData
    if (data.parentId !== undefined) {
      formData.append("parentId", data.parentId.toString());
    }

    formData.append("nameEn", data.nameEn);
    formData.append("isActive", data.isActive);
    formData.append("nameEs", data.nameEs);
    formData.append("nameAr", data.nameAr);

    // Append the image file (ensure 'image' is the expected field name on the backend)
    if (data.image) {
      formData.append("image", data.image);
    }

    console.log(data, `from service`); // For debugging

    // Send PATCH request with FormData
    return this._httpClient
      .patch<DeleteCategory>(
        `${environment.apiUrl}admin/category/${id}`,
        formData
      )
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
    // Create FormData object to hold the category data and image
    const formData = new FormData();

    // Append category properties to FormData
    if (category.parentId !== undefined) {
      formData.append("parentId", category.parentId.toString());
    }

    formData.append("nameEn", category.nameEn);
    formData.append("nameEs", category.nameEs);
    formData.append("nameAr", category.nameAr);

    // Append the image file (ensure 'image' is the expected field name on the backend)
    formData.append("image", category.image);

    console.log(category, 3331); // For debugging

    // Send POST request with FormData
    return this._httpClient.post<DeleteCategory>(
      `${environment.apiUrl}admin/category`,
      formData
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
