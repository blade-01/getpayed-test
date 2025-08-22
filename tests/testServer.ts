import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

export const server = setupServer(
  http.get("http://localhost:4000/kpis", () =>
    HttpResponse.json([
      { date: "2025-08-15", revenue: 100, orders: 1, activeCustomers: 1 }
    ])
  ),
  http.get("http://localhost:4000/orders", ({ request }) => {
    // Return 1 order by default; you can branch on URLSearchParams here if needed
    return HttpResponse.json(
      [
        {
          id: "1",
          customerId: "C-1",
          amount: 100,
          status: "paid",
          date: "2025-08-15",
          productCategory: "Laptop",
          channel: "web",
          currency: "USD"
        }
      ],
      { headers: { "X-Total-Count": "1" } }
    );
  })
);
