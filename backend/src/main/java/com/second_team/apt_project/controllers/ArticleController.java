package com.second_team.apt_project.controllers;

import com.second_team.apt_project.dtos.ArticleRequestDTO;
import com.second_team.apt_project.dtos.ArticleResponseDTO;
import com.second_team.apt_project.exceptions.DataNotFoundException;
import com.second_team.apt_project.records.TokenRecord;
import com.second_team.apt_project.services.MultiService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/article")
public class ArticleController {
    private final MultiService multiService;

    @PostMapping
    public ResponseEntity<?> saveArticle(@RequestHeader("Authorization") String accessToken,
                                         @RequestHeader("PROFILE_ID") Long profileId,
                                         @RequestBody ArticleRequestDTO articleRequestDTO) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                ArticleResponseDTO articleResponseDTO = this.multiService.saveArticle(profileId,
                        articleRequestDTO.getCategoryId(), articleRequestDTO.getTagId(), articleRequestDTO.getTitle(),
                        articleRequestDTO.getContent(), username, articleRequestDTO.getTopActive());
                return ResponseEntity.status(HttpStatus.OK).body(articleResponseDTO);
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @PutMapping
    public ResponseEntity<?> updateArticle(@RequestHeader("Authorization") String accessToken,
                                           @RequestHeader("PROFILE_ID") Long profileId,
                                           @RequestBody ArticleRequestDTO articleRequestDTO) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                ArticleResponseDTO articleResponseDTO = this.multiService.updateArticle(profileId, articleRequestDTO.getArticleId(),
                        articleRequestDTO.getCategoryId(), articleRequestDTO.getTagId(), articleRequestDTO.getTitle(),
                        articleRequestDTO.getContent(), username, articleRequestDTO.getTopActive());
                return ResponseEntity.status(HttpStatus.OK).body(articleResponseDTO);
            }
        } catch (IllegalArgumentException | DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @GetMapping
    public ResponseEntity<?> articleDetail(@RequestHeader("Authorization") String accessToken,
                                           @RequestHeader("PROFILE_ID") Long profileId,
                                           @RequestHeader(value = "Page", defaultValue = "0") int page,
                                           @RequestHeader("ArticleId") Long articleId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                ArticleResponseDTO articleResponseDTO = this.multiService.articleDetail(articleId, profileId, username, page);
                return ResponseEntity.status(HttpStatus.OK).body(articleResponseDTO);
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @GetMapping("/list")
    public ResponseEntity<?> articleList(@RequestHeader("Authorization") String accessToken,
                                         @RequestHeader("PROFILE_ID") Long profileId,
                                         @RequestHeader(value = "Page", defaultValue = "0") int page,
                                         @RequestHeader("CategoryId") Long categoryId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                Page<ArticleResponseDTO> articleResponseDTOList = this.multiService.articleList(username, page, profileId, categoryId);
                return ResponseEntity.status(HttpStatus.OK).body(articleResponseDTOList);
            }
        } catch (IllegalArgumentException | DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @GetMapping("/topActive")
    public ResponseEntity<?> topActive(@RequestHeader("Authorization") String accessToken,
                                       @RequestHeader("PROFILE_ID") Long profileId,
                                       @RequestHeader("CategoryId") Long categoryId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                List<ArticleResponseDTO> articleResponseDTOList = this.multiService.topActive(username, profileId, categoryId);
                return ResponseEntity.status(HttpStatus.OK).body(articleResponseDTOList);
            }
        } catch (IllegalArgumentException | DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @DeleteMapping
    public ResponseEntity<?> deleteArticle(@RequestHeader("Authorization") String accessToken,
                                           @RequestHeader("PROFILE_ID") Long profileId,
                                           @RequestHeader("ArticleId") Long articleId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                this.multiService.deleteArticle(username, profileId, articleId);
                return ResponseEntity.status(HttpStatus.OK).body("문제 없음");
            }
        } catch (IllegalArgumentException | DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }
}
