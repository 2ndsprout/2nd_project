package com.second_team.apt_project.controllers;

import com.second_team.apt_project.exceptions.DataNotFoundException;
import com.second_team.apt_project.dtos.UserResponseDTO;
import com.second_team.apt_project.dtos.UserSaveRequestDTO;
import com.second_team.apt_project.records.TokenRecord;
import com.second_team.apt_project.services.MultiService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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
    public ResponseEntity<?> saveUser(@RequestHeader("Authorization") String accessToken,
                                      @RequestBody UserSaveRequestDTO requestDTO,
                                      @RequestHeader("PROFILE_ID") Long profileId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                UserResponseDTO userResponseDTO = multiService.saveUser(requestDTO.getName(),
                        requestDTO.getPassword(), requestDTO.getEmail(), requestDTO.getAptNum(),
                        requestDTO.getRole(), requestDTO.getAptId(), username);
                return ResponseEntity.status(HttpStatus.OK).body(userResponseDTO);
            }
        } catch (IllegalArgumentException | DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }
    @PostMapping("/group")
    public ResponseEntity<?> saveGroup(@RequestHeader("Authorization") String accessToken,
                                       @RequestBody UserSaveRequestDTO requestDTO,
                                       @RequestHeader("PROFILE_ID") Long profileId) {

        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                List<UserResponseDTO> userResponseDTOList = multiService.saveUserGroup(requestDTO.getAptNum(), requestDTO.getAptId(), username, requestDTO.getH(), requestDTO.getW());
                return ResponseEntity.status(HttpStatus.OK).body(userResponseDTOList);
            }
        }  catch (IllegalArgumentException | DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @PutMapping
    public ResponseEntity<?> updateUser(@RequestHeader("Authorization") String accessToken,
                                        @RequestBody UserSaveRequestDTO requestDTO) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                UserResponseDTO userResponseDTO = multiService.updateUser(username, requestDTO.getEmail());
                return ResponseEntity.status(HttpStatus.OK).body(userResponseDTO);
            }
        }  catch (IllegalArgumentException | DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }
    @GetMapping
    public ResponseEntity<?> getUser(@RequestHeader("Authorization") String accessToken) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                UserResponseDTO userResponseDTO = multiService.getUser(username);
                return ResponseEntity.status(HttpStatus.OK).body(userResponseDTO);
            }
        } catch (DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @GetMapping("/detail")
    public ResponseEntity<?> userDetail(@RequestHeader("Authorization") String accessToken,
                                        @RequestHeader("Username") String userId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                UserResponseDTO userResponseDTO = multiService.getUserDetail(userId, username);
                return ResponseEntity.status(HttpStatus.OK).body(userResponseDTO);
            }
        } catch (IllegalArgumentException | DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @GetMapping("/list")
    public ResponseEntity<?> userList(@RequestHeader("Authorization") String accessToken,
                                      @RequestHeader("Page") int page,
                                      @RequestHeader("AptId") Long aptId,
                                      @RequestHeader("PROFILE_ID") Long profileId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                Page<UserResponseDTO> userResponseDTOList = multiService.getUserList(page, aptId, username);
                return ResponseEntity.status(HttpStatus.OK).body(userResponseDTOList);
            }
        } catch (IllegalArgumentException | DataNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@RequestHeader("Authorization") String accessToken,
                                            @RequestBody UserSaveRequestDTO userSaveRequestDTO) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                multiService.updatePassword(username, userSaveRequestDTO.getPassword(), userSaveRequestDTO.getNewPassword1(), userSaveRequestDTO.getNewPassword2());
                return ResponseEntity.status(HttpStatus.OK).body("문제 없음");
            }
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }
}
