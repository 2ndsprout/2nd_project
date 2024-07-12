package com.second_team.apt_project.dtos;

import lombok.Getter;

import java.util.List;

@Getter
public class ArticleRequestDTO {
    private Long categoryId;
    private String title;
    private String content;
    private Boolean topActive;
    private List<Long> tagId;
    private List<String> url;
}
