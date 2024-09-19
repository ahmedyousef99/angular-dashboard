import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";

@Component({
  selector: "app-new-user-sidebar",
  templateUrl: "./new-user-sidebar.component.html",
})
export class NewUserSidebarComponent implements OnInit {
  public fullname;
  public username;
  public email;
  public customerForm: FormGroup;
  public passwordTextType: boolean;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _formBuilder: FormBuilder
  ) {}

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

  /**
   * Submit
   *
   * @param form
   */
  submit(form) {
    if (form.valid) {
      this.toggleSidebar("new-user-sidebar");
    }
  }

  ngOnInit(): void {
    this.customerForm = this._formBuilder.group({
      name: [``, [Validators.required, Validators.email]],
      email: [``, [Validators.required, Validators.email]],
      password: [``, Validators.required],
      phone: [``, Validators.required],
      dateOfBirth: [``, Validators.required],
    });
  }
}
