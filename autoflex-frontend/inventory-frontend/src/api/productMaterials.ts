import { http } from "./http";

export type ProductMaterial = {
  id: number;
  productId: number;
  rawMaterialId: number;
  rawMaterialCode: string;
  rawMaterialName: string;
  requiredQuantity: number;
};

export type ProductMaterialCreate = {
  rawMaterialId: number;
  requiredQuantity: number;
};

export type ProductMaterialUpdate = {
  requiredQuantity: number;
};

export async function listProductMaterials(
  productId: number,
): Promise<ProductMaterial[]> {
  const { data } = await http.get<ProductMaterial[]>(
    `/products/${productId}/materials`,
  );
  return data;
}

export async function addProductMaterial(
  productId: number,
  payload: ProductMaterialCreate,
): Promise<ProductMaterial> {
  const { data } = await http.post<ProductMaterial>(
    `/products/${productId}/materials`,
    payload,
  );
  return data;
}

export async function updateProductMaterial(
  productId: number,
  productMaterialId: number,
  payload: ProductMaterialUpdate,
): Promise<ProductMaterial> {
  const { data } = await http.put<ProductMaterial>(
    `/products/${productId}/materials/${productMaterialId}`,
    payload,
  );
  return data;
}

export async function deleteProductMaterial(
  productId: number,
  productMaterialId: number,
): Promise<void> {
  await http.delete(`/products/${productId}/materials/${productMaterialId}`);
}
