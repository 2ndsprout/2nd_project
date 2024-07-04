package com.second_team.apt_project.enums;

import lombok.Getter;

@Getter
public enum LessonStatus {

    PENDING("신청중"), APPLIED("신청완료"), CANCELLING("취소중"), CANCELLED("취소완료")
    //
    ;
    private final String status;

    LessonStatus(String status) {
        this.status = status;
    }
}
