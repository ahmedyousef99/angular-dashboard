import { AuthenticationService } from "./../../../auth/service/authentication.service";
import { Component, OnInit, OnDestroy, ViewEncapsulation } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FlatpickrOptions } from "ng2-flatpickr";
import { AccountSettingsService } from "app/main/pages/account-settings/account-settings.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { BlockUI, NgBlockUI } from "ng-block-ui";
@Component({
  selector: "app-account-settings",
  templateUrl: "./account-settings.component.html",
  styleUrls: ["./account-settings.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  // public
  @BlockUI() blockUI: NgBlockUI;

  public contentHeader: object;
  public data: any;
  public nameControl = new FormControl("", Validators.required);
  public submitted: boolean = false;

  public birthDateOptions: FlatpickrOptions = {
    altInput: true,
  };
  passwordTextTypeOld: boolean = false;
  passwordTextTypeNew: boolean = false;
  passwordTextTypeRetype: boolean = false;
  public avatarImage: string;
  public loginForm: FormGroup;
  public isNameForm: boolean = false;

  public alertType: string | null = null; // to store alert type
  public alertMessage: string | null = null; // to store alert message

  // private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {AccountSettingsService} _accountSettingsService
   */
  constructor(
    private _accountSettingsService: AccountSettingsService,
    private _formBuilder: FormBuilder,
    private authenticationService: AuthenticationService
  ) {
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Password Text Type Old
   */
  togglePasswordTextTypeOld() {
    this.passwordTextTypeOld = !this.passwordTextTypeOld;
  }

  /**
   * Toggle Password Text Type New
   */
  togglePasswordTextTypeNew() {
    this.passwordTextTypeNew = !this.passwordTextTypeNew;
  }

  /**
   * Toggle Password Text Type Retype
   */
  togglePasswordTextTypeRetype() {
    this.passwordTextTypeRetype = !this.passwordTextTypeRetype;
  }
  passwordMatchValidator(form: FormGroup) {
    return form.get("newPassword")?.value ===
      form.get("confirmNewPassword")?.value
      ? null
      : { mismatch: true };
  }

  get f() {
    return this.loginForm.controls;
  }

  /**
   * Upload Image
   *
   * @param event
   */
  uploadImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.onload = (event: any) => {
        this.avatarImage = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    console.log(this.authenticationService.currentUserValue.data.name);
    this.nameControl.patchValue(
      this.authenticationService.currentUserValue.data.name
    );
    this.loginForm = this._formBuilder.group(
      {
        oldPassword: ["", [Validators.required, Validators.minLength(8)]],
        newPassword: ["", [Validators.required, Validators.minLength(8)]],
        confirmNewPassword: ["", Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );

    // content header
    this.contentHeader = {
      headerTitle: "Account Settings",
      actionButton: true,
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Home",
            isLink: true,
            link: "/",
          },
          {
            name: "Pages",
            isLink: true,
            link: "/",
          },
          {
            name: "Account Settings",
            isLink: false,
          },
        ],
      },
    };
  }
  public onChangePassword(): void {
    this.alertMessage = ``;
    this.alertType = ``;
    this.isNameForm = false;
    this.submitted = true;
    if (this.loginForm.valid) {
      this.blockUI.start();

      this._accountSettingsService
        .changePassword(this.loginForm.value)
        .subscribe(
          (res) => {
            this.blockUI.stop();
            this.alertType = "success"; // Set alert type to success
            this.alertMessage = res.message; // Set success message
          },
          (error) => {
            this.blockUI.stop();

            this.alertType = "danger"; // Set alert type to danger
            this.alertMessage = error || "An error occurred!"; // Set error message
          }
        );
    }
  }
  public onUpdateProfile(): void {
    this.alertMessage = ``;
    this.alertType = ``;
    this.isNameForm = true;
    this.submitted = true;
    console.log(this.nameControl.value);

    if (this.nameControl.valid) {
      this.blockUI.start();
      console.log(this.nameControl.value);
      this._accountSettingsService
        .UpdateProfile(this.nameControl.value)
        .subscribe(
          (res) => {
            this.blockUI.stop();

            this.alertType = "success"; // Set alert type to success
            this.alertMessage = res.message; // Set success message
          },
          (error) => {
            this.blockUI.stop();

            this.alertType = "danger"; // Set alert type to danger
            this.alertMessage = error || "An error occurred!"; // Set error message
          }
        );
    }
  }
  public emptyForm(): void {
    this.alertMessage = ``;
    this.alertType = ``;
    this.submitted = false;
    this.loginForm.reset();
    this.nameControl.reset();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.submitted = false;
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
