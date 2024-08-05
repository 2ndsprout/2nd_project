package com.second_team.apt_project.dtos;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProposeResponseDTO {

    private Long id;
    private String title;
    private String roadAddress;
    private String aptName;
    private Integer min;
    private Integer max;
    private Integer h;
    private Integer w;
    private String proposeStatus;
    private String email;
    private Long createDate;
    private Long modifyDate;

    @Builder
    public ProposeResponseDTO(Long id, String email, String title, String roadAddress, String aptName, Integer min, Integer max, Integer h, Integer w, String proposeStatus, Long createDate, Long modifyDate) {
        this.id = id;
        this.title = title;
        this.roadAddress = roadAddress;
        this.aptName = aptName;
        this.min = min;
        this.max = max;
        this.h = h;
        this.w = w;
        this.email = email;
        this.proposeStatus = proposeStatus;
        this.createDate = createDate;
        this.modifyDate = modifyDate;
    }
}
