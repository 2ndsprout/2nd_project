package com.second_team.apt_project.dtos;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ChatMessageResponseDTO {
    private Long id;
    private ProfileResponseDTO profileResponseDTO;
    private Long createDate;

    @Builder
    public ChatMessageResponseDTO(Long id, ProfileResponseDTO profileResponseDTO, Long createDate) {
        this.id = id;
        this.profileResponseDTO = profileResponseDTO;
        this.createDate = createDate;
    }
}
