import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("../../api/products", () => {
  return {
    listProducts: vi.fn(),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
  };
});

import { listProducts } from "../../api/products";
import { ProductsPage } from "../products/ProductsPage";

describe("ProductsPage", () => {
  it("should load and render product list", async () => {
    vi.mocked(listProducts).mockResolvedValueOnce([
      { id: 1, code: "P001", name: "Notebook", price: 1000 },
      { id: 2, code: "P002", name: "Mouse", price: 50 },
    ]);

    render(<ProductsPage />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    expect(await screen.findByText(/P001/i)).toBeInTheDocument();
    expect(screen.getByText(/Notebook/i)).toBeInTheDocument();
    expect(screen.getByText(/P002/i)).toBeInTheDocument();
  });

  it("should show empty message when there are no products", async () => {
    vi.mocked(listProducts).mockResolvedValueOnce([]);

    render(<ProductsPage />);

    expect(await screen.findByText(/no products yet/i)).toBeInTheDocument();
  });
});
