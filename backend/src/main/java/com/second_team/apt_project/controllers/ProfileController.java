package com.second_team.apt_project.controllers;

import com.second_team.apt_project.dtos.ProfileResponseDTO;
import com.second_team.apt_project.dtos.ProfileSaveRequestDTO;
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
@RequestMapping("/api/profile")
public class ProfileController {
    private final MultiService multiService;

    @PostMapping
    public ResponseEntity<?> saveProfile(@RequestHeader("Authorization") String accessToken, @RequestBody ProfileSaveRequestDTO requestDTO) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                ProfileResponseDTO profileResponseDTO = multiService.saveProfile(requestDTO.getName(), requestDTO.getUrl(), username);
                return tokenRecord.getResponseEntity(profileResponseDTO);
            }
        } catch (DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @GetMapping
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String accessToken, @RequestHeader("ProfileId") Long profileId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                ProfileResponseDTO responseDTO = multiService.getProfile(profileId, username);
                return tokenRecord.getResponseEntity(responseDTO);
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @GetMapping("/list")
    public ResponseEntity<?> getProfileList(@RequestHeader("Authorization") String accessToken) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                List<ProfileResponseDTO> responseDTOList = multiService.getProfileList(username);
                return tokenRecord.getResponseEntity(responseDTOList);
            }
        } catch (DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestHeader("Authorization") String accessToken, @RequestBody ProfileSaveRequestDTO requestDTO) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                ProfileResponseDTO profileResponseDTO = multiService.updateProfile(username, requestDTO.getUrl(), requestDTO.getName(), requestDTO.getId());
                return tokenRecord.getResponseEntity(profileResponseDTO);
            }
        } catch (DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }
}
