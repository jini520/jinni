import { http, HttpResponse } from "msw";
import { mockCertifications } from "./data";

export const certificationHandlers = [
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/api/certifications`, () => {
    return HttpResponse.json({
      success: true,
      data: mockCertifications,
    });
  }),
];
