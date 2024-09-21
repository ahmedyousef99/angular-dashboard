import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FlatpickrOptions } from "ng2-flatpickr";
import { cloneDeep } from "lodash";

import { UserEditService } from "app/main/apps/user/user-edit/user-edit.service";
import { UserListService } from "../user-list/user-list.service";
import { CreateCustomerReq } from "../models/customer.model";

@Component({
  selector: "app-user-edit",
  templateUrl: "./user-edit.component.html",
  styleUrls: ["./user-edit.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class UserEditComponent implements OnInit, OnDestroy {
  // Public
  public url = this.router.url;
  public urlLastValue;
  public rows;
  public currentRow;
  public tempRow;
  public avatarImage: string;
  public customerForm: FormGroup;
  public passwordTextType: boolean;
  public submitted = false;

  @ViewChild("accountForm") accountForm: NgForm;

  public birthDateOptions: FlatpickrOptions = {
    altInput: true,
  };

  public selectMultiLanguages = [
    "English",
    "Spanish",
    "French",
    "Russian",
    "German",
    "Arabic",
    "Sanskrit",
  ];
  public selectMultiLanguagesSelected = [];

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} router
   * @param {UserEditService} _userEditService
   */
  constructor(
    private router: Router,
    private _userEditService: UserEditService,
    private _formBuilder: FormBuilder,
    private _userListService: UserListService
  ) {
    this._unsubscribeAll = new Subject();
    this.urlLastValue = this.url.substr(this.url.lastIndexOf("/") + 1);
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Reset Form With Default Values
   */
  resetFormWithDefaultValues() {
    this.accountForm.resetForm(this.tempRow);
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
        this.customerForm.get(`avatar`).patchValue(this.avatarImage);
        console.log(this.customerForm.value);
        console.log(this.avatarImage);
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }
  get f() {
    return this.customerForm.controls;
  }

  private editCustomer(id: number, data: CreateCustomerReq): void {
    this._userListService
      .updateCustomer(id, data)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        console.log(res);
      });
  }

  /**
   * Submit
   *
   * @param form
   */

  submit() {
    this.submitted = true;
    console.log(this.customerForm.value);
    if (this.customerForm.valid) {
      this.editCustomer(1, this.customerForm.value);
      // this.toggleSidebar("new-user-sidebar");
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this._userEditService.onUserEditChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        this.rows = response;
        this.rows.map((row) => {
          if (row.id == this.urlLastValue) {
            this.currentRow = row;
            this.avatarImage = this.currentRow.avatar;
            this.tempRow = cloneDeep(row);
          }
        });
      });
    this.customerForm = this._formBuilder.group({
      name: [``, [Validators.required, Validators.email]],
      email: [``, [Validators.email]],
      password: [``, Validators.required],
      phone: [``],
      dateOfBirth: [],
      avatar: [``],
      selectedOption: [`INACTIVE`], //INACTIVE or Active
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
