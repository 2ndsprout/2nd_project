package com.second_team.apt_project.controllers;

import com.second_team.apt_project.dtos.ImageListResponseDTO;
import com.second_team.apt_project.dtos.ImageRequestDTO;
import com.second_team.apt_project.dtos.ImageResponseDTO;
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
@RequestMapping("/api/image")
public class ImageController {
    private final MultiService multiService;

    @PostMapping
    public ResponseEntity<?> tempImage(@RequestHeader("Authorization") String accessToken,
                                       @RequestHeader("PROFILE_ID") Long profileId,ImageRequestDTO requestDTO) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                ImageResponseDTO imageResponseDTO = multiService.tempUpload(requestDTO.getFile(),profileId, username);
                return ResponseEntity.status(HttpStatus.OK).body(imageResponseDTO);
            }
        } catch (DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }


    @PostMapping("/profile")
    public ResponseEntity<?> tempImageProfile(@RequestHeader("Authorization") String accessToken,
                                       ImageRequestDTO requestDTO) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                ImageResponseDTO imageResponseDTO = multiService.tempUploadProfile(requestDTO.getFile(), username);
                return ResponseEntity.status(HttpStatus.OK).body(imageResponseDTO);
            }
        } catch (DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }


    @PostMapping("/list")
    public ResponseEntity<?> tempImageList(@RequestHeader("Authorization") String accessToken,
                                           @RequestHeader("PROFILE_ID") Long profileId,
                                           ImageRequestDTO requestDTO) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                List<ImageListResponseDTO> imageListResponseDTOS = multiService.tempUploadList(requestDTO.getFile(),profileId, username);
                return ResponseEntity.status(HttpStatus.OK).body(imageListResponseDTOS);
            }
        } catch (DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @DeleteMapping("/list")
    public ResponseEntity<?> deleteImageList(@RequestHeader("Authorization") String accessToken,
                                           @RequestHeader("PROFILE_ID") Long profileId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                this.multiService.deleteImageList(username,profileId);
                return ResponseEntity.status(HttpStatus.OK).body("문제 없음");
            }
        } catch (DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

}
