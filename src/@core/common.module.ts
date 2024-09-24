import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";

import { CoreDirectivesModule } from "@core/directives/directives";
import { CorePipesModule } from "@core/pipes/pipes.module";
import { BlockUIModule } from "ng-block-ui";
import { CoreBlockUiComponent } from "./components/core-card/core-block-ui/core-block-ui.component";

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    CoreDirectivesModule,
    CorePipesModule,
    SweetAlert2Module.forRoot(),
    BlockUIModule.forRoot({ template: CoreBlockUiComponent }),
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    CoreDirectivesModule,
    CorePipesModule,
    SweetAlert2Module,
    BlockUIModule,
  ],
})
export class CoreCommonModule {}
