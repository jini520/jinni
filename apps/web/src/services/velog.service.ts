import { DOMParser } from "@xmldom/xmldom";
import { VelogPost } from "@/types/velog.types";
import { parseRSSDate } from "@/lib/parseDate";

export const fetchVelogPost = async (): Promise<VelogPost[]> => {
  try {
    const rssUrl = process.env.NEXT_PUBLIC_BLOG_RSS_URL;
    const username = process.env.NEXT_PUBLIC_BLOG_USERNAME;
    
    if (!rssUrl || !username) {
      console.log(rssUrl, username)
      console.error("rss url or username is not configured");
      return [];
    }

    const response = await fetch(`${rssUrl}/${username}`, {
      next: { revalidate: 60 * 60 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Velog posts");
    }

    const xmlText = await response.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    const items = xmlDoc.getElementsByTagName("item");

    const posts = Array.from(items).map((item) => ({
      title: item.getElementsByTagName("title")[0].textContent || "",
      link: item.getElementsByTagName("link")[0].textContent || "",
      pubDate: parseRSSDate(
        item.getElementsByTagName("pubDate")[0].textContent || "",
      ),
    }));

    return posts;
  } catch (error) {
    console.error("Error fetching Velog posts:", error);
    return [];
  }
};
