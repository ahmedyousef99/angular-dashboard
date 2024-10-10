import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";

import { EcommerceService } from "app/main/apps/ecommerce/ecommerce.service";
import { DataServiceRes } from "../models/services.model";

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
  @Output() public onDeleteAction: EventEmitter<any> = new EventEmitter();

  constructor(private _ecommerceService: EcommerceService) {}
  onDeleteItem(id: number): void {
    this.onDeleteAction.emit(id);
  }

  ngOnInit(): void {}
}
