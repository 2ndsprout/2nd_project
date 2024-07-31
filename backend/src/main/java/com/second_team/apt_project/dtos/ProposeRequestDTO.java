package com.second_team.apt_project.dtos;

import lombok.Getter;

@Getter
public class ProposeRequestDTO {

    private Long id;

    private String title;

    private String roadAddress;

    private String aptName;

    private Integer h;

    private Integer w;

    private String password;

    private Integer proposeStatus;
}
