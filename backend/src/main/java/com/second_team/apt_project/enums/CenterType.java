package com.second_team.apt_project.enums;

import lombok.Getter;

@Getter
public enum CenterType {

    GYM("헬스장"), SWIMMING_POOL("수영장"), SCREEN_GOLF("스크린골프장"), LIBRARY("도서관")
    //
    ;
    private final String type;

    CenterType(String type) {
        this.type = type;
    }
}
