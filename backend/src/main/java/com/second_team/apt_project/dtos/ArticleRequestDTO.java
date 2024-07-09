package com.second_team.apt_project.dtos;

import lombok.Getter;

@Getter
public class ArticleRequestDTO {
    private Long categoryId;
    private Long profileId;
    private String title;
    private String content;
    private Boolean topActive;
}
