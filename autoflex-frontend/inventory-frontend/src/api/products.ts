import { http } from "./http";

export type Product = {
  id: number;
  code: string;
  name: string;
  price: number;
};

export type ProductCreate = {
  code: string;
  name: string;
  price: number;
};

export type ProductUpdate = {
  name: string;
  price: number;
};

export async function listProducts(): Promise<Product[]> {
  const { data } = await http.get<Product[]>("/products");
  return data;
}

export async function createProduct(payload: ProductCreate): Promise<Product> {
  const { data } = await http.post<Product>("/products", payload);
  return data;
}

export async function updateProduct(
  id: number,
  payload: ProductUpdate,
): Promise<Product> {
  const { data } = await http.put<Product>(`/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id: number): Promise<void> {
  await http.delete(`/products/${id}`);
}
