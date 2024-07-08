package com.second_team.apt_project.dtos;

import com.second_team.apt_project.domains.Apt;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class UserResponseDTO {
    private String username;
    private Integer aptNum;
    private String email;
    //private Apt apt;
    private AptResponseDto aptResponseDto;

    @Builder
    public UserResponseDTO(String username, Integer aptNum, String email, AptResponseDto aptResponseDto) {
        this.username = username;
        this.aptNum = aptNum;
        this.email = email;
        //this.apt = apt;
        this.aptResponseDto = aptResponseDto;
    }
}
