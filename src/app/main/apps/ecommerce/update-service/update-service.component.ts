import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Params } from "@angular/router";
import { EcommerceService } from "../ecommerce.service";
import { Data, UpdateServiceBody } from "../models/services-details.model";
import { takeUntil } from "rxjs/operators";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { Subject } from "rxjs";
import { Category } from "app/main/apps/category/models/category.model";
import { CategoryService } from "../../category/category.service";

@Component({
  selector: "app-update-service",
  templateUrl: "./update-service.component.html",
  styleUrls: ["./update-service.component.scss"],
})
export class UpdateServiceComponent implements OnInit, OnDestroy {
  public contentHeader: object;
  public categoryList: Category[] = [];
  public subCategoryList: any[] = []; // Adjust this based on your subcategory structure
  public selectedCategoryId: number | null = null; // Track the selected category
  public servicesId: number = 0;
  public dataServices: Data;
  public updateServiceBody: UpdateServiceBody = {} as null;
  public successUpdateMessage: string = ``;
  public errorUpdateMessage: string = ``;
  workingTimeForm: FormGroup;
  imageForm: FormGroup;
  serviceDetailsForm: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
  private _unsubscribeAll: Subject<any>;
  success;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _ecommerceService: EcommerceService,
    private categoryService: CategoryService
  ) {
    this._unsubscribeAll = new Subject();
    console.log(this.subCategoryList.length);

    // Initialize forms
    this.workingTimeForm = this.fb.group({
      serviceWorkingTimeList: this.fb.array([]),
    });

    this.imageForm = this.fb.group({
      serviceImageList: this.fb.array([]),
    });

    this.serviceDetailsForm = this.fb.group({
      categoryId: ["", Validators.required],
      subCategoryId: ["00", Validators.required],
      nameEn: ["", Validators.required],
      nameEs: [""],
      nameAr: [""],
      descriptionEn: [""],
      descriptionEs: [""],
      descriptionAr: [""],
      price: ["", Validators.required],
      yearsOfExperience: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.updateServiceBody.deletedServiceWorkingTimeIdsList = [];
    this.updateServiceBody.deletedServiceImagesIdsList = [];
    this.loadCategories();
    this.route.params
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((params: Params) => {
        console.log(params);
        this.servicesId = +params[`id`];
        console.log(this.servicesId);
        this.blockUI.start();
        this._ecommerceService
          .getServiceDetails(this.servicesId)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(
            (res) => {
              this.blockUI.stop();

              console.log(res, `the res`);
              this.dataServices = res.data;
              // Patch values to the forms
              this.serviceDetailsForm.patchValue({
                categoryId: this.dataServices.categoryId,
                subCategoryId: this.dataServices.subCategoryId,
                nameEn: this.dataServices.nameEn,
                nameEs: this.dataServices.nameEs,
                nameAr: this.dataServices.nameAr,
                price: this.dataServices.price,
                yearsOfExperience: this.dataServices.yearsOfExperience,
                descriptionEn: this.dataServices.descriptionEn,
                descriptionEs: this.dataServices.descriptionEs,
                descriptionAr: this.dataServices.descriptionAr,
              });

              // Patch service working times
              this.dataServices.serviceWorkingTimeList.forEach((time) => {
                const workingTimeGroup = this.fb.group({
                  dayKey: [time.dayKey, Validators.required],
                  startingHour: [time.startingHour, Validators.required],
                  endingHour: [time.endingHour, Validators.required],
                  id: [time.id],
                });
                this.serviceWorkingTimeList.push(workingTimeGroup);
              });
              // Patch service images
              this.dataServices.serviceImageList.forEach((image) => {
                const imageGroup = this.fb.group({
                  image: [image.image, Validators.required],
                  serviceId: [image.serviceId],
                  id: [image.id],
                });
                this.serviceImageList.push(imageGroup);
              });
            },
            (error) => {
              this.blockUI.stop();
            }
          );
      });
    // Add an initial working time and image entry

    this.contentHeader = {
      headerTitle: "Services",
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Services List",
            isLink: true,
            link: `/apps/e-commerce/shop`,
          },
          {
            name: " Update Services",
            isLink: false,
          },
        ],
      },
    };
  }
  private loadCategories(): void {
    this.categoryService
      .getAllCategories()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.categoryList = res.data.data;
        this.loadSubCategories(this.categoryList[0].id);
      });
  }

  // Working Time Methods
  get serviceWorkingTimeList(): FormArray {
    return this.workingTimeForm.get("serviceWorkingTimeList") as FormArray;
  }

  addWorkingTime(): void {
    const workingTimeGroup = this.fb.group({
      id: [""],
      dayKey: ["", Validators.required],
      startingHour: ["", Validators.required],
      endingHour: ["", Validators.required],
    });
    this.serviceWorkingTimeList.push(workingTimeGroup);
  }

  removeWorkingTime(index: number): void {
    console.log(this.serviceWorkingTimeList.at(index).value);
    if (this.serviceWorkingTimeList.at(index).value.id) {
      this.updateServiceBody.deletedServiceWorkingTimeIdsList.push(
        this.serviceWorkingTimeList.at(index).value.id
      );
    }

    console.log(this.updateServiceBody);
    this.serviceWorkingTimeList.removeAt(index);
  }

  onSubmitWorkingTime(): void {
    this.workingTimeForm.disable();
    console.log(this.workingTimeForm.value.serviceWorkingTimeList);
    // Handle the submission logic here, like sending it to your API
    if (this.workingTimeForm.value.serviceWorkingTimeList) {
      this.updateServiceBody.serviceWorkingTimeList =
        this.workingTimeForm.value.serviceWorkingTimeList;
    }
    console.log(this.updateServiceBody);
  }

  // Image Methods
  get serviceImageList(): FormArray {
    return this.imageForm.get("serviceImageList") as FormArray;
  }

  addImage(): void {
    const imageGroup = this.fb.group({
      image: [``, Validators.required],
      serviceId: [`${this.servicesId}`],
      id: [``],
    });
    this.serviceImageList.push(imageGroup);
  }
  removeImage(index: number): void {
    console.log(this.serviceImageList.at(index).value.id);
    if (this.serviceImageList.at(index).value.id) {
      this.updateServiceBody.deletedServiceImagesIdsList.push(
        this.serviceImageList.at(index).value.id
      );
    }

    console.log(this.updateServiceBody);
    this.serviceImageList.removeAt(index);
  }
  onFileChange(event: Event, index: number): void {
    const file = (event.target as HTMLInputElement).files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

      if (!allowedTypes.includes(file.type)) {
        alert("Invalid file type. Please select a JPEG, PNG, or GIF image.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        // Save the base64 string or file object as needed
        this.serviceImageList.at(index).get("image").setValue(reader.result); // Set base64 string
      };
      reader.readAsDataURL(file); // Convert to base64
    }
  }

  onSubmitImages(): void {
    this.imageForm.disable();
    console.log(this.imageForm.value);
    // Handle the submission logic here, like sending it to your API
    this.updateServiceBody.images = this.imageForm.value.serviceImageList
      .map((item) => item.image)
      .filter((image) => image); // Filter out falsy values
    console.log(this.updateServiceBody);
  }

  // Service Details Methods
  onSubmitDetails(): void {
    console.log(this.serviceDetailsForm.value);
    const formValue = this.serviceDetailsForm.value;
    this.updateServiceBody.categoryId = formValue.categoryId;
    if (formValue.subCategoryId && formValue.subCategoryId != "00") {
      this.updateServiceBody.subCategoryId = formValue.subCategoryId;
    } else {
      this.updateServiceBody.subCategoryId = null;
    }
    this.updateServiceBody.nameEn = formValue.nameEn;
    this.updateServiceBody.nameEs = formValue.nameEs;
    this.updateServiceBody.nameAr = formValue.nameAr;
    this.updateServiceBody.price = formValue.price;
    this.updateServiceBody.yearsOfExperience = formValue.yearsOfExperience;
    this.updateServiceBody.descriptionEn = formValue.descriptionEn;
    this.updateServiceBody.descriptionEs = formValue.descriptionEs;
    this.updateServiceBody.descriptionAr = formValue.descriptionAr;
    console.log(this.updateServiceBody);
    this.serviceDetailsForm.disable();

    // Handle the submission logic here, like sending it to your API
  }
  onCategoryChange(categoryId: number): void {
    this.selectedCategoryId = categoryId;
    // Load subcategories based on the selected category
    this.loadSubCategories(categoryId);
  }

  public onSubCategoryChange(subCategoryId: any): void {
    console.log(subCategoryId);
  }

  private loadSubCategories(categoryId: number): void {
    this.serviceDetailsForm.get("subCategoryId").setValue("00");
    const selectedCategory = this.categoryList.find(
      (category) => category.id == categoryId
    );

    if (selectedCategory && selectedCategory.subCategoryList) {
      // Reset subcategory value
      this.subCategoryList = selectedCategory.subCategoryList; // Assuming subCategories is an array in the category object
      console.log(this.subCategoryList);
    } else {
      this.subCategoryList = []; // Clear subcategories if none found
    }
  }

  public onUpdateService(): void {
    this.successUpdateMessage = ``;
    this.errorUpdateMessage = ``;
    this.blockUI.start();
    this._ecommerceService
      .updateService(this.servicesId, this.updateServiceBody)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (res) => {
          console.log(res);
          this.successUpdateMessage = res.message;
          this.blockUI.stop();
        },
        (error) => {
          this.errorUpdateMessage = error;
          this.blockUI.stop();
        }
      );
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
