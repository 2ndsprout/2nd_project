package com.second_team.apt_project.enums;

public enum UserRole {
    ADMIN, SECURITY, USER, TEACHER
    //
    ;
    public String getValue(){
        return "ROLE_"+this.name();
    }
}
