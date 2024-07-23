package com.second_team.apt_project.dtos;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ChatRoomResponseDTO {
    private Long chatRoomId;
    private String title;
    private Long createDate;
    private List<ChatRoomUserResponseDTO> chatRoomUserResponseDTOS;
    private List<ChatMessageResponseDTO> chatMessageResponseDTOS;

    @Builder
    public ChatRoomResponseDTO(Long chatRoomId, String title, Long createDate, List<ChatRoomUserResponseDTO> chatRoomUserResponseDTOS, List<ChatMessageResponseDTO> chatMessageResponseDTOS) {
        this.chatRoomId = chatRoomId;
        this.title = title;
        this.createDate = createDate;
        this.chatRoomUserResponseDTOS = chatRoomUserResponseDTOS;
        this.chatMessageResponseDTOS = chatMessageResponseDTOS;
    }
}
