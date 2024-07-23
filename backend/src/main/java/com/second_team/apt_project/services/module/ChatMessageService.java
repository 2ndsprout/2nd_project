package com.second_team.apt_project.services.module;

import com.second_team.apt_project.domains.ChatMessage;
import com.second_team.apt_project.domains.ChatRoom;
import com.second_team.apt_project.repositories.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;

    public List<ChatMessage> findByChatRoomList(ChatRoom chatRoom) {
        return chatMessageRepository.findByChatRoomList(chatRoom);
    }

    public void delete(ChatMessage chatMessage) {
        chatMessageRepository.delete(chatMessage);
    }
}
