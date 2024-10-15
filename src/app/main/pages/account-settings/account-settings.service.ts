import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { environment } from "environments/environment";

import { BehaviorSubject, Observable } from "rxjs";
interface ChangePasswordData {
  newPassword: any;
  oldPassword: any;
  reTyping: any;
}
interface UpdateProfile {
  name: string;
}

@Injectable()
export class AccountSettingsService implements Resolve<any> {
  rows: any;
  onSettingsChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onSettingsChanged = new BehaviorSubject({});
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
  changePassword(changePasswordData: ChangePasswordData): Observable<any> {
    return this._httpClient.patch<any>(
      `${environment.apiUrl}admin/auth/change-password`,
      changePasswordData
    );
  }

  UpdateProfile(updateProfile: UpdateProfile): Observable<any> {
    return this._httpClient.patch<any>(
      `${environment.apiUrl}admin/profile/update`,
      updateProfile
    );
  }

  getDataTableRows(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get("api/account-settings-data")
        .subscribe((response: any) => {
          this.rows = response;
          this.onSettingsChanged.next(this.rows);
          resolve(this.rows);
        }, reject);
    });
  }
}
