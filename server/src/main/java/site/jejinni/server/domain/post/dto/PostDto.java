package site.jejinni.server.domain.post.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PostDto {

    private String title;
    private String link;
    private String pubDate;
}
