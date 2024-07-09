package com.second_team.apt_project.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class UserResponseDTO {
    private String username;
    private Integer aptNum;
    private String email;
    private AptResponseDTO aptResponseDto;

    @Builder
    public UserResponseDTO(String username, Integer aptNum, String email, AptResponseDTO aptResponseDto) {
        this.username = username;
        this.aptNum = aptNum;
        this.email = email;
        this.aptResponseDto = aptResponseDto;
    }
}
