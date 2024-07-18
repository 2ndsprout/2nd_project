package com.second_team.apt_project.controllers;

import com.second_team.apt_project.dtos.TagRequestDTO;
import com.second_team.apt_project.dtos.TagResponseDTO;
import com.second_team.apt_project.exceptions.DataNotFoundException;
import com.second_team.apt_project.records.TokenRecord;
import com.second_team.apt_project.services.MultiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tag")
public class TagController {
    private final MultiService multiService;

    @PostMapping
    public ResponseEntity<?> saveTag(@RequestHeader("Authorization") String accessToken,
                                     @RequestHeader("PROFILE_ID") Long profileId,
                                     @RequestBody TagRequestDTO requestDTO) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                TagResponseDTO responseDTO = multiService.saveTag(requestDTO.getName(),profileId, username);
                return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
            }
        } catch (DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @GetMapping
    public ResponseEntity<?> getTag(@RequestHeader("Authorization") String accessToken,
                                     @RequestHeader("PROFILE_ID") Long profileId,
                                     @RequestHeader("TagId")Long tagId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                TagResponseDTO responseDTO = multiService.getTag(username, profileId, tagId);
                return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
            }
        } catch (IllegalArgumentException | DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

}
