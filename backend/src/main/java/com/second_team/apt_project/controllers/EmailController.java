package com.second_team.apt_project.controllers;

import com.second_team.apt_project.dtos.EmailRequestDTO;
import com.second_team.apt_project.records.TokenRecord;
import com.second_team.apt_project.services.MultiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/email")
public class EmailController {

    private final MultiService multiService;

    @PostMapping
    public ResponseEntity<?> savePropose(@RequestHeader("Authorization") String accessToken,
                                         @RequestBody EmailRequestDTO requestDto) {
        TokenRecord tokenRecord = this.multiService.checkToken(accessToken);
        try {
            String username = tokenRecord.username();
            this.multiService.sendEmail(username, requestDto);
            return ResponseEntity.status(HttpStatus.OK).body("mail send success");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}
