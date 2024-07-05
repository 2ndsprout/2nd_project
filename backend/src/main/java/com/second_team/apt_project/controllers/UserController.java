package com.second_team.apt_project.controllers;

import com.second_team.apt_project.Exception.DataDuplicateException;
import com.second_team.apt_project.dtos.UserSaveRequestDTO;
import com.second_team.apt_project.records.TokenRecord;
import com.second_team.apt_project.services.MultiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final MultiService multiService;

    @PostMapping
    public ResponseEntity<?> saveUser(@RequestHeader("Authorization") String accessToken, @RequestBody UserSaveRequestDTO requestDTO) {
        try {
            TokenRecord tokenRecord = this.multiService.checkToken(accessToken);
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                multiService.saveUser(requestDTO.getName(),
                        requestDTO.getPassword(), requestDTO.getEmail(), requestDTO.getAptNumber(),
                        requestDTO.getRole(), requestDTO.getAptId(), username);
            }
            return tokenRecord.getResponseEntity("문제 없음");
        } catch (DataDuplicateException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }
    @PostMapping("/security")
    public ResponseEntity<?> saveSecurity(@RequestHeader("Authorization") String accessToken, @RequestBody UserSaveRequestDTO requestDTO) {
        try {
            TokenRecord tokenRecord = this.multiService.checkToken(accessToken);
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                multiService.saveSecurity(requestDTO.getName(),
                        requestDTO.getPassword(), requestDTO.getEmail(), requestDTO.getAptNumber(),
                        requestDTO.getRole(), requestDTO.getAptId(), username);
            }
            return tokenRecord.getResponseEntity("문제 없음");
        } catch (DataDuplicateException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }
}
