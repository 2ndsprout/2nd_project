package com.second_team.apt_project.controllers;

import com.second_team.apt_project.dtos.ArticleRequestDTO;
import com.second_team.apt_project.dtos.ArticleResponseDTO;
import com.second_team.apt_project.exceptions.DataNotFoundException;
import com.second_team.apt_project.records.TokenRecord;
import com.second_team.apt_project.services.MultiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        } catch (DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @GetMapping
    public ResponseEntity<?> articleDetail(@RequestHeader("Authorization") String accessToken,
                                           @RequestHeader("PROFILE_ID") Long profileId,
                                           @RequestHeader("ArticleId") Long articleId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                ArticleResponseDTO articleResponseDTO = this.multiService.articleDetail(articleId, profileId, username);
                return ResponseEntity.status(HttpStatus.OK).body(articleResponseDTO);
            }
        } catch (DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }
}
