import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { ContentHeaderModule } from "app/layout/components/content-header/content-header.module";

import { CollapsedMenuComponent } from "app/main/ui/page-layouts/collapsed-menu/collapsed-menu.component";

// ! ALERT: This layout do not works with Horizontal Menu

const routes: Routes = [
  {
    path: "page-layouts/collapsed-menu",
    component: CollapsedMenuComponent,
  },
];

@NgModule({
  declarations: [CollapsedMenuComponent],
  imports: [RouterModule.forChild(routes), NgbModule, ContentHeaderModule],
})
export class CollapsedMenuModule {}
