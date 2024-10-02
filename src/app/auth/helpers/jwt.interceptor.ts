import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "environments/environment";
import { AuthenticationService } from "app/auth/service";
import { User } from "../models";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  /**
   *
   * @param {AuthenticationService} _authenticationService
   */
  constructor(private _authenticationService: AuthenticationService) {}

  /**
   * Add auth header with jwt if user is logged in and request is to api url
   * @param request
   * @param next
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const currentUser: User = this._authenticationService.currentUserValue;
    const isLoggedIn = currentUser && currentUser;

    const isApiUrl = request.url.startsWith(environment.apiUrl);
    console.log(request.url);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ` + `${currentUser.data.accessToken}`,
        },
      });
    }
    return next.handle(request);
  }
}
