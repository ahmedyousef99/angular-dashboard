import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ToastrService } from "ngx-toastr";
import { FAQService } from "../faq.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Faq } from "../faqs.model";

@Component({
  selector: "app-new-faq-sidebar",
  templateUrl: "./new-faq-sidebar.component.html",
})
export class NewFaqSidebarComponent implements OnInit, OnDestroy {
  public workerForm: FormGroup;
  public passwordTextType: boolean;
  public submitted = false;
  public formMessage: string = ``;
  public isSubmitLoading: boolean = false;
  private _unsubscribeAll: Subject<any>;
  public formType: string;
  public faq: Faq;
  @BlockUI("card-section") cardBlockUI: NgBlockUI;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _formBuilder: FormBuilder,
    private _faqService: FAQService,
    private toastr: ToastrService
  ) {
    this._unsubscribeAll = new Subject();
    this._faqService.getSideBarOpen().subscribe((res) => {
      if (res) {
        this.ngOnInit();
      }
    });
  }
  ngOnInit(): void {
    console.log(`from side bar ngonint`);
    this.workerForm = this._formBuilder.group({
      questionEn: [``, Validators.required],
      questionEs: [``, Validators.required],
      questionAr: [``, Validators.required],
      answerEs: [``, Validators.required],
      answerEn: [``, Validators.required],
      answerAr: [``, Validators.required],
      userType: [`CUSTOMER`, Validators.required],
    });
    console.log("formType" in localStorage && "faq" in localStorage);
    if ("formType" in localStorage && "faq" in localStorage) {
      this.formType = localStorage.getItem("formType");
      console.log(JSON.parse(localStorage.getItem("faq")));
      this.faq = JSON.parse(localStorage.getItem("faq"));
      console.log(this.faq, 1212121);
      console.log(`from if conditions`);
      this.workerForm.patchValue(this.faq);
      localStorage.removeItem("formType");
      localStorage.removeItem("faq");
    }
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
    return this.workerForm.controls;
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
    if (this.workerForm.valid) {
      this.isSubmitLoading = true;
      if (this.formType) {
        this._faqService
          .updateFaq(this.faq.id, this.workerForm.value)
          .subscribe(
            (res) => {
              this.isSubmitLoading = false;
              console.log(res);
              this._faqService.setFaqsUpdated(true);
              this._coreSidebarService
                .getSidebarRegistry("new-user-sidebar")
                .close();
            },
            (error) => {
              console.log(error);
            }
          );
      } else {
        this._faqService
          .createFaq(this.workerForm.value)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(
            (res) => {
              this.isSubmitLoading = false;
              this._coreSidebarService
                .getSidebarRegistry("new-user-sidebar")
                .close();
              this._faqService.setFaqsUpdated(true);
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
    this.workerForm.reset();
    localStorage.removeItem("formType");
    localStorage.removeItem("faq");
    this.formMessage = ``;
    this.isSubmitLoading = false;
    this.formType = ``;
    this.faq = null;
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    console.log(`from destroy`);
  }
}
