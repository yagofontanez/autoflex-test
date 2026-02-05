import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

vi.mock("../../api/production", () => {
  return {
    getProductionSuggestion: vi.fn(),
  };
});

import { getProductionSuggestion } from "../../api/production";
import { ProductionPage } from "../production/ProductionPage";

describe("ProductionPage", () => {
  it("should call API and render suggestions table", async () => {
    const user = userEvent.setup();

    vi.mocked(getProductionSuggestion).mockResolvedValueOnce({
      items: [
        {
          productId: 1,
          productCode: "P001",
          productName: "Notebook Gamer",
          unitPrice: 7200,
          producibleQuantity: 2,
          totalValue: 14400,
        },
      ],
      totalValue: 14400,
    });

    render(<ProductionPage />);

    const btn = screen.getByRole("button", { name: /calculate production/i });
    await user.click(btn);

    expect(await screen.findByText("P001")).toBeInTheDocument();
    expect(screen.getByText("Notebook Gamer")).toBeInTheDocument();

    expect(screen.getByText(/total:/i)).toBeInTheDocument();

    expect(getProductionSuggestion).toHaveBeenCalledTimes(1);
  });

  it("should show empty state when API returns no items", async () => {
    const user = userEvent.setup();

    vi.mocked(getProductionSuggestion).mockResolvedValueOnce({
      items: [],
      totalValue: 0,
    });

    render(<ProductionPage />);

    await user.click(
      screen.getByRole("button", { name: /calculate production/i }),
    );

    expect(
      await screen.findByText(/no products can be produced/i),
    ).toBeInTheDocument();
  });
});
