import type {
  ApiResponse,
  Careers,
  PageResponse,
  PortfolioData,
  Project,
  ProjectDetail,
  Skills,
  VelogPost,
} from '@jinni/types';

export type { PortfolioData };

const API_URL = import.meta.env.VITE_API_URL;

async function apiFetch<T>(path: string): Promise<T | undefined> {
  try {
    const res = await fetch(`${API_URL}${path}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const body: ApiResponse<T> = await res.json();
    return body.data;
  } catch (err) {
    console.error(`[portfolio] fetch ${path} failed:`, err);
    return undefined;
  }
}

async function fetchSkills(): Promise<Skills> {
  const data = await apiFetch<Skills>('/api/skills');
  return data ?? { categories: [], skills: [] };
}

async function fetchCareers(): Promise<Careers> {
  const data = await apiFetch<Careers>('/api/careers');
  return data ?? { businesses: [], projects: [] };
}

async function fetchProjects(): Promise<Project[]> {
  const data = await apiFetch<PageResponse<Project>>('/api/projects?page=0&size=20');
  return data?.items ?? [];
}

async function fetchPosts(): Promise<VelogPost[]> {
  const data = await apiFetch<VelogPost[]>('/api/posts');
  return data ?? [];
}

export async function fetchProjectDetail(id: string): Promise<ProjectDetail | undefined> {
  return apiFetch<ProjectDetail>(`/api/projects/${id}`);
}

export async function fetchPortfolioData(): Promise<PortfolioData> {
  const [skills, careers, projects, posts] = await Promise.all([
    fetchSkills(),
    fetchCareers(),
    fetchProjects(),
    fetchPosts(),
  ]);
  return { skills, careers, projects, posts };
}
