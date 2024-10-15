/**
 *  ? Tip:
 *
 * For Actual Node.js - Role Based Authorization Tutorial with Example API
 * Refer: https://jasonwatmore.com/post/2018/11/28/nodejs-role-based-authorization-tutorial-with-example-api
 * Running an Angular 9 client app with the Node.js Role Based Auth API
 */

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { User, Role } from 'app/auth/models'; 

// Users with role
const users: User[] = [
  {
  status: true,
  code: 200,
  message: "تم تسجيل الدخول بنجاح.",
  data: {
      id: 1,
      name: "Super Admin",
      email: "admin@admin.com",
      status: "ACTIVE",
      isNotificationsEnabled: true,
      createdAt: "2024-08-15T13:41:51.178Z",
      updatedAt: "2024-08-15T13:47:26.552Z",
      adminRoleList: [
            {
              id: 2,
              adminId: 1,
              roleId: 1,
              createdAt: "2024-08-16T12:23:34.380Z",
              updatedAt: "2024-08-16T12:23:34.380Z",
              role: {
                  id: 1,
                  nameEn: "Sub Admin",
                  nameEs: "Sub Admin es",
                  nameAr: "Sub Admin ar",
                  createdAt: "2024-08-16T04:46:35.122Z",
                  updatedAt: "2024-08-16T04:46:35.122Z",
                  rolePermissionList: [
                        {
                          id: 1,
                          roleId: 1,
                          permissionId: 1,
                          createdAt: "2024-08-16T04:46:35.122Z",
                          updatedAt: "2024-08-16T04:46:35.122Z",
                          permission: {
                              id: 1,
                              action: "CREATE",
                              group: "CATEGORY",
                              createdAt: "2024-08-16T04:45:38.407Z",
                              updatedAt: "2024-08-16T04:45:38.407Z"
                            }
                        },
                        {
                          id: 2,
                          roleId: 1,
                          permissionId: 2,
                          createdAt: "2024-08-16T04:46:35.122Z",
                          updatedAt: "2024-08-16T04:46:35.122Z",
                          permission: {
                              id: 2,
                              action: "UPDATE",
                              group: "CATEGORY",
                              createdAt: "2024-08-16T04:46:10.709Z",
                              updatedAt: "2024-08-16T04:46:10.709Z"
                            }
                        },
                        {
                          id: 3,
                          roleId: 1,
                          permissionId: 3,
                          createdAt: "2024-08-16T12:28:02.449Z",
                          updatedAt: "2024-08-16T12:28:02.449Z",
                          permission: {
                              id: 3,
                              action: "VIEW",
                              group: "CATEGORY",
                              createdAt: "2024-08-16T12:27:19.739Z",
                              updatedAt: "2024-08-16T12:27:19.739Z"
                            }
                        }
                    ]
                }
            }
        ],
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidHlwZSI6IkFETUlOIiwiYWRtaW5Sb2xlTGlzdCI6W3siaWQiOjIsImFkbWluSWQiOjEsInJvbGVJZCI6MSwiY3JlYXRlZEF0IjoiMjAyNC0wOC0xNlQxMjoyMzozNC4zODBaIiwidXBkYXRlZEF0IjoiMjAyNC0wOC0xNlQxMjoyMzozNC4zODBaIiwicm9sZSI6eyJpZCI6MSwibmFtZUVuIjoiU3ViIEFkbWluIiwibmFtZUVzIjoiU3ViIEFkbWluIGVzIiwibmFtZUFyIjoiU3ViIEFkbWluIGFyIiwiY3JlYXRlZEF0IjoiMjAyNC0wOC0xNlQwNDo0NjozNS4xMjJaIiwidXBkYXRlZEF0IjoiMjAyNC0wOC0xNlQwNDo0NjozNS4xMjJaIiwicm9sZVBlcm1pc3Npb25MaXN0IjpbeyJpZCI6MSwicm9sZUlkIjoxLCJwZXJtaXNzaW9uSWQiOjEsImNyZWF0ZWRBdCI6IjIwMjQtMDgtMTZUMDQ6NDY6MzUuMTIyWiIsInVwZGF0ZWRBdCI6IjIwMjQtMDgtMTZUMDQ6NDY6MzUuMTIyWiIsInBlcm1pc3Npb24iOnsiaWQiOjEsImFjdGlvbiI6IkNSRUFURSIsImdyb3VwIjoiQ0FURUdPUlkiLCJjcmVhdGVkQXQiOiIyMDI0LTA4LTE2VDA0OjQ1OjM4LjQwN1oiLCJ1cGRhdGVkQXQiOiIyMDI0LTA4LTE2VDA0OjQ1OjM4LjQwN1oifX0seyJpZCI6Miwicm9sZUlkIjoxLCJwZXJtaXNzaW9uSWQiOjIsImNyZWF0ZWRBdCI6IjIwMjQtMDgtMTZUMDQ6NDY6MzUuMTIyWiIsInVwZGF0ZWRBdCI6IjIwMjQtMDgtMTZUMDQ6NDY6MzUuMTIyWiIsInBlcm1pc3Npb24iOnsiaWQiOjIsImFjdGlvbiI6IlVQREFURSIsImdyb3VwIjoiQ0FURUdPUlkiLCJjcmVhdGVkQXQiOiIyMDI0LTA4LTE2VDA0OjQ2OjEwLjcwOVoiLCJ1cGRhdGVkQXQiOiIyMDI0LTA4LTE2VDA0OjQ2OjEwLjcwOVoifX0seyJpZCI6Mywicm9sZUlkIjoxLCJwZXJtaXNzaW9uSWQiOjMsImNyZWF0ZWRBdCI6IjIwMjQtMDgtMTZUMTI6Mjg6MDIuNDQ5WiIsInVwZGF0ZWRBdCI6IjIwMjQtMDgtMTZUMTI6Mjg6MDIuNDQ5WiIsInBlcm1pc3Npb24iOnsiaWQiOjMsImFjdGlvbiI6IlZJRVciLCJncm91cCI6IkNBVEVHT1JZIiwiY3JlYXRlZEF0IjoiMjAyNC0wOC0xNlQxMjoyNzoxOS43MzlaIiwidXBkYXRlZEF0IjoiMjAyNC0wOC0xNlQxMjoyNzoxOS43MzlaIn19XX19XSwiaWF0IjoxNzI2NDg4ODE0LCJleHAiOjE3MjY1NDI4MTR9.CtysrRqOxL2R8Mug09Ua82ZO13gbWNAT_l85kH9WVic"
    }
}
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    // wrap in delayed observable to simulate server api call
    return of(null).pipe(mergeMap(handleRoute));
    // .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
    // .pipe(delay(500))
    // .pipe(dematerialize());

    function handleRoute() {
      switch (true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        case url.match(/\/users\/\d+$/) && method === 'GET':
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions 


    function getUsers() {
      if (!isAdmin()) return unauthorized();
      return ok(users);
    }



    // helper functions

    function ok(body) {
      return of(new HttpResponse({ status: 200, body }));
    }

    function unauthorized() {
      return throwError({ status: 401, error: { message: 'unauthorized' } });
    }

    function error(message) {
      return throwError({ status: 400, error: { message } });
    }

    function isLoggedIn() {
      const authHeader = headers.get('Authorization') || '';
      return authHeader.startsWith('Bearer fake-jwt-token');
    }

    function isAdmin() {
      return isLoggedIn() ;
    }

    function currentUser() {
      if (!isLoggedIn()) return;
      const id = parseInt(headers.get('Authorization').split('.')[1]);
      return 1;
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }
  }
}

export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
