import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import DashboardPage from "../../features/dashboard/DashboardPage";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function renderWithProviders(ui: React.ReactNode) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={ui as any} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

test("renders KPIs from API", async () => {
  renderWithProviders(<DashboardPage />);
  expect(screen.getByText(/Loading KPIs…/i)).toBeInTheDocument();
  await waitFor(() => expect(screen.getByText(/Revenue/i)).toBeInTheDocument());
});
