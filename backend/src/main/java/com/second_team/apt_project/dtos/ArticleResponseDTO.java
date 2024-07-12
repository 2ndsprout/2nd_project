package com.second_team.apt_project.dtos;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ArticleResponseDTO {
    private Long articleId;
    private String title;
    private String content;
    private Long createDate;
    private Long modifyDate;
    private String categoryName;
    private ProfileResponseDTO profileResponseDTO;
    private List<String> urlList;
    private List<String> tagNameList;

    @Builder
    public ArticleResponseDTO(Long articleId, String title, String content, Long createDate, Long modifyDate, String categoryName, ProfileResponseDTO profileResponseDTO, List<String> urlList, List<String> tagNameList) {
        this.articleId = articleId;
        this.title = title;
        this.content = content;
        this.createDate = createDate;
        this.modifyDate = modifyDate;
        this.categoryName = categoryName;
        this.profileResponseDTO = profileResponseDTO;
        this.urlList = urlList;
        this.tagNameList = tagNameList;
    }
}
