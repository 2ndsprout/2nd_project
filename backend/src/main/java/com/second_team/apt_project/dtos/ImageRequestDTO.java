package com.second_team.apt_project.dtos;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class ImageRequestDTO {
    private MultipartFile file;
}
