import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";

import { SwiperConfigInterface } from "ngx-swiper-wrapper";

import { EcommerceService } from "app/main/apps/ecommerce/ecommerce.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { Data } from "../models/services-details.model";
import { ColumnMode } from "@swimlane/ngx-datatable";

@Component({
  selector: "app-ecommerce-details",
  templateUrl: "./ecommerce-details.component.html",
  styleUrls: ["./ecommerce-details.component.scss"],
  encapsulation: ViewEncapsulation.None,
  host: { class: "ecommerce-application" },
})
export class EcommerceDetailsComponent implements OnInit, OnDestroy {
  // public
  public contentHeader: object;
  public product;
  public wishlist;
  public cartList;
  public relatedProducts;
  private _unsubscribeAll: Subject<any>;
  public serviceId: number;
  public dataServices: Data;
  public mainImage: string = ``;
  public selectedId: number = 0;
  public ColumnMode = ColumnMode;

  @BlockUI() blockUI: NgBlockUI;

  // Swiper
  public swiperResponsive: SwiperConfigInterface = {
    slidesPerView: 3,
    spaceBetween: 50,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      1024: {
        slidesPerView: 3,
        spaceBetween: 40,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
    },
  };

  /**
   * Constructor
   *
   * @param {EcommerceService} _ecommerceService
   */
  constructor(
    private _ecommerceService: EcommerceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Wishlist
   *
   * @param product
   */
  toggleWishlist(product) {
    if (product.isInWishlist === true) {
      this._ecommerceService.removeFromWishlist(product.id).then((res) => {
        product.isInWishlist = false;
      });
    } else {
      this._ecommerceService.addToWishlist(product.id).then((res) => {
        product.isInWishlist = true;
      });
    }
  }

  /**
   * Add To Cart
   *
   * @param product
   */
  addToCart(product) {
    this._ecommerceService.addToCart(product.id).then((res) => {
      product.isInCart = true;
    });
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
        this.serviceId = +params[`id`];
        this.blockUI.start();
        this._ecommerceService
          .getServiceDetails(this.serviceId)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(
            (res) => {
              console.log(res, `the res`);
              this.dataServices = res.data;
              this.mainImage = this.dataServices.mainImage;
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

    // Subscribe to Selected Product change
    this._ecommerceService.onSelectedProductChange.subscribe((res) => {
      this.product = res[0];
    });

    // Subscribe to Wishlist change
    this._ecommerceService.onWishlistChange.subscribe(
      (res) => (this.wishlist = res)
    );

    // Subscribe to Cartlist change
    this._ecommerceService.onCartListChange.subscribe(
      (res) => (this.cartList = res)
    );

    // Get Related Products
    this._ecommerceService.getRelatedProducts().then((response) => {
      this.relatedProducts = response;
    });

    this.product.isInWishlist =
      this.wishlist.findIndex((p) => p.productId === this.product.id) > -1;
    this.product.isInCart =
      this.cartList.findIndex((p) => p.productId === this.product.id) > -1;

    // content header
    this.contentHeader = {
      headerTitle: "Services Details",
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Services",
            isLink: true,
            link: "/",
          },
          {
            name: " Services Details",
            isLink: false,
          },
        ],
      },
    };
  }
  public onImageChange(image: { image: string; id: number }): void {
    console.log(image);
    this.mainImage = image.image;
    console.log(this.mainImage);
    this.selectedId = image.id;
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
