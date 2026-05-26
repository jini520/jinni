import { apiRequest } from "@/lib/api";
import { Skills } from "@/api/skills.types";

export async function getSkills(): Promise<Skills> {
  const response = await apiRequest<Skills>("/api/skills");

  return (
    response.data || {
      categories: [],
      skills: [],
    }
  );
}
