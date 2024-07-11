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

    private List<String> urlList;
    @Builder
    public ImageResponseDTO(String url, List<String> urlList) {
        this.url = url;
        this.urlList = urlList;
    }
}
