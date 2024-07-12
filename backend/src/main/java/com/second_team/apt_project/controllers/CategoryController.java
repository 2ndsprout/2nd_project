package com.second_team.apt_project.controllers;

import com.second_team.apt_project.dtos.CategoryRequestDTO;
import com.second_team.apt_project.dtos.CategoryResponseDTO;
import com.second_team.apt_project.exceptions.DataNotFoundException;
import com.second_team.apt_project.records.TokenRecord;
import com.second_team.apt_project.services.MultiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/category")
public class CategoryController {
    private final MultiService multiService;

    @PostMapping
    public ResponseEntity<?> saveCategory(@RequestHeader("Authorization") String accessToken,
                                          @RequestHeader("PROFILE_ID") Long profileId,
                                          @RequestBody CategoryRequestDTO requestDTO) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                CategoryResponseDTO responseDTO = multiService.saveCategory(username, requestDTO.getName(), profileId);
                return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @DeleteMapping
    public ResponseEntity<?> deleteCategory(@RequestHeader("Authorization") String accessToken,
                                            @RequestHeader("PROFILE_ID") Long profileId,
                                            @RequestHeader("CategoryId") Long categoryId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                multiService.deleteCategory(categoryId, username, profileId);
                return ResponseEntity.status(HttpStatus.OK).body("문제 없음");
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @GetMapping
    public ResponseEntity<?> getCategory(@RequestHeader("Authorization") String accessToken,
                                         @RequestHeader("PROFILE_ID") Long profileId,
                                         @RequestHeader("CategoryId") Long categoryId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                CategoryResponseDTO categoryResponseDTO = multiService.getCategory(categoryId, username, profileId);
                return ResponseEntity.status(HttpStatus.OK).body(categoryResponseDTO);
            }
        } catch (DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @PutMapping
    private ResponseEntity<?> updateCategory(@RequestHeader("Authorization") String accessToken,
                                             @RequestHeader("PROFILE_ID") Long profileId,
                                             @RequestBody CategoryRequestDTO requestDTO) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                CategoryResponseDTO categoryResponseDTO = multiService.updateCategory(username, profileId,requestDTO.getId(), requestDTO.getName());
                return ResponseEntity.status(HttpStatus.OK).body(categoryResponseDTO);
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }
}
