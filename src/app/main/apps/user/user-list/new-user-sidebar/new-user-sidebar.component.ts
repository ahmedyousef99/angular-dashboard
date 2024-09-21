import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { UserService } from "app/auth/service";
import { UserListService } from "../user-list.service";
import { FlatpickrOptions } from "ng2-flatpickr";

@Component({
  selector: "app-new-user-sidebar",
  templateUrl: "./new-user-sidebar.component.html",
})
export class NewUserSidebarComponent implements OnInit {
  public customerForm: FormGroup;
  public passwordTextType: boolean;
  public submitted = false;
  testValue: any;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _formBuilder: FormBuilder,
    private _userListService: UserListService
  ) {}
  public birthDateOptions: FlatpickrOptions = {
    altInput: true,
  };

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
    return this.customerForm.controls;
  }

  /**
   * Submit
   *
   * @param form
   */
  submit() {
    this.submitted = true;
    console.log(this.customerForm.value);

    this._userListService
      .createCustomer(this.customerForm.value)
      .subscribe((res) => {
        console.log(res, `this is from the second`);
      });
    if (this.customerForm.valid) {
      this.toggleSidebar("new-user-sidebar");
    }
  }

  ngOnInit(): void {
    this.customerForm = this._formBuilder.group({
      name: [``, [Validators.required, Validators.email]],
      email: [``, [Validators.required, Validators.email]],
      password: [``, Validators.required],
      phone: [``],
      dateOfBirth: [``],
      avatar: [``],
    });
  }
}
