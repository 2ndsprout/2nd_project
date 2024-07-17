package com.second_team.apt_project.controllers;

import com.second_team.apt_project.dtos.LessonUserRequestDTO;
import com.second_team.apt_project.dtos.LessonUserResponseDTO;
import com.second_team.apt_project.exceptions.DataNotFoundException;
import com.second_team.apt_project.records.TokenRecord;
import com.second_team.apt_project.services.MultiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/lesson/user")
public class LessonUserController {
    private final MultiService multiService;

    @PostMapping
    public ResponseEntity<?> saveLessonUser(@RequestHeader("Authorization") String accessToken,
                                            @RequestHeader("PROFILE_ID") Long profileId,
                                            @RequestBody LessonUserRequestDTO requestDTO) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                LessonUserResponseDTO responseDTO = multiService.saveLessonUser(username, profileId, requestDTO.getLessonId(), requestDTO.getType());
                return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @GetMapping
    public ResponseEntity<?> getLessonUser(@RequestHeader("Authorization") String accessToken,
                                           @RequestHeader("PROFILE_ID") Long profileId,
                                           @RequestHeader("LessonUserId") Long lessonUserId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                LessonUserResponseDTO responseDTO = multiService.getLessonUser(username, profileId, lessonUserId);
                return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @GetMapping("/my/list")
    public ResponseEntity<?> getLessonUserMyList(@RequestHeader("Authorization") String accessToken,
                                           @RequestHeader("PROFILE_ID") Long profileId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                List<LessonUserResponseDTO> responseDTO = multiService.getLessonUserMyList(username, profileId);
                return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }
    @GetMapping("/staff/list")
    public ResponseEntity<?> getLessonUserStaffList(@RequestHeader("Authorization") String accessToken,
                                                 @RequestHeader("PROFILE_ID") Long profileId,
                                                       @RequestHeader("Type") int type,
                                                       @RequestHeader("LessonId") Long lessonId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                List<LessonUserResponseDTO> responseDTO = multiService.getLessonUserStaffList(username, profileId, type, lessonId);
                return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @PutMapping
    public ResponseEntity<?> updateLessonUser(@RequestHeader("Authorization") String accessToken,
                                              @RequestHeader("PROFILE_ID") Long profileId,
                                              @RequestBody LessonUserRequestDTO requestDTO) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                LessonUserResponseDTO responseDTO = multiService.updateLessonUser(username, profileId,requestDTO.getId(), requestDTO.getType());
                return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @DeleteMapping
    public ResponseEntity<?> deleteLessonUser(@RequestHeader("Authorization") String accessToken,
                                              @RequestHeader("PROFILE_ID") Long profileId,
                                              @RequestHeader("LessonUserId") Long lessonUserId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                multiService.deleteLessonUser(username, profileId, lessonUserId);
                return ResponseEntity.status(HttpStatus.OK).body("문제 없음");
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

}
