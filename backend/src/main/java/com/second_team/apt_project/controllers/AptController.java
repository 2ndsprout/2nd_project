package com.second_team.apt_project.controllers;

import com.second_team.apt_project.dtos.AptRequestDTO;
import com.second_team.apt_project.dtos.AptResponseDTO;
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
@RequestMapping("/api/apt")
public class AptController {
    private final MultiService multiService;

    @PostMapping
    public ResponseEntity<?> saveApt(@RequestBody AptRequestDTO aptRequestDto,
                                  @RequestHeader("Authorization") String accessToken,
                                  @RequestHeader("PROFILE_ID") Long profileId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                AptResponseDTO aptResponseDTO = this.multiService.saveApt(aptRequestDto.getRoadAddress(), aptRequestDto.getAptName(), aptRequestDto.getX(), aptRequestDto.getY(), username);
                return ResponseEntity.status(HttpStatus.OK).body(aptResponseDTO);
            }
        } catch (IllegalArgumentException | DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @PutMapping
    public ResponseEntity<?> updateApt(@RequestBody AptRequestDTO aptRequestDTO,
                                    @RequestHeader("Authorization") String accessToken,
                                    @RequestHeader("PROFILE_ID") Long profileId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                AptResponseDTO aptResponseDTO = multiService.updateApt(profileId, aptRequestDTO.getAptId(), aptRequestDTO.getRoadAddress(), aptRequestDTO.getAptName(), aptRequestDTO.getUrl(), username);
                return ResponseEntity.status(HttpStatus.OK).body(aptResponseDTO);
            }
        } catch (IllegalArgumentException | DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @GetMapping
    public ResponseEntity<?> AptDetail(@RequestHeader("Authorization") String accessToken,
                                    @RequestHeader("AptId") Long aptId,
                                    @RequestHeader("PROFILE_ID") Long profileId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                AptResponseDTO aptResponseDTO = multiService.getAptDetail(aptId, username);
                return ResponseEntity.status(HttpStatus.OK).body(aptResponseDTO);
            }
        } catch (IllegalArgumentException | DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @GetMapping("/list")
    public ResponseEntity<?> AptList(@RequestHeader("Authorization") String accessToken,
                                  @RequestHeader("PROFILE_ID") Long profileId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                List<AptResponseDTO> aptResponseDTOList = multiService.getAptList(username);
                return ResponseEntity.status(HttpStatus.OK).body(aptResponseDTOList);
            }
        } catch (IllegalArgumentException | DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

}
