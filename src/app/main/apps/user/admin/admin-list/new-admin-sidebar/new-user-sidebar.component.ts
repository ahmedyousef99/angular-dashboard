import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ToastrService } from "ngx-toastr";
import { AdminListService } from "../admin-list.service";

@Component({
  selector: "app-new-admin-sidebar",
  templateUrl: "./new-admin-sidebar.component.html",
})
export class NewAdminSidebarComponent implements OnInit {
  public adminForm: FormGroup;
  public passwordTextType: boolean;
  public submitted = false;
  public formMessage: string = ``;
  public isSubmitLoading: boolean = false;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _formBuilder: FormBuilder,
    private _adminListService: AdminListService,
    private toastr: ToastrService
  ) {}

  @BlockUI("card-section") cardBlockUI: NgBlockUI;

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }
  get f() {
    return this.adminForm.controls;
  }

  /**
   * Submit
   *
   * @param form
   */
  submit() {
    this.formMessage = ``;
    this.submitted = true;
    if (this.adminForm.valid) {
      this.isSubmitLoading = true;
      this._adminListService.createAdmin(this.adminForm.value).subscribe(
        (res) => {
          this.isSubmitLoading = false;
          this._coreSidebarService
            .getSidebarRegistry("new-user-sidebar")
            .close();
          this._adminListService.setCustomerUpdated(true);

          this.formMessage = ``;
          this.adminForm.reset();
          this.submitted = false;
          this.toastr.success(`${res.message}`, "Success!", {
            positionClass: `toast-top-left`,
            toastClass: "toast ngx-toastr",
            closeButton: true,
          });
        },
        (error) => {
          this.isSubmitLoading = false;

          console.log(error);
          this.formMessage = error;
        }
      );
    }
  }

  ngOnInit(): void {
    this.adminForm = this._formBuilder.group({
      name: [``, [Validators.required]],
      email: [``, [Validators.required, Validators.email]],
      password: [``, Validators.required],
    });
  }
}
