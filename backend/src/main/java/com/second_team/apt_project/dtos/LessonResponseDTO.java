package com.second_team.apt_project.dtos;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LessonResponseDTO {
    private Long id;
    private Long centerId;
    private String name;
    private String content;
    private Long createDate;
    private Long modifyDate;
    private Long startDate;
    private Long endDate;
    private String url;

    @Builder
    public LessonResponseDTO(Long id, Long centerId, String name, String content, Long createDate, Long modifyDate, Long startDate, Long endDate, String url) {
        this.id = id;
        this.centerId = centerId;
        this.name = name;
        this.content = content;
        this.createDate = createDate;
        this.modifyDate = modifyDate;
        this.startDate = startDate;
        this.endDate = endDate;
        this.url = url;
    }
}
