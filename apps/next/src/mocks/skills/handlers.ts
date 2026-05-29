import { http, HttpResponse } from "msw";
import { mockSkills } from "./data";

export const skillHandlers = [
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/api/skills`, () => {
    return HttpResponse.json({
      success: true,
      data: mockSkills.data, // mockSkills.data로 변경
    });
  }),
];
