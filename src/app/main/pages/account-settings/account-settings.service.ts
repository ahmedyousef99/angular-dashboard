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
export class AccountSettingsService {
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
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
}
