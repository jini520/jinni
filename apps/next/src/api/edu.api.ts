import { apiRequest } from "@/lib/api";
import { Edu } from "@/api/edu.types";

export async function getEdu(): Promise<Edu[]> {
  const response = await apiRequest<Edu[]>(`/api/edu`);

  return response.data || [];
}
