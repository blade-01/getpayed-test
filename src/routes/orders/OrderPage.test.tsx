import "@testing-library/jest-dom";
import { screen, waitFor } from "@testing-library/react";
import OrderPage from "../../features/orders/OrderPage";
import { renderWithProviders } from "../../../tests/testUtils";

describe("OrderPage", () => {
  it("renders orders from API", async () => {
    renderWithProviders(<OrderPage />, { route: "/orders" });

    // Loading state
    expect(screen.getByText(/Loading orders…/i)).toBeInTheDocument();

    // One row should appear (id: 1 from MSW)
    await waitFor(() => expect(screen.getByText(/ORD|1/)).toBeInTheDocument());
    // Depending on how you display id, match accordingly:
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("$100.00")).toBeInTheDocument();
    expect(screen.getByText(/paid/i)).toBeInTheDocument();
  });
});
