package com.second_team.apt_project.dtos;

import lombok.Getter;

import java.sql.Time;
import java.time.LocalDateTime;

@Getter
public class LessonRequestDTO {
    private Long id;
    private Long centerId;
    private String name;
    private String content;
    private LocalDateTime startDate;
    private LocalDateTime endDate;


}
