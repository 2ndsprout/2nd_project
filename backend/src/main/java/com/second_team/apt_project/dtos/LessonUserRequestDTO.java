package com.second_team.apt_project.dtos;

import lombok.Getter;

@Getter
public class LessonUserRequestDTO {
    private Long id;
    private Long lessonId;
    private int type;
}
