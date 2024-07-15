package com.second_team.apt_project.dtos;

import com.second_team.apt_project.enums.CenterType;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class CenterResponseDTO {
    private Long id;
    private String type;
    private Long startDate;
    private Long endDate;
    private Long createDate;
    private Long modifyDate;
    private List<ImageListResponseDTO> imageListResponseDTOS;

    @Builder
    public CenterResponseDTO(Long id, String type, Long startDate, Long endDate, Long createDate, Long modifyDate, List<ImageListResponseDTO> imageListResponseDTOS) {
        this.id = id;
        this.type = type;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createDate = createDate;
        this.modifyDate = modifyDate;
        this.imageListResponseDTOS = imageListResponseDTOS;
    }
}
