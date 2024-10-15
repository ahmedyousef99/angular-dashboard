import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { Subject } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";
import { CoreConfigService } from "@core/services/config.service";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CategoryService } from "app/main/apps/user/categories/category.service";
import { Category } from "app/main/apps/ecommerce/models/services.model";
import { AllCategories } from "../../models/category.model";

@Component({
  selector: "app-category-list",
  templateUrl: "./category-list.component.html",
  styleUrls: ["./category-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CategoryListComponent implements OnInit {
  public categoryForm: FormGroup;
  public submitted = false;
  public formMessage: string = "";
  public isSubmitLoading: boolean = false;
  public formType: string = ``;
  public row: Category;
  public avatarImage: any;
  public mainCatName: string = "";
  public filter: { page: number; limit: number };

  public contentHeader: object;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  public searchControl = new FormControl("");
  customerDataForDelete: { id: number; name: string };
  deleteLoader: boolean = false;
  page: { pageNumber: number; size: number } = { pageNumber: 1, size: 10 };
  @BlockUI() blockUI: NgBlockUI;
  rows: Category[] = [];
  ColumnMode = ColumnMode;
  comingData: AllCategories;
  secondRows: Category[] = [];
  private _unsubscribeAll: Subject<any> = new Subject();
  searchValues: string;
  searchInput: any;
  public modalForm: any = null;
  catId: any = 0;
  constructor(
    private _categoryListService: CategoryService,
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: "Bookings",
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Bookings List",
            isLink: false,
          },
        ],
      },
    };
    this.categoryForm = this._formBuilder.group({
      nameEn: ["", Validators.required],
      nameEs: ["", Validators.required],
      nameAr: ["", Validators.required],
      image: ["", Validators.required],
    });
    this.searchControl.valueChanges.pipe(debounceTime(500)).subscribe((res) => {
      console.log(res, `seaaaarch`);
      this.searchValues = null;
      this.searchInput = res;

      if (res.length > 0) {
        this.rows = [];
        // this.getCustomersList({}, { search: res });
      } else {
        this.getCategoryList();
      }
    });

    this._coreConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        const delay = config.layout.animation === "zoomIn" ? 450 : 0;
        setTimeout(() => this.getCategoryList(), delay);
      });
  }
  public clearImage(): void {
    this.avatarImage = "";
    this.categoryForm.get("image").reset();
  }
  get f() {
    return this.categoryForm.controls;
  }
  uploadImage(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.avatarImage = e.target.result;
        this.categoryForm.get("image").patchValue(this.avatarImage);
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  submit(): void {
    this.formMessage = ``;
    this.submitted = true;
    if (this.categoryForm.valid) {
      this.isSubmitLoading = true;
      if (this.formType) {
        this.updateCategory();
      } else {
        this.createCategory();
      }
    }
  }
  private updateCategory(): void {
    this.blockUI.start();
    this._categoryListService
      .updateCategory(this.catId, this.categoryForm.value)
      .subscribe(
        (res) => {
          this.blockUI.stop();
          this.onCloseModal();
          this.handleSuccess();

          this.getCategoryList();
          this.isSubmitLoading = false;
        },
        (error) => {
          this.blockUI.stop();
          this.handleError(error);

          this.isSubmitLoading = false;
        }
      );
  }
  private createCategory(): void {
    this.blockUI.start();
    this._categoryListService
      .createCategory(this.categoryForm.value)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (res) => {
          this.blockUI.stop();
          this.onCloseModal();

          this.getCategoryList();
          this.isSubmitLoading = false;
        },
        (error) => {
          this.blockUI.stop();

          this.isSubmitLoading = false;
        }
      );
  }
  private handleSuccess(): void {
    this.isSubmitLoading = false;
    this.toastr.success("The customer has been created", "Success!", {
      positionClass: "toast-top-left",
      toastClass: "toast ngx-toastr",
      closeButton: true,
    });
  }

  private handleError(error: any): void {
    this.isSubmitLoading = false;
    this.formMessage = error;
    console.error(error);
  }

  public modalOpenForm(modalForm, type?: string, row?: Category) {
    this.modalForm = modalForm;
    if (type === "newSub") {
      this.categoryForm.addControl("parentId", new FormControl(""));
      this.categoryForm.get("parentId")?.setValue(row.id);
      this.mainCatName = row.nameEn;
    } else if (type === "edit") {
      if (row.parentId) {
        this.categoryForm.addControl("parentId", new FormControl(""));
        this.categoryForm.get("parentId")?.setValue(row.parentId);
      }
      this.catId = row.id;
      this.categoryForm.addControl("isActive", new FormControl(""));
      this.categoryForm.get("isActive").setValue(row.isActive);
      this.formType = type;
      this.categoryForm.get("nameEn").patchValue(row.nameEn);
      this.categoryForm.get("nameEs").patchValue(row.nameEs);
      this.categoryForm.get("nameAr").patchValue(row.nameAr);
      this.categoryForm.get("image").patchValue(row.image);
      this.avatarImage = row.image;
    }
    this.modalService.open(modalForm, { backdrop: "static" });
    console.log(this.categoryForm.value);
  }

  public setPage(pageInfo): void {
    this.page.pageNumber = pageInfo.offset;
    this.filter.page = this.page.pageNumber + 1;
    this.filter.limit = this.page.size;
    this.getCategoryList(this.filter);
  }

  toggleSidebar(name: string, row?: Category): void {
    localStorage.removeItem("rowForSub");
    if (row) {
      localStorage.setItem("rowForSub", JSON.stringify(row));
    }
    this._categoryListService.setSideBarOpen(true);
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  onSelectChange(event: Event): void {
    const perPage = (event.target as HTMLSelectElement).value;
    this.page.size = +perPage;
    this.getCategoryList({
      page: this.page.pageNumber,
      limit: this.page.size,
    });
  }

  getCategoryList(searchData?: { page?: number; limit?: number }): void {
    this.blockUI.start();
    this._categoryListService
      .getAllCategories(searchData)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        console.log(res);
        this.blockUI.stop();
        this.comingData = res;
        this.rows = this.comingData.data.data;
        console.log(this.rows);
        this.secondRows = [...this.rows]; // Preserve original rows for tree action
      });
  }

  onTreeAction(event: any): void {
    const gotRow = event.row;

    // Toggle the tree status of the clicked row
    if (gotRow.treeStatus === "collapsed") {
      gotRow.treeStatus = "expanded";

      // If there are subcategories, add them to the rows
      if (gotRow.subCategoryList) {
        // Set the initial status of subcategories to collapsed
        // Add subcategories to rows without affecting others
        this.rows = [...this.rows, ...gotRow.subCategoryList];
      }
    } else {
      gotRow.treeStatus = "collapsed";

      // Remove subcategories from the rows when collapsing
      if (gotRow.subCategoryList) {
        this.rows = this.rows.filter(
          (row) => !gotRow.subCategoryList.some((sub) => sub.id === row.id)
        );
      }
    }

    // Refresh rows to trigger change detection
    this.rows = [...this.rows];
  }

  modalOpenWarning(modalWarning, id: number, name: string): void {
    this.customerDataForDelete = { id, name };
    this.modalService.open(modalWarning, {
      centered: true,
      windowClass: "modal modal-warning",
    });
  }

  onDelete(): void {
    this.deleteLoader = true;
    this._categoryListService
      .deleteCategory(this.customerDataForDelete.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.modalService.dismissAll();
        this.deleteLoader = false;
        this.customerDataForDelete = { id: 0, name: "" };
        this.getCategoryList();
        this.toastr.success(
          `The customer ${this.customerDataForDelete.name} has been deleted`,
          "Success!",
          {
            toastClass: "toast ngx-toastr",
            closeButton: true,
          }
        );
      });
  }
  public destroyComponent(): void {
    this.categoryForm.reset();
    this.clearImage();
    localStorage.removeItem("formType");
    localStorage.removeItem("faq");
    localStorage.removeItem("rowForSub");
    this.formMessage = "";
    this.isSubmitLoading = false;
    this.formType = "";
    this.row = null;
    this.submitted = false;
    this.mainCatName = ``;
    this.categoryForm.removeControl("parentId");
    this.categoryForm.removeControl("isActive");
  }
  public onCloseModal(): void {
    this.modalService.dismissAll();
    this.destroyComponent();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
