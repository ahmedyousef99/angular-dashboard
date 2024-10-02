import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";

@Component({
  selector: "ecommerce-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["../ecommerce-shop.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class EcommerceSidebarComponent implements OnInit {
  // Public
  // public sliderPriceValue = [1, 100];
  @Output() public sliderPriceValue: EventEmitter<any> =
    new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {}
  public onChange(value): void {
    console.log(value);
    this.sliderPriceValue.emit(value);
  }
}
