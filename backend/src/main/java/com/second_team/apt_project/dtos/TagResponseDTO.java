package com.second_team.apt_project.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class TagResponseDTO {
    private Long id;
    private String name;

    @Builder
    public TagResponseDTO(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}
