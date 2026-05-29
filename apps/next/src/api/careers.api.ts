import { apiRequest } from "@/lib/api";
import { Careers } from "@/api/careers.types";

export async function getCareers(): Promise<Careers> {
  const response = await apiRequest<Careers>(`/api/careers`);

  return (
    response.data || {
      businesses: [],
      projects: [],
    }
  );
}
