package com.second_team.apt_project;

import com.second_team.apt_project.Exception.DataNotFoundException;
import com.second_team.apt_project.enums.OsType;
import lombok.Getter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AptProjectApplication {
    @Getter
    private static OsType osType;

    public static void main(String[] args) {
        osType = OsType.getOsType();
        if (osType != null) SpringApplication.run(AptProjectApplication.class, args);
        else throw new DataNotFoundException("없는 OS 입니다.");
    }

}
