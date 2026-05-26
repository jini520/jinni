import { apiRequest } from "@/lib/api";
import { Certifications } from "@/api/certifications.types";

export async function getCertifications(): Promise<Certifications> {
  const response = await apiRequest<Certifications>(`/api/certifications`);

  return (
    response.data || {
      certifications: [],
      awards: [],
    }
  );
}
