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
import { ActivatedRoute, Params } from "@angular/router";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { AdminListService } from "../admin-list/admin-list.service";
import { Admin, CreateAdminReq } from "../../models/admins.model";

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
  public currentRow: Admin;
  public tempRow;
  public avatarImage: string;
  public adminForm: FormGroup;
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
    private _formBuilder: FormBuilder,
    private _adminListService: AdminListService,
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
    this.adminForm.reset();
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
        this.adminForm.get(`avatar`).patchValue(this.avatarImage);
        console.log(this.adminForm.value);
        console.log(this.avatarImage);
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }
  get f() {
    return this.adminForm.controls;
  }

  private editAdmin(id: number, data: CreateAdminReq): void {
    this._adminListService
      .updateAdmin(id, data)
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
    console.log(this.adminForm.value);
    if (this.adminForm.valid) {
      console.log(`test`);
      this.editAdmin(this.productId, this.adminForm.value);
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
        this._adminListService
          .getAdminDetails(this.productId)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(
            (res) => {
              console.log(res, `the res`);
              this.currentRow = res.data;
              this.adminForm.patchValue(this.currentRow);
              this.blockUI.stop();
              console.log(this.adminForm.value, `the form`);
            },
            (error) => {
              this.blockUI.stop();
            }
          );
        // this.getDetails(this.productId);
      });

    this.adminForm = this._formBuilder.group({
      name: [``, [Validators.required]],
      email: [``, [Validators.required, Validators.email]],
      password: [``],
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
