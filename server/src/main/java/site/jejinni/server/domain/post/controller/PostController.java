package site.jejinni.server.domain.post.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import site.jejinni.server.global.response.ApiResponse;
import site.jejinni.server.domain.post.dto.PostDto;
import site.jejinni.server.domain.post.service.PostService;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService velogService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PostDto>>> getPosts() {
        return ResponseEntity.ok(velogService.getPosts());
    }
}
