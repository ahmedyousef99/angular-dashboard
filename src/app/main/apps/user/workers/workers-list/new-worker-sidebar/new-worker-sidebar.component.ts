import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { UserService } from "app/auth/service";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ToastrService } from "ngx-toastr";
import { WorkerListService } from "../worker-list.service";

@Component({
  selector: "app-new-worker-sidebar",
  templateUrl: "./new-worker-sidebar.component.html",
})
export class NewWorkerSidebarComponent implements OnInit {
  public workerForm: FormGroup;
  public passwordTextType: boolean;
  public submitted = false;
  public formMessage: string = ``;
  public isSubmitLoading: boolean = false;
  avatarImage: any;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _formBuilder: FormBuilder,
    private _workerListService: WorkerListService,
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
    return this.workerForm.controls;
  }
  uploadImage(event: any) {
    console.log(event);
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.onload = (event: any) => {
        console.log(typeof event.target.result);

        console.log(event.target.result);
        this.avatarImage = event.target.result;
        this.workerForm.get(`avatar`).patchValue(this.avatarImage);
        console.log(this.workerForm.value);
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
    if (this.workerForm.valid) {
      this.isSubmitLoading = true;
      this._workerListService.createWorker(this.workerForm.value).subscribe(
        (res) => {
          this.isSubmitLoading = false;
          this._coreSidebarService
            .getSidebarRegistry("new-user-sidebar")
            .close();
          this._workerListService.setCustomerUpdated(true);

          this.formMessage = ``;
          this.workerForm.reset();
          this.submitted = false;
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
    this.workerForm = this._formBuilder.group({
      name: [``, [Validators.required]],
      email: [``, [Validators.required, Validators.email]],
      password: [``, Validators.required],
      phone: [``],
      dateOfBirth: [``, Validators.required],
      avatar: [``],
      address: [``],
    });
  }
}
