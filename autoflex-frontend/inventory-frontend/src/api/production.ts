import { http } from "./http";

export type ProductionItem = {
  productId: number;
  productCode: string;
  productName: string;
  unitPrice: number;
  producibleQuantity: number;
  totalValue: number;
};

export type ProductionSuggestionResponse = {
  items: ProductionItem[];
  totalValue: number;
};

export async function getProductionSuggestion(): Promise<ProductionSuggestionResponse> {
  const { data } = await http.get<ProductionSuggestionResponse>(
    "/production/suggestions",
  );
  return data;
}
