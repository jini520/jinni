import { http, HttpResponse } from "msw";
import { mockEdu } from "./data";

export const eduHandlers = [
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/api/edu`, () => {
    return HttpResponse.json({
      success: true,
      data: mockEdu,
    });
  }),
];
