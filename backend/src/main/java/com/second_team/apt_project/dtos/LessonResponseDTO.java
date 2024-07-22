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
    private CenterResponseDTO centerResponseDTO;
    private ProfileResponseDTO profileResponseDTO;
    private String name;
    private String content;
    private Long createDate;
    private Long modifyDate;
    private Long startDate;
    private Long endDate;

    @Builder
    public LessonResponseDTO(Long id, CenterResponseDTO centerResponseDTO, ProfileResponseDTO profileResponseDTO, String name, String content, Long createDate, Long modifyDate, Long startDate, Long endDate) {
        this.id = id;
        this.centerResponseDTO = centerResponseDTO;
        this.profileResponseDTO = profileResponseDTO;
        this.name = name;
        this.content = content;
        this.createDate = createDate;
        this.modifyDate = modifyDate;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
