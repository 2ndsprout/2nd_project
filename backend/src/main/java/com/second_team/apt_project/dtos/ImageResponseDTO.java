package com.second_team.apt_project.dtos;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ImageResponseDTO {
    private String url;

    @Builder
    public ImageResponseDTO(String url) {
        this.url = url;
    }
}
