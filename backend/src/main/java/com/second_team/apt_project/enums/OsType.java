package com.second_team.apt_project.enums;

import lombok.Getter;

@Getter
public enum OsType {
    Window("C:/web/apt_project"), Linux("/home/ubuntu/apt_project/data")
    //
    ;
    private final String loc;

    OsType(String loc) {
        this.loc = loc;
    }

    public static OsType getOsType() {
        String osName= System.getProperty("os.name").toLowerCase();

        if(osName.contains("window"))  return Window;
        if(osName.contains("linux"))  return Linux;


        return null;
    }
}