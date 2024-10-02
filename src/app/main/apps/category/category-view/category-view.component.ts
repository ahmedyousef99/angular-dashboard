import { CategoryService } from "./../category.service";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DataDetails } from "../models/category.model";

@Component({
  selector: "app-category-view",
  templateUrl: "./category-view.component.html",
  styleUrls: ["./category-view.component.scss"],
})
export class CategoryViewComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;
  private _unsubscribeAll: Subject<any>;
  private categoryId: number;
  public categoryDetails: DataDetails;
  public contentHeader: object;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((params: Params) => {
        this.categoryId = +params[`id`];
        this.blockUI.start();
        this.categoryService
          .getCategoryDetails(this.categoryId)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(
            (res) => {
              console.log(res, `the res`);
              this.categoryDetails = res.data;
              // this.avatarImage = this.currentRow.avatar;
              // this.customerForm.patchValue(this.currentRow);
              this.blockUI.stop();
              // console.log(this.customerForm.value, `the form`);
            },
            (error) => {
              this.blockUI.stop();
            }
          );
      });
    // this._userViewService.onUserViewChanged
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((response) => {
    //     this.data = response;
    //   });

    this.contentHeader = {
      headerTitle: "Blog Detail",
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Categories",
            isLink: true,
            link: "/",
          },
        ],
      },
    };
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
