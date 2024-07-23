package com.second_team.apt_project.dtos;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ChatRoomUserResponseDTO {
    private Long id;
    private String profileName;

    @Builder
    public ChatRoomUserResponseDTO(Long id, String profileName) {
        this.id = id;
        this.profileName = profileName;
    }
}
