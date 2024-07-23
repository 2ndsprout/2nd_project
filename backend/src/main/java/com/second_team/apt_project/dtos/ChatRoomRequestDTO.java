package com.second_team.apt_project.dtos;

import lombok.Getter;

import java.util.List;

@Getter
public class ChatRoomRequestDTO {
    private Long id;
    private List<Long> profileId;
    private String title;
}
