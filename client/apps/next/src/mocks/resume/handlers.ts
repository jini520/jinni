import { http, HttpResponse } from "msw";

export const resumeHandlers = [
  http.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/resumes/latest`,
    async () => {
      try {
        const response = await fetch("/제진명_이력서.pdf");

        if (!response.ok) {
          throw new Error("Failed to fetch resume");
        }

        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();

        const filename = "제진명_이력서.pdf";
        const encodedFilename = encodeURIComponent(filename);

        return HttpResponse.arrayBuffer(arrayBuffer, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename*=UTF-8''${encodedFilename}`,
          },
        });
      } catch (error) {
        console.error("Error fetching resume:", error);
        return HttpResponse.json(
          {
            success: false,
            error: "Failed to fetch resume",
          },
          { status: 500 }
        );
      }
    }
  ),
];
