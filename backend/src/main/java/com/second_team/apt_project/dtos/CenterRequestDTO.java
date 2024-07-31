package com.second_team.apt_project.dtos;

import com.second_team.apt_project.enums.CenterType;
import lombok.Getter;

import java.sql.Time;
import java.time.LocalDateTime;
import java.util.List;

@Getter
public class CenterRequestDTO {
    private Long id;
    private int type;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
