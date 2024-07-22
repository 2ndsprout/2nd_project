package com.second_team.apt_project.enums;

import lombok.Getter;

@Getter
public enum Sorts {
    TITLE("제목"),
    TITLE_CONTENT("제목 내용"),
    PROFILE("작성자"),
    TAG("태그");

    private final String sort;

    Sorts(String sort) {
        this.sort = sort;
    }
}
