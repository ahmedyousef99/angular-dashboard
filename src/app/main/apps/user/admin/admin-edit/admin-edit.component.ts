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

import { ActivatedRoute, Params } from "@angular/router";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { Customers, CreateCustomerReq } from "../../models/customer.model";
import { UserListService } from "../admin-list/admin-list.service";

@Component({
  selector: "app-admin-edit",
  templateUrl: "./admin-edit.component.html",
  styleUrls: ["./admin-edit.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AdminEditComponent implements OnInit, OnDestroy {
  // Public
  public url = this.router.url;
  public urlLastValue;
  public rows;
  public currentRow: Customers;
  public tempRow;
  public avatarImage: string;
  public customerForm: FormGroup;
  public passwordTextType: boolean;
  public submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild("accountForm") accountForm: NgForm;

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
  productId: number;

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
    private _userListService: UserListService,
    private route: ActivatedRoute
  ) {
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Reset Form With Default Values
   */
  resetFormWithDefaultValues() {
    this.customerForm.reset();
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
      console.log(`test`);
      this.editCustomer(this.productId, this.customerForm.value);
      // this.toggleSidebar("new-user-sidebar");
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((params: Params) => {
        this.productId = +params[`id`];
        this.blockUI.start();
        console.log(this.productId);
        this._userListService
          .getCustomerDetails(this.productId)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(
            (res) => {
              console.log(res, `the res`);
              this.currentRow = res.data;
              this.avatarImage = this.currentRow.avatar;
              this.customerForm.patchValue(this.currentRow);
              this.blockUI.stop();
              console.log(this.customerForm.value, `the form`);
            },
            (error) => {
              this.blockUI.stop();
            }
          );
        // this.getDetails(this.productId);
      });
    // this._userEditService.onUserEditChanged
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((response) => {
    //     this.rows = response;
    //     this.rows.map((row) => {
    //       if (row.id == this.productId) {
    //         this.currentRow = row;
    //         this.avatarImage = this.currentRow.avatar;
    //         this.customerForm.patchValue(this.currentRow);
    //         console.log(this.customerForm.value);
    //         this.tempRow = cloneDeep(row);
    //       }
    //     });
    //   });
    this.customerForm = this._formBuilder.group({
      name: [``, [Validators.required]],
      email: [``, [Validators.required, Validators.email]],
      password: [``],
      phone: [``],
      dateOfBirth: [``, [Validators.required]],
      avatar: [``],
      status: [``], //INACTIVE or Active
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
