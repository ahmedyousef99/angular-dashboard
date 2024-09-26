import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { Ng2FlatpickrModule } from "ng2-flatpickr";

import { CoreCommonModule } from "@core/common.module";
import { CoreDirectivesModule } from "@core/directives/directives";
import { CorePipesModule } from "@core/pipes/pipes.module";
import { CoreSidebarModule } from "@core/components";

import { InvoiceListService } from "app/main/apps/invoice/invoice-list/invoice-list.service";
import { InvoiceModule } from "app/main/apps/invoice/invoice.module";

import { UserEditComponent } from "app/main/apps/user/user-edit/user-edit.component";
import { UserEditService } from "app/main/apps/user/user-edit/user-edit.service";

import { UserListComponent } from "app/main/apps/user/user-list/user-list.component";
import { UserListService } from "app/main/apps/user/user-list/user-list.service";

import { UserViewComponent } from "app/main/apps/user/user-view/user-view.component";
import { UserViewService } from "app/main/apps/user/user-view/user-view.service";
import { NewUserSidebarComponent } from "app/main/apps/user/user-list/new-user-sidebar/new-user-sidebar.component";
import { AdminEditComponent } from "./admin/admin-edit/admin-edit.component";
import { AdminListComponent } from "./admin/admin-list/admin-list.component";
import { NewAdminSidebarComponent } from "./admin/admin-list/new-admin-sidebar/new-user-sidebar.component";
import { AdminViewComponent } from "./admin/admin-view/admin-view.component";
import { AdminListService } from "./admin/admin-list/admin-list.service";
import { WorkerListService } from "./workers/workers-list/worker-list.service";
import { WorkerEditComponent } from "./workers/workers-edit/worker-edit.component";
import { WorkerListComponent } from "./workers/workers-list/worker-list.component";
import { NewWorkerSidebarComponent } from "./workers/workers-list/new-worker-sidebar/new-worker-sidebar.component";
import { WorkerViewComponent } from "./workers/workers-view/worker-view.component";

// routing
const routes: Routes = [
  {
    path: "user-list",
    component: UserListComponent,

    data: { animation: "UserListComponent" },
  },
  {
    path: "admin-list",
    component: AdminListComponent,
    data: { animation: "AdminListComponent" },
  },
  {
    path: "worker-list",
    component: WorkerListComponent,
    data: { animation: "AdminListComponent" },
  },
  {
    path: "admin-view/:id",
    component: AdminViewComponent,
    data: { animation: "AdminViewComponent" },
  },
  {
    path: "worker-view/:id",
    component: WorkerViewComponent,
    data: { animation: "AdminViewComponent" },
  },
  {
    path: "user-view/:id",
    component: UserViewComponent,
    data: { animation: "UserViewComponent" },
  },

  {
    path: "admin-edit/:id",
    component: AdminEditComponent,
    data: { animation: "AdminEditComponent" },
  },
  {
    path: "worker-edit/:id",
    component: WorkerEditComponent,
    data: { animation: "AdminEditComponent" },
  },
  {
    path: "user-edit/:id",
    component: UserEditComponent,
    data: { animation: "UserEditComponent" },
  },
];

@NgModule({
  declarations: [
    UserListComponent,
    UserViewComponent,
    UserEditComponent,
    NewUserSidebarComponent,
    AdminEditComponent,
    AdminListComponent,
    NewAdminSidebarComponent,
    AdminViewComponent,
    WorkerEditComponent,
    WorkerListComponent,
    NewWorkerSidebarComponent,
    WorkerViewComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreCommonModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    Ng2FlatpickrModule,
    NgxDatatableModule,
    CorePipesModule,
    CoreDirectivesModule,
    InvoiceModule,
    CoreSidebarModule,
  ],
  providers: [
    UserListService,
    UserViewService,
    UserEditService,
    AdminListService,
    WorkerListService,
  ],
})
export class UserModule {}
