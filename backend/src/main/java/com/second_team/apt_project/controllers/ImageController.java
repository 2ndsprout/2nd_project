package com.second_team.apt_project.controllers;

import com.second_team.apt_project.dtos.ImageRequestDTO;
import com.second_team.apt_project.dtos.ImageResponseDTO;
import com.second_team.apt_project.records.TokenRecord;
import com.second_team.apt_project.services.MultiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/image")
public class ImageController {
    private final MultiService multiService;

    @PostMapping
    public ResponseEntity<?> tempImage(@RequestHeader("Authorization") String accessToken, ImageRequestDTO requestDTO) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                ImageResponseDTO imageResponseDTO = multiService.tempUpload(requestDTO.getFile(), username);
                return tokenRecord.getResponseEntity(imageResponseDTO);
            }
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

}
