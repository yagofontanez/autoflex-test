import { http } from "./http";

export type RawMaterial = {
  id: number;
  code: string;
  name: string;
  stockQuantity: number;
};

export type RawMaterialCreate = {
  code: string;
  name: string;
  stockQuantity: number;
};

export type RawMaterialUpdate = {
  name: string;
  stockQuantity: number;
};

export async function listRawMaterials(): Promise<RawMaterial[]> {
  const { data } = await http.get<RawMaterial[]>("/raw-materials");
  return data;
}

export async function createRawMaterial(
  payload: RawMaterialCreate,
): Promise<RawMaterial> {
  const { data } = await http.post<RawMaterial>("/raw-materials", payload);
  return data;
}

export async function updateRawMaterial(
  id: number,
  payload: RawMaterialUpdate,
): Promise<RawMaterial> {
  const { data } = await http.put<RawMaterial>(`/raw-materials/${id}`, payload);
  return data;
}

export async function deleteRawMaterial(id: number): Promise<void> {
  await http.delete(`/raw-materials/${id}`);
}
