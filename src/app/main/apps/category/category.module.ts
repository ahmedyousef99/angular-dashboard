import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CategoryRoutingModule } from "./category-routing.module";
import { CategoryListComponent } from "./category-list/category-list.component";
import { CategoryUpdateComponent } from "./category-update/category-update.component";
import { CategoryViewComponent } from "./category-view/category-view.component";
import { NewCategoryComponent } from "./category-list/new-category/new-category.component";
import { CategoryService } from "./category.service";
import { FormsModule } from "@angular/forms";
import { CoreCommonModule } from "@core/common.module";
import { CoreSidebarModule } from "@core/components";
import { CoreDirectivesModule } from "@core/directives/directives";
import { CorePipesModule } from "@core/pipes/pipes.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";

@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryUpdateComponent,
    CategoryViewComponent,
    NewCategoryComponent,
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    CoreCommonModule,
    FormsModule,
    CoreSidebarModule,
    CorePipesModule,
    CoreDirectivesModule,
    NgxDatatableModule,
    NgbModule,
    NgSelectModule,
    CoreCommonModule,
  ],
  providers: [CategoryService],
})
export class CategoryModule {}
