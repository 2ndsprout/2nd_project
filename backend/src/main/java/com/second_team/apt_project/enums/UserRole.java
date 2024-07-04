package com.second_team.apt_project.enums;

public enum UserRole {
    ADMIN, SECURITY, STAFF, USER;

    public String getValue(){
        return "ROLE_"+this.name();
    }
}
