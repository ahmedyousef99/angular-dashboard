export class SearchFakeData {
  public static search = [
    {
      groupTitle: "Pages",
      searchLimit: 4,
      bookmarkLimit: 6,
      data: [
        {
          id: "Services",
          title: "Services",
          translate: "MENU.APPS.ECOMMERCE.SHOP",
          type: "item",
          icon: "activity",
          url: "apps/services/services-list",
        },
        {
          id: "admins",
          title: "Admins",
          translate: "MENU.APPS.USER.COLLAPSIBLE",
          type: "item",
          icon: "user-plus",
          url: "apps/user/admin-list",
        },
        {
          id: "workers",
          title: "Workers",
          translate: "MENU.APPS.USER.COLLAPSIBLE",
          type: "item",
          icon: "tool",
          url: "apps/user/worker-list",
        },
        {
          id: "Categories",
          title: "Categories",
          translate: "MENU.APPS.USER.COLLAPSIBLE",
          type: "item",
          icon: "layers",
          url: "apps/user/category-list",
        },
        {
          id: "Bookings",
          title: "Bookings",
          translate: "MENU.APPS.USER.COLLAPSIBLE",
          type: "item",
          icon: "bookmark",
          url: "apps/user/booking-list",
        },
        {
          id: "Canceled Bookings",
          title: "Canceled Bookings",
          translate: "MENU.APPS.USER.COLLAPSIBLE",
          type: "item",
          icon: "x-circle",
          url: "apps/user/booking-cancellation-list",
        },
      ],
    },
  ];
}
