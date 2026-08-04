import { describe, it, expect, vi } from "vitest";

vi.mock("../src/repository/product.repository.js", () => ({
  default: {
    createProduct: vi.fn(),
  },
}));

import productRepository from "../src/repository/product.repository.js";
import productService from "../src/services/product.service.js";

describe("Product create product draft", () => {
  it("Should create product draft", async () => {
    vi.mocked(productRepository.createProduct).mockResolvedValue({
      id: "1",
      name: "Dell Laptop",
      status: "draft",
    });

    const result = await productService.createDraft("supplier-1", {
      name: "Dell Laptop",
      category: "Electronics",
      description: "Gaming laptop",
    });

    expect(productRepository.createProduct).toHaveBeenCalled();
  });
});
