package com.second_team.apt_project.controllers;

import com.second_team.apt_project.dtos.LessonRequestDTO;
import com.second_team.apt_project.dtos.LessonResponseDTO;
import com.second_team.apt_project.exceptions.DataNotFoundException;
import com.second_team.apt_project.records.TokenRecord;
import com.second_team.apt_project.services.MultiService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/lesson")
public class LessonController {
    private final MultiService multiService;

    @PostMapping
    public ResponseEntity<?> saveLesson(@RequestHeader("Authorization") String accessToken,
                                        @RequestHeader("PROFILE_ID") Long profileId,
                                        @RequestBody LessonRequestDTO requestDTO) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                LessonResponseDTO responseDTO = multiService.saveLesson(username, profileId, requestDTO.getCenterId(), requestDTO.getName(),
                        requestDTO.getContent(), requestDTO.getStartDate(), requestDTO.getEndDate(), requestDTO.getStartTime(), requestDTO.getEndTime());
                return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @GetMapping
    public ResponseEntity<?> getLesson(@RequestHeader("Authorization") String accessToken,
                                       @RequestHeader("PROFILE_ID") Long profileId,
                                       @RequestHeader("lessonId") Long lessonId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                LessonResponseDTO responseDTO = multiService.getLesson(username, profileId, lessonId);
                return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @GetMapping("/page")
    public ResponseEntity<?> getLessonPage(@RequestHeader("Authorization") String accessToken,
                                           @RequestHeader("PROFILE_ID") Long profileId,
                                           @RequestHeader("Page") int page) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                Page<LessonResponseDTO> responseDTOPage = multiService.getLessonPage(username, profileId, page);
                return ResponseEntity.status(HttpStatus.OK).body(responseDTOPage);
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @PutMapping
    public ResponseEntity<?> updateLesson(@RequestHeader("Authorization") String accessToken,
                                          @RequestHeader("PROFILE_ID") Long profileId,
                                          @RequestBody LessonRequestDTO requestDTO) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                LessonResponseDTO responseDTO = multiService.updateLesson(username, profileId, requestDTO.getId(), requestDTO.getCenterId(), requestDTO.getName(),
                        requestDTO.getContent(), requestDTO.getStartDate(), requestDTO.getEndDate(), requestDTO.getStartTime(), requestDTO.getEndTime());
                return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @DeleteMapping
    public ResponseEntity<?> deleteLesson(@RequestHeader("Authorization") String accessToken,
                                          @RequestHeader("PROFILE_ID") Long profileId,
                                          @RequestHeader("lessonId") Long lessonId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                multiService.deleteLesson(username, profileId, lessonId);
                return ResponseEntity.status(HttpStatus.OK).body("문제 없음");
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }
}
