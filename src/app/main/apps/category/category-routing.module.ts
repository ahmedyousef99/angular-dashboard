import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CategoryViewComponent } from "./category-view/category-view.component";
import { CategoryUpdateComponent } from "./category-update/category-update.component";
import { CategoryListComponent } from "./category-list/category-list.component";

const routes: Routes = [
  {
    path: "category-view/:id",
    component: CategoryViewComponent,
    data: { animation: "UserViewComponent" },
  },

  {
    path: "category-edit/:id",
    component: CategoryUpdateComponent,
    data: { animation: "AdminEditComponent" },
  },
  {
    path: "category-list",
    component: CategoryListComponent,
    data: { animation: "AdminEditComponent" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryRoutingModule {}
