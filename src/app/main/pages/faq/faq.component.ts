import { Component, OnInit, OnDestroy, ViewEncapsulation } from "@angular/core";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { FAQService } from "app/main/pages/faq/faq.service";
import { Faq } from "./faqs.model";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ToastrService } from "ngx-toastr";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";
import { CoreConfigService } from "@core/services/config.service";

@Component({
  selector: "app-faq",
  templateUrl: "./faq.component.html",
  styleUrls: ["./faq.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class FaqComponent implements OnInit, OnDestroy {
  // public
  public contentHeader: object;
  public data: any;
  public searchText: string;
  public paramsFaqs: {
    userType: "CUSTOMER" | "WORKER";
    page?: number;
    limit?: number;
  };
  public allCustomerFaqs: Faq[];
  public allWorkersFaqs: Faq[];
  public deleteLoader: boolean = false;
  public formMessage: string = "";
  @BlockUI() blockUI: NgBlockUI;

  // private
  private _unsubscribeAll: Subject<any>;
  customerDataForDelete: { id: number };

  /**
   * Constructor
   *
   * @param {FAQService} _faqService
   */
  constructor(
    private _faqService: FAQService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService
  ) {
    this._unsubscribeAll = new Subject();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On Changes
   */
  toggleSidebar(name, type?: string, faq?: Faq): void {
    if (type && faq) {
      localStorage.setItem("formType", type);
      localStorage.setItem("faq", JSON.stringify(faq));
    }
    this._faqService.setSideBarOpen(true);
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  onDeleteFaq(): void {
    this.formMessage = ``;
    this.blockUI.start();
    this._faqService
      .deleteFaq(this.customerDataForDelete.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (res) => {
          this.formMessage = res.message;
          this.blockUI.stop();
          console.log(res);
          this.modalService.dismissAll();
          this.deleteLoader = false;
          this.customerDataForDelete = { id: 0 };
          this.getAllFaqs({ userType: "CUSTOMER" });
          this.getAllFaqs({ userType: "WORKER" });
        },
        (res) => {
          this.blockUI.stop();
          console.log(res);
        }
      );
  }
  ngOnInit(): void {
    this._faqService
      .getFaqsUpdated()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.getAllFaqs({ userType: "CUSTOMER" });
        this.getAllFaqs({ userType: "WORKER" });
      });
    this.getAllFaqs({ userType: "CUSTOMER" });
    this.getAllFaqs({ userType: "WORKER" });

    // content header
    this.contentHeader = {
      headerTitle: "FAQ",
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Home",
            isLink: true,
            link: "/",
          },
          {
            name: "FAQ",
            isLink: false,
          },
        ],
      },
    };
  }

  public modalOpenWarning(modalWarning, id: number) {
    this.customerDataForDelete = { id: id };
    this.modalService.open(modalWarning, {
      centered: true,
      windowClass: "modal modal-warning",
    });
  }

  getAllFaqs(params: {
    userType: "CUSTOMER" | "WORKER";
    page?: number;
    limit?: number;
  }): void {
    this.blockUI.start();
    this._faqService
      .getAllFaqs(params)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (res) => {
          this.blockUI.stop();

          console.log(res);
          if (params.userType === "CUSTOMER") {
            this.allCustomerFaqs = res.data.data;
          } else if (params.userType === "WORKER") {
            this.allWorkersFaqs = res.data.data;
          }
        },
        (error) => {
          this.blockUI.stop();

          console.log(error);
        }
      );
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
