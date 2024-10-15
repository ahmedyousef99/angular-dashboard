import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { ContentHeaderModule } from "app/layout/components/content-header/content-header.module";

import { WithoutMenuComponent } from "app/main/ui/page-layouts/without-menu/without-menu.component";

const routes: Routes = [
  {
    path: "page-layouts/without-menu",
    component: WithoutMenuComponent,
  },
];

@NgModule({
  declarations: [WithoutMenuComponent],
  imports: [RouterModule.forChild(routes), NgbModule, ContentHeaderModule],
})
export class WithoutMenuModule {}
