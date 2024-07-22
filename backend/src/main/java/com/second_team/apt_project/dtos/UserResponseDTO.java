package com.second_team.apt_project.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class UserResponseDTO {
    private String username;
    private Integer aptNum;
    private String email;
    private AptResponseDTO aptResponseDTO;
    private Long createDate;
    private Long modifyDate;
    private String role;


    @Builder
    public UserResponseDTO(String username, Integer aptNum, String email, AptResponseDTO aptResponseDTO, Long createDate, Long modifyDate, String role) {
        this.username = username;
        this.aptNum = aptNum;
        this.email = email;
        this.aptResponseDTO = aptResponseDTO;
        this.createDate = createDate;
        this.modifyDate = modifyDate;
        this.role = role;
    }
}
