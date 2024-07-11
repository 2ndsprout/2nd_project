package com.second_team.apt_project.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AptRequestDTO {
    private Long aptId;
    private String roadAddress; // 도로명주소
    private String aptName; // 아파트 이름
    private Double x; // 위도
    private Double y; // 경도
    private String url;
}
