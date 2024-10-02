import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";

import { EcommerceService } from "app/main/apps/ecommerce/ecommerce.service";
import { DataServiceRes } from "../services.model";

@Component({
  selector: "app-ecommerce-item",
  templateUrl: "./ecommerce-item.component.html",
  styleUrls: ["./ecommerce-item.component.scss"],
  encapsulation: ViewEncapsulation.None,
  host: { class: "ecommerce-application" },
})
export class EcommerceItemComponent implements OnInit {
  // Input Decorotor
  @Input() product: DataServiceRes;

  // Public

  /**
   *
   * @param {EcommerceService} _ecommerceService
   */
  constructor(private _ecommerceService: EcommerceService) {}

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Wishlist
   *
   * @param product
   */

  /**
   * Add To Cart
   *
   * @param product
   */

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  ngOnInit(): void {}
}
