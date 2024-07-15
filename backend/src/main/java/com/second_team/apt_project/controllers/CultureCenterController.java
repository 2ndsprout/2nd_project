package com.second_team.apt_project.controllers;

import com.second_team.apt_project.dtos.CenterRequestDTO;
import com.second_team.apt_project.dtos.CenterResponseDTO;
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
@RequestMapping("/api/center")
public class CultureCenterController {
    private final MultiService multiService;

    @PostMapping
    public ResponseEntity<?> saveCenter(@RequestHeader("Authorization") String accessToken,
                                        @RequestHeader("PROFILE_ID") Long profileId,
                                        @RequestBody CenterRequestDTO requestDTO) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                CenterResponseDTO responseDTO = multiService.saveCenter(username, profileId, requestDTO.getType(), requestDTO.getEndDate(), requestDTO.getStartDate());
                return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @GetMapping
    public ResponseEntity<?> getCenter(@RequestHeader("Authorization") String accessToken,
                                       @RequestHeader("PROFILE_ID") Long profileId,
                                       @RequestHeader("CenterID") Long centerId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                CenterResponseDTO responseDTO = multiService.getCenter(username, profileId, centerId);
                return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }
    @GetMapping("/list")
    public ResponseEntity<?> getCenterList(@RequestHeader("Authorization") String accessToken,
                                       @RequestHeader("PROFILE_ID") Long profileId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                List<CenterResponseDTO> responseDTOList = multiService.getCenterList(username, profileId);
                return ResponseEntity.status(HttpStatus.OK).body(responseDTOList);
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @PutMapping
    public ResponseEntity<?> updateCenter(@RequestHeader("Authorization") String accessToken,
                                          @RequestHeader("PROFILE_ID") Long profileId,
                                          @RequestBody CenterRequestDTO requestDTO) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                CenterResponseDTO responseDTO = multiService.updateCenter(username, profileId,requestDTO.getId(), requestDTO.getType(), requestDTO.getEndDate(), requestDTO.getStartDate(), requestDTO.getKey());
                return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @DeleteMapping
     public ResponseEntity<?> deleteCenter(@RequestHeader("Authorization") String accessToken,
                                           @RequestHeader("PROFILE_ID") Long profileId,
                                           @RequestHeader("CenterID") Long centerId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                multiService.deleteCenter(username, profileId, centerId);
                return ResponseEntity.status(HttpStatus.OK).body("문제 없음");
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }
}
