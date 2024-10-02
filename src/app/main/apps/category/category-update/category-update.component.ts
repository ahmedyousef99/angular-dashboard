import { Component, OnInit, ViewChild } from "@angular/core";
import {
  Category,
  DataDetails,
  newCategoryReq,
} from "../models/category.model";
import { FormGroup, NgForm, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CreateWorkerReq } from "../../user/models/workers.model";
import { WorkerListService } from "../../user/workers/workers-list/worker-list.service";
import { CategoryService } from "../category.service";

@Component({
  selector: "app-category-update",
  templateUrl: "./category-update.component.html",
  styleUrls: ["./category-update.component.scss"],
})
export class CategoryUpdateComponent implements OnInit {
  // Public
  public url = this.router.url;
  public urlLastValue;
  public rows;
  public currentRow: DataDetails;
  public tempRow;
  public avatarImage: string;
  public categoryForm: FormGroup;
  public passwordTextType: boolean;
  public submitted = false;
  public resMessage: { message: string; code: number } = {
    message: "",
    code: 0,
  };
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild("accountForm") accountForm: NgForm;

  public selectMultiLanguagesSelected = [];

  // Private
  private _unsubscribeAll: Subject<any>;
  productId: number;
  isSubmitLoading: boolean;

  /**
   * Constructor
   *
   * @param {Router} router
   * @param {UserEditService} _userEditService
   */
  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private categoryService: CategoryService,
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
    this.categoryForm.reset();
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
        this.categoryForm.get(`image`).patchValue(this.avatarImage);
        console.log(this.categoryForm.value);
        console.log(this.avatarImage);
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }
  get f() {
    return this.categoryForm.controls;
  }

  private editCategory(id: number, data: newCategoryReq): void {
    this.isSubmitLoading = true;
    this.categoryService
      .updateCategory(id, data)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (res) => {
          this.resMessage.message = res.message;
          this.resMessage.code = res.code;
          this.isSubmitLoading = false;

          this.categoryService.setCategoryUpdated(true);
          console.log(res);
        },
        (error) => {
          this.resMessage.message = error.message;
          this.resMessage.code = error.code;
          this.isSubmitLoading = false;
        }
      );
  }

  /**
   * Submit
   *
   * @param form
   */

  submit() {
    this.resMessage.message = "";
    this.submitted = true;
    console.log(this.categoryForm.value);
    if (this.categoryForm.valid) {
      console.log(`test`);
      this.editCategory(this.productId, this.categoryForm.value);
      // this.toggleSidebar("new-user-sidebar");
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this.categoryForm = this._formBuilder.group({
      nameEn: [``, Validators.required],
      nameAr: [``, Validators.required],
      nameEs: [``, Validators.required],
      image: [``, Validators.required],
      isActive: [``, Validators.required], //INACTIVE or Active
    });

    this.route.params
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((params: Params) => {
        this.productId = +params[`id`];
        this.blockUI.start();
        console.log(this.productId);
        this.categoryService
          .getCategoryDetails(this.productId)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(
            (res) => {
              console.log(res, `the res`);
              this.currentRow = res.data;
              this.avatarImage = res.data.image;
              this.categoryForm.patchValue(this.currentRow);
              console.log(res.data, `one data `);
              console.log(this.categoryForm.value);
              this.blockUI.stop();
              console.log(this.categoryForm.value, `the form`);
            },
            (error) => {
              this.blockUI.stop();
            }
          );
        // this.getDetails(this.productId);
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
