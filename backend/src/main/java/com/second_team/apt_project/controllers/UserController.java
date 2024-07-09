package com.second_team.apt_project.controllers;

import com.second_team.apt_project.Exception.DataNotFoundException;
import com.second_team.apt_project.dtos.UserResponseDTO;
import com.second_team.apt_project.dtos.UserSaveRequestDTO;
import com.second_team.apt_project.records.TokenRecord;
import com.second_team.apt_project.services.MultiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final MultiService multiService;

    @PostMapping
    public ResponseEntity<?> saveUser(@RequestHeader("Authorization") String accessToken, @RequestBody UserSaveRequestDTO requestDTO) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                multiService.saveUser(requestDTO.getName(),
                        requestDTO.getPassword(), requestDTO.getEmail(), requestDTO.getAptNum(),
                        requestDTO.getRole(), requestDTO.getAptId(), username);
                return tokenRecord.getResponseEntity("문제 없음");
            }
        } catch (IllegalArgumentException | DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }
    @PostMapping("/security")
    public ResponseEntity<?> saveSecurity(@RequestHeader("Authorization") String accessToken, @RequestBody UserSaveRequestDTO requestDTO) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                multiService.saveSecurity(requestDTO.getName(),
                        requestDTO.getPassword(), requestDTO.getEmail(), requestDTO.getAptNum(),
                        requestDTO.getRole(), requestDTO.getAptId(), username);
                return tokenRecord.getResponseEntity("문제 없음");
            }
        } catch (IllegalArgumentException | DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }
    @PostMapping("/group")
    public ResponseEntity<?> saveGroup(@RequestHeader("Authorization") String accessToken, @RequestBody UserSaveRequestDTO requestDTO) {

        TokenRecord tokenRecord = this.multiService.checkToken(accessToken);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                List<UserResponseDTO> userResponseDTOList = multiService.saveUserGroup(requestDTO.getAptNum(), requestDTO.getAptId(), username, requestDTO.getH(), requestDTO.getW());
                return tokenRecord.getResponseEntity(userResponseDTOList);
            }
        }  catch (IllegalArgumentException | DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity("문제 없음");
    }



    @GetMapping("/list")
    public ResponseEntity<?> userList(@RequestHeader("Authorization") String accessToken,
                                      @RequestHeader("AptId") Long aptId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                List<UserResponseDTO> userResponseDTOList = multiService.getUserList(username);
                return ResponseEntity.status(HttpStatus.OK).body(userResponseDTOList);
            }
        } catch (IllegalArgumentException | DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }
}
