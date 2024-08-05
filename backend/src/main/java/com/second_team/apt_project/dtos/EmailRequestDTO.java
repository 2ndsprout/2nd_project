package com.second_team.apt_project.dtos;

import lombok.Getter;

@Getter
public class EmailRequestDTO {

    private String to;
    private String aptName;
    private String roadAddress;
    private Integer totalUserCount;
    private String first;
    private String last;
}
