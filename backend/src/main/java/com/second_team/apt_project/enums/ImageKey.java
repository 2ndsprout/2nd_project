package com.second_team.apt_project.enums;

import lombok.Getter;

@Getter
public enum ImageKey {
    USER, MESSAGE, ARTICLE, TEMP, MULTI, APT, CENTER, LESSON
    //
    ;
    public String getKey(String value){
        return this.name()+"."+value;
    }
}
