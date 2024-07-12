package com.second_team.apt_project.controllers;

import com.second_team.apt_project.dtos.AuthRequestDTO;
import com.second_team.apt_project.dtos.AuthResponseDTO;
import com.second_team.apt_project.dtos.ProfileResponseDTO;
import com.second_team.apt_project.services.MultiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final MultiService multiService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequestDTO requestDto) {
        try {
            AuthResponseDTO responseDto = this.multiService.login(requestDto);
            return ResponseEntity.status(HttpStatus.OK).body(responseDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestHeader("REFRESH_TOKEN") String refreshToken) {
        String newAccessToken = this.multiService.refreshToken(refreshToken);
        return ResponseEntity.status(HttpStatus.OK).body(newAccessToken);
    }

}