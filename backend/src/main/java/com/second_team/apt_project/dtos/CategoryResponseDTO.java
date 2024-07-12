package com.second_team.apt_project.dtos;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CategoryResponseDTO {
    private Long id;
    private String name;
    private Long createDate;
    private Long modifyDate;
    @Builder
    public CategoryResponseDTO(Long id, String name, Long createDate, Long modifyDate) {
        this.id = id;
        this.name = name;
        this.createDate = createDate;
        this.modifyDate = modifyDate;
    }
}
