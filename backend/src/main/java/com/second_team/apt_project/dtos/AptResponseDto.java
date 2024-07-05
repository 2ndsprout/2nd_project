package com.second_team.apt_project.dtos;

import lombok.Builder;
import lombok.Getter;

@Getter
public class AptResponseDto {
    private Long aptId;
    private String roadAddress; // 도로명주소
    private String aptName; // 아파트 이름
    private Double x; // 위도
    private Double y; // 경도

    @Builder
    public AptResponseDto(Long aptId, String roadAddress, String aptName, Double x, Double y) {
        this.aptId = aptId;
        this.roadAddress = roadAddress;
        this.aptName = aptName;
        this.x = x;
        this.y = y;
    }
}
