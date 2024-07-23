package com.second_team.apt_project.controllers;

import com.second_team.apt_project.dtos.ChatRoomRequestDTO;
import com.second_team.apt_project.dtos.ChatRoomResponseDTO;
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
@RequestMapping("/api/chat")
public class ChatController {
    private final MultiService multiService;

    @PostMapping
    public ResponseEntity<?> saveChatRoom(@RequestHeader("Authorization") String accessToken,
                                      @RequestHeader("PROFILE_ID") Long profileId,
                                      @RequestBody ChatRoomRequestDTO requestDTO) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                ChatRoomResponseDTO responseDTO = multiService.saveChatRoom(username, requestDTO.getProfileId(), profileId, requestDTO.getTitle());
                return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @GetMapping
    public ResponseEntity<?> chatRoomDetail(@RequestHeader("Authorization") String accessToken,
                                            @RequestHeader("PROFILE_ID") Long profileId,
                                            @RequestHeader("ChatRoomId") Long chatRoomId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                ChatRoomResponseDTO responseDTO = multiService.ChatRoomDetail(username, profileId, chatRoomId);
                return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @GetMapping("/list")
    public ResponseEntity<?> chatRoomMyList(@RequestHeader("Authorization") String accessToken,
                                            @RequestHeader("PROFILE_ID") Long profileId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                List<ChatRoomResponseDTO> responseDTO = multiService.ChatRoomMyList(username, profileId);
                return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @PutMapping
    public ResponseEntity<?> chatRoomUpdate(@RequestHeader("Authorization") String accessToken,
                                            @RequestHeader("PROFILE_ID") Long profileId,
                                            @RequestBody ChatRoomRequestDTO chatRoomRequestDTO) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                ChatRoomResponseDTO responseDTO = multiService.ChatRoomUpdate(username, profileId, chatRoomRequestDTO.getId(), chatRoomRequestDTO.getTitle());
                return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @PutMapping("/user/add")
    public ResponseEntity<?> chatRoomUserUpdate(@RequestHeader("Authorization") String accessToken,
                                                @RequestHeader("PROFILE_ID") Long profileId,
                                                @RequestBody ChatRoomRequestDTO chatRoomRequestDTO) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                ChatRoomResponseDTO responseDTO = multiService.ChatRoomUserUpdate(username, profileId, chatRoomRequestDTO.getId(), chatRoomRequestDTO.getProfileId());
                return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }

    @DeleteMapping
    public ResponseEntity<?> chatRoomUserOut(@RequestHeader("Authorization") String accessToken,
                                             @RequestHeader("PROFILE_ID") Long profileId,
                                             @RequestHeader("ChatRoomId") Long chatRoomId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken, profileId);
        try {
            if (tokenRecord.isOK()) {
                String username = tokenRecord.username();
                multiService.ChatRoomUserOut(username, profileId, chatRoomId);
                return ResponseEntity.status(HttpStatus.OK).body("문제 없음");
            }
        } catch (DataNotFoundException | IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        return tokenRecord.getResponseEntity();
    }
}
