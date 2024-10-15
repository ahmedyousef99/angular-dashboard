import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";

import { CoreCommonModule } from "@core/common.module";
import { ContentHeaderModule } from "app/layout/components/content-header/content-header.module";

import { Ng2FlatpickrModule } from "ng2-flatpickr";
import { FaqModule } from "app/main/pages/faq/faq.module";
import { AccountSettingsModule } from "./account-settings/account-settings.module";
import { MiscellaneousModule } from "./miscellaneous/miscellaneous.module";
import { AuthenticationModule } from "./authentication/authentication.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    MiscellaneousModule,
    Ng2FlatpickrModule,
    FaqModule,
    AccountSettingsModule,
    AuthenticationModule,
  ],

  providers: [],
})
export class PagesModule {}
