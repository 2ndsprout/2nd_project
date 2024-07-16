package com.second_team.apt_project.dtos;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ImageResponseDTO {
    private String url;
    private String key;

    @Builder
    public ImageResponseDTO(String url, String key) {
        this.url = url;
        this.key = key;
    }
}
