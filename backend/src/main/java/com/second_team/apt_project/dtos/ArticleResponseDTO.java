package com.second_team.apt_project.dtos;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Page;

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
    private Boolean topActive;
    private List<TagResponseDTO> tagResponseDTOList;
    private Page<CommentResponseDTO> commentResponseDTOList;
    private int commentSize;
    private int loveSize;

    @Builder
    public ArticleResponseDTO(Long articleId,int loveSize,int commentSize, String title, String content, Long createDate, Long modifyDate, String categoryName, ProfileResponseDTO profileResponseDTO, List<String> urlList, List<TagResponseDTO> tagResponseDTOList, Boolean topActive,Page<CommentResponseDTO> commentResponseDTOList) {
        this.articleId = articleId;
        this.title = title;
        this.content = content;
        this.createDate = createDate;
        this.modifyDate = modifyDate;
        this.topActive = topActive;
        this.categoryName = categoryName;
        this.profileResponseDTO = profileResponseDTO;
        this.urlList = urlList;
        this.tagResponseDTOList = tagResponseDTOList;
        this.commentResponseDTOList = commentResponseDTOList;
        this.commentSize = commentSize;
        this.loveSize = loveSize;
    }
}
