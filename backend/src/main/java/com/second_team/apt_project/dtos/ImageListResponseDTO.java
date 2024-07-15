package com.second_team.apt_project.dtos;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class ImageListResponseDTO {
    private String key;
    private String value;

    @Builder
    public ImageListResponseDTO(String key, String value) {
        this.key = key;
        this.value = value;
    }
}
