package com.second_team.apt_project.domains;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class EmailMessage {
    private String to;
    private String aptName;
    private String roadAddress;
    private Integer totalUserCount;
    private String first;
    private String last;
}
