package com.second_team.apt_project.dtos;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CommentResponseDTO {
    private Long id;
    private Long articleId;
    private ProfileResponseDTO profileResponseDTO;
    private Long parentId;
    private String content;
    private Long createDate;

    @Builder
    public CommentResponseDTO(Long articleId, ProfileResponseDTO profileResponseDTO, Long parentId, String content, Long createDate, Long id) {
        this.id = id;
        this.articleId = articleId;
        this.profileResponseDTO = profileResponseDTO;
        this.parentId = parentId;
        this.content = content;
        this.createDate = createDate;
    }
}
