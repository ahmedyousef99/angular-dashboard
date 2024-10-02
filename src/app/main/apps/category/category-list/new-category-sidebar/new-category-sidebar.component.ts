import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { UserService } from "app/auth/service";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ToastrService } from "ngx-toastr";
import { CategoryService } from "../../category.service";
import { Faq } from "app/main/pages/faq/faqs.model";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Category } from "../../models/category.model";

@Component({
  selector: "app-new-category-sidebar",
  templateUrl: "./new-category-sidebar.component.html",
})
export class NewCategorySidebarComponent implements OnInit {
  public categoryForm: FormGroup;
  public passwordTextType: boolean;
  public submitted = false;
  public formMessage: string = ``;
  public isSubmitLoading: boolean = false;
  private _unsubscribeAll: Subject<any>;
  public formType: string;
  public faq: Faq;
  public row: Category;
  @BlockUI("card-section") cardBlockUI: NgBlockUI;
  avatarImage: any;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {
    this._unsubscribeAll = new Subject();
    this.categoryService.getSideBarOpen().subscribe((res) => {
      if (res) {
        this.ngOnInit();
      }
    });
  }
  ngOnInit(): void {
    console.log(`from side bar ngonint`);
    this.categoryForm = this._formBuilder.group({
      nameEn: [``, Validators.required],
      nameEs: [``, Validators.required],
      nameAr: [``, Validators.required],
      image: [``],
    });
    console.log("rowForSub" in localStorage);
    if ("rowForSub" in localStorage) {
      this.row = JSON.parse(localStorage.getItem("rowForSub"));
      const newControl = new FormControl("");
      this.categoryForm.setControl("parentId", newControl);
      this.categoryForm.get("parentId").setValue(this.row.id);
      localStorage.removeItem("rowForSub");
      console.log(this.row, `from new category`);

      // this.formType = localStorage.getItem("formType");
      // console.log(JSON.parse(localStorage.getItem("faq")));
      // this.faq = JSON.parse(localStorage.getItem("faq"));
      // console.log(this.faq, 1212121);
      // console.log(`from if conditions`);
      // this.categoryForm.patchValue(this.faq);
      // localStorage.removeItem("formType");
      // localStorage.removeItem("faq");
    }
  }
  public clearImage(): void {
    this.avatarImage = ``;
    this.categoryForm.get("image").reset();
  }
  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
    this.destroyComponent();
  }
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }
  get f() {
    return this.categoryForm.controls;
  }
  uploadImage(event: any) {
    console.log(event);
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.onload = (event: any) => {
        console.log(typeof event.target.result);

        console.log(event.target.result);
        this.avatarImage = event.target.result;
        this.categoryForm.get(`image`).patchValue(this.avatarImage);

        console.log(this.categoryForm.value);
        console.log(this.avatarImage);
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }
  /**
   * Submit
   *
   * @param form
   */
  submit() {
    this.toastr.success(`The customer  has been created`, "Success!", {
      positionClass: `toast-top-left`,
      toastClass: "toast ngx-toastr",
      closeButton: true,
    });
    this.formMessage = ``;
    this.submitted = true;
    if (this.categoryForm.valid) {
      this.isSubmitLoading = true;
      if (this.formType) {
        // this.categoryService
        //   .updateFaq(this.faq.id, this.categoryForm.value)
        //   .subscribe(
        //     (res) => {
        //       this.isSubmitLoading = false;
        //       console.log(res);
        //       this.categoryService.setFaqsUpdated(true);
        //       this._coreSidebarService
        //         .getSidebarRegistry("new-user-sidebar")
        //         .close();
        //     },
        //     (error) => {
        //       console.log(error);
        //     }
        //   );
      } else {
        this.categoryService
          .createCategory(this.categoryForm.value)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(
            (res) => {
              this.isSubmitLoading = false;
              this._coreSidebarService
                .getSidebarRegistry("new-user-sidebar")
                .close();
              this.categoryService.setCategoryUpdated(true);
              this.destroyComponent();
            },
            (error) => {
              this.isSubmitLoading = false;

              console.log(error);
              this.formMessage = error;
            }
          );
      }
    }
  }
  public destroyComponent() {
    this.categoryForm.reset();
    this.categoryForm.get("image").reset();

    localStorage.removeItem("formType");
    localStorage.removeItem("faq");
    localStorage.removeItem("rowForSub");
    this.formMessage = ``;
    this.isSubmitLoading = false;
    this.formType = ``;
    this.faq = null;
    this.row = null;
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    console.log(`from destroy`);
  }
}
