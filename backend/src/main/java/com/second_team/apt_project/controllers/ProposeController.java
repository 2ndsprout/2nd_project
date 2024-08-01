package com.second_team.apt_project.controllers;

import com.second_team.apt_project.dtos.ProposeRequestDTO;
import com.second_team.apt_project.dtos.ProposeResponseDTO;
import com.second_team.apt_project.records.TokenRecord;
import com.second_team.apt_project.services.MultiService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/propose")
public class ProposeController {

    private final MultiService multiService;

    @PostMapping
    public ResponseEntity<?> savePropose(@RequestHeader("Authorization") String accessToken,
                                         @RequestBody ProposeRequestDTO requestDto) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken);
        try {
            ProposeResponseDTO proposeResponseDTO = this.multiService.savePropose(requestDto);
            return ResponseEntity.status(HttpStatus.OK).body(proposeResponseDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> proposeList (@RequestHeader("Authorization") String accessToken,
                                          @RequestHeader(value = "Page", defaultValue = "0") int page) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken);
        try {
                String username = tokenRecord.username();
                Page<ProposeResponseDTO> proposeResponseDTOS = this.multiService.getProposePage(page);
                return ResponseEntity.status(HttpStatus.OK).body(proposeResponseDTOS);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getPropose (@RequestHeader("Authorization") String accessToken,
                                         @RequestHeader("Password") String password,
                                         @RequestHeader("ProposeId") Long proposeId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken);
        try {
                String username = tokenRecord.username();
                ProposeResponseDTO proposeResponseDTO = this.multiService.getPropose(username, proposeId, password);
                return ResponseEntity.status(HttpStatus.OK).body(proposeResponseDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping
    public ResponseEntity<?> deletePropose (@RequestHeader("Authorization") String accessToken,
                                            @RequestHeader("Password") String password,
                                            @RequestHeader("ProposeId") Long proposeId) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken);
        try {
                String username = tokenRecord.username();
                this.multiService.deletePropose(username, proposeId, password);
                return ResponseEntity.status(HttpStatus.OK).body("삭제 완료");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping
    public ResponseEntity<?> updatePropose (@RequestHeader("Authorization") String accessToken,
                                            @RequestBody ProposeRequestDTO requestDto) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken);
        try {
                String username = tokenRecord.username();
                ProposeResponseDTO proposeResponseDTO = this.multiService.updatePropose(username, requestDto);
                return ResponseEntity.status(HttpStatus.OK).body(proposeResponseDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
