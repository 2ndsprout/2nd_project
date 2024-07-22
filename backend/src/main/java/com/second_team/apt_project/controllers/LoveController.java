package com.second_team.apt_project.controllers;

import com.second_team.apt_project.dtos.LoveRequestDTO;
import com.second_team.apt_project.dtos.LoveResponseDTO;
import com.second_team.apt_project.exceptions.DataNotFoundException;
import com.second_team.apt_project.records.TokenRecord;
import com.second_team.apt_project.services.MultiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/love")
public class LoveController {
    private final MultiService multiService;

    @PostMapping("/toggle")
    public ResponseEntity<?> toggleLove(@RequestHeader("ArticleId") Long articleId,
                                        @RequestHeader("Authorization") String accessToken,
                                        @RequestHeader("PROFILE_ID") Long profileId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                LoveResponseDTO responseDTO = multiService.toggleLove(username, articleId, profileId);
                return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @GetMapping("/info")
    public ResponseEntity<?> getLoveInfo(@RequestHeader("ArticleId") Long articleId,
                                         @RequestHeader("Authorization") String accessToken,
                                         @RequestHeader("PROFILE_ID") Long profileId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                LoveResponseDTO responseDTO = multiService.getLoveInfo(articleId, profileId, username);
                return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }
}
