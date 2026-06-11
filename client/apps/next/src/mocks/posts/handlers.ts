import { http, HttpResponse } from "msw";
import { mockPosts } from "./data";

export const postHandlers = [
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, () => {
    return HttpResponse.json({
      success: true,
      data: mockPosts,
    });
  }),
];
