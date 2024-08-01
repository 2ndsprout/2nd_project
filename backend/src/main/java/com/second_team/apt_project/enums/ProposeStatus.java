package com.second_team.apt_project.enums;

import lombok.Getter;

@Getter
public enum ProposeStatus {

    PENDING("대기중"), APPROVED("승인완료"), CANCELLING("반려중")
    //
    ;
    private final String status;


    ProposeStatus(String status) {
        this.status = status;
    }
}
