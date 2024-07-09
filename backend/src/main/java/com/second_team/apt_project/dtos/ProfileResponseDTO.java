package com.second_team.apt_project.dtos;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProfileResponseDTO {
    private Long id;
    private String name;
    private String userName;
    private String url;

    @Builder
    public ProfileResponseDTO(Long id, String name, String userName, String url) {
        this.id = id;
        this.name = name;
        this.userName = userName;
        this.url = url;
    }
}
